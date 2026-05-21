export type { Token, TokenType } from "./tokenizer/tokens";
export { tokenize, tokenizeForValidation } from "./tokenizer/tokenize";

import { tokenizeForValidation } from "./tokenizer/tokenize";
import type { Token } from "./tokenizer/tokens";

export function findInvalidToken(input: string): Token | null {
  return tokenizeForValidation(input).find((t) => t.type === "unknown") ?? null;
}
