import { Token } from "@/highlighting/dataclasses.ts";

/**
 * Represents a TranslationService.
 *
 * Provides methods for translating string to text.
 *
 * @interface
 */
export default interface TranslationService {
  /**
   * Perform a health check to determine if the system is functioning properly.
   *
   * @return {Promise<boolean>} A promise that resolves to a boolean indicating
   *     whether the health check passed or not.
   */
  healthCheck(): Promise<boolean>;

  /**
   * Predict method
   *
   * @param {string} text - The input text to be predicted.
   * @returns {Promise<[Token[], Token[]]>} - A Promise that resolves to an array containing two arrays of Tokens.
   */
  predict(text: string): Promise<[Token[], Token[]]>;
}
