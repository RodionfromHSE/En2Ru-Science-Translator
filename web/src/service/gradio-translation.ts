import {
  Token,
  TokenAttentionScore,
  TokenProbScore,
} from "@/highlighting/context.ts";
import TranslationService from "@/service/translation-service.ts";
import { client } from "@gradio/client";

export class GradioTranslation implements TranslationService {
  private gradioClient: Promise<any>;

  constructor() {
    this.gradioClient = client(
      "https://waleko-gradio-transformer-en-ru.hf.space/--replicas/42v9l/",
      {},
    );
  }

  healthCheck(): Promise<boolean> {
    return Promise.resolve(true);
  }

  async predict(text: string): Promise<[Token[], Token[]]> {
    // @ts-ignore
    const client = await this.gradioClient;
    const result = await client.predict("/predict", [text]);

    const obj = result.data[0];
    console.log(obj);

    const inputTokens = this.populateTokenInfo(
      text,
      obj.input_tokens,
      obj.cross_attention,
      true,
    );
    const outputTokens = this.populateTokenInfo(
      obj.output_text,
      obj.output_tokens,
      obj.cross_attention,
      false,
      obj.output_scores,
    );

    console.log("inputTokens", inputTokens);
    console.log("outputTokens", outputTokens);
    return [inputTokens, outputTokens];
  }

  private populateTokenInfo(
    text: string,
    tokens: string[],
    attention_matrix: number[][],
    is_input: boolean,
    scores?: [string, number][][],
  ): Token[] {
    // Fix tokens (find them in text and add whitespace)
    const fixed_tokens = [];
    let last_index = 0;
    for (const token of tokens) {
      const index = text.indexOf(token, last_index);
      if (index === -1) {
        throw new Error(`Token ${token} not found in text ${text}`);
      }
      fixed_tokens.push(text.substring(last_index, index + token.length));
      last_index = index + token.length;
    }
    // Build tokens
    const token_infos = [];
    for (let i = 0; i < tokens.length; i++) {
      const token = fixed_tokens[i];
      // Build attention scores
      const attention_scores = [];
      if (is_input) {
        for (let j = 0; j < attention_matrix.length; j++) {
          attention_scores.push(
            new TokenAttentionScore(j, attention_matrix[j][i]),
          );
        }
      } else {
        for (let j = 0; j < attention_matrix[i].length; j++) {
          attention_scores.push(
            new TokenAttentionScore(j, attention_matrix[i][j]),
          );
        }
      }
      // Build prob scores
      let prob_scores = undefined;
      if (scores !== undefined) {
        prob_scores = [];
        for (const [token, score] of scores[i]) {
          prob_scores.push(new TokenProbScore(token, score));
        }
      }
      // Add token
      token_infos.push(new Token(token, attention_scores, prob_scores));
    }
    return token_infos;
  }
}
