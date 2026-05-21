import type { GraphMode } from "@/shared/types";
import { parse } from "mathjs";
import { formatMathError } from "./core/errors";
import type { ParseResult, PreprocessResult } from "./core/types";
import { preprocess } from "./preprocess";
import { transformLogsForMathJs } from "./normalizer";

export function parseEquation(raw: string, mode: GraphMode): ParseResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: "Empty expression", normalized: "" };
  }

  const equation = preprocess(trimmed, mode);
  const mathExpr = transformLogsForMathJs(equation.normalized);

  if (!mathExpr) {
    return { ok: false, error: "Expression is empty", normalized: "" };
  }

  try {
    const ast = parse(mathExpr);
    return { ok: true, equation, ast };
  } catch (err) {
    return {
      ok: false,
      error: formatMathError(err),
      normalized: equation.normalized,
    };
  }
}

export function classifyEquation(
  raw: string,
  mode: GraphMode,
): PreprocessResult {
  return preprocess(raw.trim(), mode);
}

export { is3DExpression, isParametricExpression } from "./preprocess";
