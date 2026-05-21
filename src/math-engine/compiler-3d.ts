import { compileEquation } from "./evaluator";
import type { CompiledFunction3D, CompileResult3D } from "./types";

export function compileFunction3D(raw: string): CompileResult3D {
  const result = compileEquation(raw, "3d");
  if (!result.ok || !result.fn) {
    return {
      ok: false,
      error: result.error,
      fn: null,
      normalized: result.normalized,
    };
  }

  const fn3d: CompiledFunction3D = (x, y) =>
    result.fn!({ x, y, e: Math.E, pi: Math.PI });

  return {
    ok: true,
    fn: fn3d,
    normalized: result.normalized,
    error: null,
  };
}
