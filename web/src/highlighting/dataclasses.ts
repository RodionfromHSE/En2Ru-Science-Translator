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
   */
  constructor(public tokens: [Token[], Token[]]) {}

  public getText(tokens: Token[]): string {
    return tokens.map((token) => token.text).join("");
  }
}
