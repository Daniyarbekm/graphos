import type { GraphMode } from "@/shared/types";
import { compileEquation } from "./evaluator";
import type { CompiledFunction2D, CompileResult } from "./types";

export function compileFunction2D(raw: string): CompileResult {
  const result = compileEquation(raw, "2d");
  if (!result.ok || !result.fn) {
    return {
      ok: false,
      error: result.error,
      fn: null,
      normalized: result.normalized,
    };
  }

  const fn2d: CompiledFunction2D = (x) =>
    result.fn!({ x, e: Math.E, pi: Math.PI });

  return {
    ok: true,
    fn: fn2d,
    normalized: result.normalized,
    error: null,
  };
}

export function compileFunction(raw: string, mode: GraphMode) {
  return compileEquation(raw, mode);
}
