import type { GraphMode } from "@/shared/types";
import { stripEquationPrefix } from "./equation-prefix";
import {
  applyShorthands,
  insertFunctionParentheses,
  insertImplicitMultiplication,
} from "../normalizer";
import type { PreprocessResult } from "../core/types";

export {
  is3DExpression,
  isParametricExpression,
} from "./equation-prefix";

export function preprocess(raw: string, mode: GraphMode): PreprocessResult {
  const trimmed = raw.trim();
  const prefix = stripEquationPrefix(trimmed, mode);
  const body = prefix.body || trimmed;

  let expr = applyShorthands(body);
  expr = insertFunctionParentheses(expr);
  const normalized = insertImplicitMultiplication(expr);

  return {
    kind: prefix.kind,
    raw: trimmed,
    normalized,
    lhs: prefix.lhs,
    independentVar: prefix.independentVar,
    dependentVar: prefix.dependentVar,
  };
}
