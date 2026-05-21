import type { GraphMode } from "@/shared/types";
import { preprocess } from "./preprocess";

/** @deprecated Use preprocess() */
export function normalizeExpression(raw: string): string {
  return preprocess(raw, "2d").normalized;
}

export function normalizeExpressionForMode(
  raw: string,
  mode: GraphMode,
): string {
  return preprocess(raw, mode).normalized;
}
