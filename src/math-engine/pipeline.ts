import type { GraphMode } from "@/shared/types";
import {
  compileEquation,
  debugEvaluate,
  validateEquation,
} from "./evaluator";
import { preprocess } from "./preprocess";
import { parseEquation, classifyEquation } from "./parser";

export { preprocess } from "./preprocess";
export { parseEquation, classifyEquation } from "./parser";
export {
  compileEquation,
  validateEquation,
  debugEvaluate,
} from "./evaluator";
export { tokenize, tokenizeForValidation } from "./tokenizer";
export {
  normalizeMathExpression,
  applyShorthands,
  insertImplicitMultiplication,
  insertFunctionParentheses,
} from "./normalizer";
export { MATH_EVAL_SCOPE, MATH_FUNCTION_NAMES } from "./functions";

export function prepareEquation(raw: string, mode: GraphMode) {
  return preprocess(raw.trim(), mode);
}

export function validateExpression(raw: string, mode: GraphMode = "2d") {
  return validateEquation(raw, mode);
}
