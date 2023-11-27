import {
  Token,
  TokenAttentionScore,
  TokenProbScore,
} from "@/highlighting/dataclasses.ts";
import TranslationService from "@/service/translation-service.ts";

export class MockTranslationService implements TranslationService {
  healthCheck(): Promise<boolean> {
    return Promise.resolve(true);
  }
  predict(text: string): Promise<[Token[], Token[]]> {
    const rawTokens = text.split(/(?<=\s)(?=\S)/);

    const inputTokens = this.genTokenInfo(
      rawTokens,
      this.sampleTranslatedTokens,
    );
    const outputTokens = this.genTokenInfo(
      this.sampleTranslatedTokens,
      rawTokens,
    );

    console.log("inputTokens", inputTokens);
    console.log("outputTokens", outputTokens);

    // artificial timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([inputTokens, outputTokens]);
      }, 500);
    });
  }

  private genTokenInfo(curTokens: string[], otherTokens: string[]) {
    return curTokens.map((token) => {
      // 5 random attention scores (random indices and random score 0 to 1)
      const attentionScores: TokenAttentionScore[] = [];
      for (let i = 0; i < 5; i++) {
        attentionScores.push(
          new TokenAttentionScore(
            Math.floor(Math.random() * otherTokens.length),
            Math.random(),
          ),
        );
      }
      // 5 random synonyms
      const probsScores: TokenProbScore[] = [];
      for (let i = 0; i < 5; i++) {
        probsScores.push(
          new TokenProbScore(
            curTokens[Math.floor(Math.random() * curTokens.length)],
            Math.random(),
          ),
        );
      }
      return new Token(token, attentionScores, probsScores);
    });
  }

  private sampleTranslatedTokens = [
    "съешь ",
    "ещё ",
    "этих ",
    "мяг",
    "ких ",
    "франц",
    "узск",
    "их ",
    "бул",
    "ок, ",
    "да ",
    "вы",
    "пей ",
    "чаю",
  ];
}
