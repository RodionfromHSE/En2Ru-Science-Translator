import {
  Token,
  TokenAttentionScore,
  TranslationData,
} from "@/highlighting/dataclasses.ts";
import InvisibleMark, { MarkId } from "@/components/InvisibleMark.tsx";

export class Controller {
  /**
   * Controller class to handle highlight and text updates.
   */
  constructor(
    public setInputs: [(text: string) => void, (text: string) => void],
    public setHighlights: [(highlight: any) => void, (highlight: any) => void],
  ) {}

  setTranslationData(translationData: TranslationData) {
    this.translationData = translationData;

    this.attentionScores = [[], []];
    this.attentionSetters.clear();
    this.isGlobalKill = false;

    this.setInputs[0](translationData.getText(translationData.tokens[0]));
    this.setInputs[1](translationData.getText(translationData.tokens[1]));
    this.setHighlights[0](this.getHighlighter(0));
    this.setHighlights[1](this.getHighlighter(1));
  }

  /**
   * Sends a global kill signal to all marks in the attention setters.
   * This is used to disable all marks styling and logic
   * when the user edits the text.
   *
   * @return {void}
   */
  sendGlobalKill(): void {
    console.log("sending global kill");
    this.isGlobalKill = true;

    // send kill signal to all marks
    for (const setter of this.attentionSetters.values()) {
      setter("killed");
    }
  }

  /**
   * Returns highlighter object to be used when no tokens are hovered over.
   * All tokens are inside transparent spans, with hover detection on the spans.
   *
   * @returns The highlighter object.
   */
  private getHighlighter(index: number): any[] {
    const curTokens = this.translationData.tokens[index];

    let curTokenRanges = this.tokenRanges(curTokens);

    return curTokens.map((token, pos) => {
      // Push the attention scores for the current token to the attentionScores array.
      this.attentionScores[index].push(token.attentionScores ?? []);
      // Return smart mark object for the token
      return {
        highlight: curTokenRanges[pos],
        component: InvisibleMark(
          token.probScores,
          new MarkId(index, pos),
          this,
        ),
      };
    });
  }

  /**
   * Registers a mark with a given mark ID and a setter function for handling attention styles.
   *
   * @param {MarkId} mark_id - The ID of the mark to register.
   * @param {function} setAttention - The setter function that allows setting attention styles for the mark.
   * @return {void}
   */
  registerMark(
    mark_id: MarkId,
    setAttention: (attn_style: string) => void,
  ): void {
    this.attentionSetters.set(mark_id.toInt(), setAttention);
  }

  /**
   * Activates a mark by setting the attention style for related tokens in the other textarea.s
   * If isGlobalKill flag is set, the mark activation is skipped.
   *
   * @param {MarkId} mark_id - The ID of the mark to activate.
   */
  activateMark(mark_id: MarkId) {
    if (this.isGlobalKill) {
      return;
    }

    const index = mark_id.index;
    const pos = mark_id.pos;

    // Set the attention style for the current token.
    const curTokenAttentionScores = this.attentionScores[index][pos];

    for (const tas of curTokenAttentionScores) {
      const style = this.attentionStyle(tas.attentionScore);
      const other_mark_id = new MarkId(1 - index, tas.tokenIndex);
      const setAttention = this.attentionSetters.get(other_mark_id.toInt());
      if (style !== undefined && setAttention !== undefined) {
        setAttention(style);
        this.lastModifier.set(other_mark_id.toInt(), mark_id);
      }
    }
  }

  /**
   * Deactivates the specified mark by setting the attention style for related tokens in the other textarea.
   *
   * @param {MarkId} mark_id - The ID of the mark to deactivate.
   */
  deactivateMark(mark_id: MarkId) {
    if (this.isGlobalKill) {
      return;
    }

    const index = mark_id.index;
    const pos = mark_id.pos;

    // Set the attention style for the current token.
    const curTokenAttentionScores = this.attentionScores[index][pos];

    for (const tas of curTokenAttentionScores) {
      const other_mark_id = new MarkId(1 - index, tas.tokenIndex);
      const setAttention = this.attentionSetters.get(other_mark_id.toInt());
      const lastModifier = this.lastModifier.get(other_mark_id.toInt());
      if (
        setAttention !== undefined &&
        lastModifier !== undefined &&
        lastModifier.equals(mark_id)
      ) {
        setAttention("");
      }
    }
  }

  private tokenRanges(otherTokens: Token[]): [number, number][] {
    let otherTokenRanges: [number, number][] = [];
    let curIndex = 0;
    for (const token of otherTokens) {
      const tokenLength = token.text.length;
      otherTokenRanges.push([curIndex, curIndex + tokenLength]);
      curIndex += tokenLength;
    }
    return otherTokenRanges;
  }

  /**
   * Returns the attention style based on the given attention score.
   *
   * @param {number} attention_score - The attention score that determines the style.
   * @return {string|undefined} The attention style, or undefined if no style is applicable.
   * @private
   */
  private attentionStyle(attention_score: number): string | undefined {
    const style_thresholds: [string, number][] = [
      ["attn5", 0.5],
      ["attn4", 0.4],
      ["attn3", 0.3],
      ["attn2", 0.2],
      ["attn1", 0.1],
    ];
    for (const [style, threshold] of style_thresholds) {
      if (attention_score >= threshold) {
        return style;
      }
    }
    return undefined;
  }

  // @ts-ignore
  private translationData: TranslationData = undefined;
  // Attention scores for the tokens in the two textareas.
  private attentionScores: [TokenAttentionScore[][], TokenAttentionScore[][]] =
    [[], []];
  // Attention setters for the tokens in the two textareas.
  private attentionSetters = new Map<number, (attn_style: string) => void>();
  // Last modifier for the tokens in the two textareas.
  private lastModifier = new Map<number, MarkId>();
  // Global kill flag to disable all marks.
  private isGlobalKill = false;
}
