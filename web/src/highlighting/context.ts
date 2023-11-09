import { Controller } from "@/highlighting/Controller.ts";
import InvisibleMark from "@/components/InvisibleMark.tsx";

export class TokenAttentionScore {
  /**
   * Holder for a token in the cross-attention matrix. It contains the token's
   * index and the attention score.
   * @param tokenIndex The index of the token in the other textarea.
   * @param attentionScore The attention score for the token.
   */
  constructor(
    public tokenIndex: number,
    public attentionScore: number,
  ) {}
}

export class TokenProbScore {
  /**
   * Holder for a token and its probability to be displayed in the synonym UI.
   *
   * @param {string} tokenText - The text of the token.
   * @param {number} prob - The probability associated with the token.
   */
  constructor(
    public tokenText: string,
    public prob: number,
  ) {}
}

export class Token {
  /**
   * Token class to hold all token information from the model.
   * @param text The text of the token.
   * @param attentionScores Cross-attention scores for the token.
   * @param probScores Probabilities for the synonyms of the token.
   */
  constructor(
    public text: string,
    public attentionScores?: TokenAttentionScore[],
    public probScores?: TokenProbScore[],
  ) {}
}

/**
 * Data class to hold the service data from the model.
 */
export class TranslationData {
  /**
   * Translation data class to hold the service data from the model.
   * @param tokens Input and Output tokens from the model.
   * @param controller Controller class to handle highlight and text updates.
   */
  constructor(
    public tokens: [Token[], Token[]],
    public controller: Controller,
  ) {}

  /**
   * Returns the concatenated text from the tokens
   * @param tokens The tokens to concatenate
   * @returns The concatenated text from the tokens
   */
  private getText(tokens: Token[]): string {
    return tokens.map((token) => token.text).join("");
  }

  /**
   * Returns highlighter object to be used when no tokens are hovered over.
   * All tokens are inside transparent spans, with hover detection on the spans.
   * On hover, the global highlighter is updated.
   *
   * @returns The highlighter object.
   */
  private getDefaultHighlighter(index: number): any[] {
    const curTokens = this.tokens[index];
    const otherTokens = this.tokens[1 - index];

    // Create a list of token ranges for the other text area.
    let otherTokenRanges: [number, number][] = [];
    let curIndex = 0;
    for (const token of otherTokens) {
      const tokenLength = token.text.length;
      otherTokenRanges.push([curIndex, curIndex + tokenLength]);
      curIndex += tokenLength;
    }

    return curTokens.map((token) => {
      const hoveredHighlight = token.attentionScores
        ?.map((score) => {
          const className = this.attentionStyle(score.attentionScore);
          if (className === undefined) {
            return undefined;
          }
          return {
            highlight: otherTokenRanges[score.tokenIndex],
            className: className,
          };
        })
        .filter((highlight) => highlight?.className !== undefined);
      return {
        highlight: token.text,
        component: InvisibleMark(
          token.probScores,
          this,
          hoveredHighlight,
          index,
        ),
      };
    });
  }

  public updateDefault() {
    console.log(
      "Texts: ",
      this.getText(this.tokens[0]),
      this.getText(this.tokens[1]),
    );
    console.log(
      "Highlights: ",
      this.getDefaultHighlighter(0),
      this.getDefaultHighlighter(1),
    );

    this.controller.setInputs[0](this.getText(this.tokens[0]));
    this.controller.setInputs[1](this.getText(this.tokens[1]));
    this.controller.setHighlights[0](this.getDefaultHighlighter(0));
    this.controller.setHighlights[1](this.getDefaultHighlighter(1));
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
}
