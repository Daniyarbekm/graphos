import type { Expression, ViewportBounds } from "@/shared/types";
import { compileEquation } from "./evaluator/compile";
import { validateEquation } from "./evaluator";
import { sampleSurface3D } from "./graph/surface-3d";
import type { EvaluatedSurface3D } from "./types";

export function evaluateExpression3D(
  expression: Expression,
  bounds: ViewportBounds,
  resolution?: number,
): EvaluatedSurface3D {
  const validation = validateEquation(expression.latex, "3d");

  if (!validation.ok) {
    return {
      id: expression.id,
      color: expression.color,
      visible: expression.visible,
      latex: expression.latex,
      normalized: validation.normalized,
      error: validation.error,
      surface: null,
    };
  }

  const compiled = compileEquation(expression.latex, "3d");

  if (!compiled.ok || !compiled.fn) {
    return {
      id: expression.id,
      color: expression.color,
      visible: expression.visible,
      latex: expression.latex,
      normalized: compiled.normalized,
      error: compiled.error ?? "Invalid expression",
      surface: null,
    };
  }

  const fn3d = (x: number, y: number) =>
    compiled.fn!({ x, y, e: Math.E, pi: Math.PI });

  const surface = sampleSurface3D(fn3d, bounds, { resolution });

  return {
    id: expression.id,
    color: expression.color,
    visible: expression.visible,
    latex: expression.latex,
    normalized: compiled.normalized,
    error: null,
    surface,
  };
}

export function evaluateAllExpressions3D(
  expressions: Expression[],
  bounds: ViewportBounds,
  resolution?: number,
): EvaluatedSurface3D[] {
  return expressions.map((e) => evaluateExpression3D(e, bounds, resolution));
}
