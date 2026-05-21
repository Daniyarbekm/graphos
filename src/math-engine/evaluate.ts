import type { Expression, ViewportBounds } from "@/shared/types";
import { GRAPH_SAMPLING } from "@/lib/graph-config";
import { compileEquation, validateEquation } from "./evaluator";
import { sampleParametric2D, toFunctionT } from "./graph/parametric-2d";
import { sampleCurve2D } from "./graph/curve-2d";
import type { CompileResult } from "./core/types";
import type { EvaluatedExpression } from "./types";

type CompiledEntry = {
  expression: Expression;
  compiled: CompileResult & { ok: true };
};

function errorResult(
  expression: Expression,
  error: string,
  normalized: string,
): EvaluatedExpression {
  return {
    id: expression.id,
    color: expression.color,
    visible: expression.visible,
    latex: expression.latex,
    normalized,
    error,
    curve: null,
  };
}

function successResult(
  expression: Expression,
  normalized: string,
  curve: EvaluatedExpression["curve"],
  kind?: string,
): EvaluatedExpression {
  return {
    id: expression.id,
    color: expression.color,
    visible: expression.visible,
    latex: expression.latex,
    normalized,
    error: null,
    curve,
    kind,
  };
}

function isCompiledEntry(
  entry: CompiledEntry | EvaluatedExpression,
): entry is CompiledEntry {
  return "compiled" in entry;
}

function compileEntry(
  expression: Expression,
): CompiledEntry | EvaluatedExpression {
  const validation = validateEquation(expression.latex, "2d");
  if (!validation.ok) {
    return errorResult(expression, validation.error, validation.normalized);
  }

  const compiled = compileEquation(expression.latex, "2d");
  if (!compiled.ok || !compiled.fn || !compiled.equation) {
    return errorResult(
      expression,
      compiled.error ?? "Invalid expression",
      compiled.normalized,
    );
  }

  return {
    expression,
    compiled: compiled as CompiledEntry["compiled"],
  };
}

export function evaluateExpression(
  expression: Expression,
  bounds: ViewportBounds,
  sampleCount?: number,
): EvaluatedExpression {
  const entry = compileEntry(expression);
  if (!isCompiledEntry(entry)) {
    return entry;
  }

  const { compiled } = entry;
  const { equation, fn } = compiled;

  if (equation.kind === "parametric-x") {
    return errorResult(
      expression,
      "Pair with a matching y = …(t) equation below",
      compiled.normalized,
    );
  }

  if (equation.kind === "parametric-y") {
    return errorResult(
      expression,
      "Add a matching x = …(t) equation above",
      compiled.normalized,
    );
  }

  const fn2d = (x: number) => fn({ x, e: Math.E, pi: Math.PI });
  const curve = sampleCurve2D(fn2d, {
    xMin: bounds.xMin,
    xMax: bounds.xMax,
    samples: sampleCount ?? GRAPH_SAMPLING.baseSamples,
  });

  return successResult(expression, compiled.normalized, curve, equation.kind);
}

export function evaluateAllExpressions(
  expressions: Expression[],
  bounds: ViewportBounds,
  sampleCount?: number,
): EvaluatedExpression[] {
  const results: EvaluatedExpression[] = [];
  const paramX: CompiledEntry[] = [];
  const paramY: CompiledEntry[] = [];
  const cartesian: CompiledEntry[] = [];

  for (const expr of expressions) {
    const entry = compileEntry(expr);
    if (!isCompiledEntry(entry)) {
      results.push(entry);
      continue;
    }

    const kind = entry.compiled.equation.kind;
    if (kind === "parametric-x") paramX.push(entry);
    else if (kind === "parametric-y") paramY.push(entry);
    else cartesian.push(entry);
  }

  const pairs = Math.min(paramX.length, paramY.length);
  const tMin = bounds.xMin;
  const tMax = bounds.xMax;
  const samples = sampleCount ?? GRAPH_SAMPLING.baseSamples;

  for (let i = 0; i < pairs; i++) {
    const xEntry = paramX[i]!;
    const yEntry = paramY[i]!;
    const fnX = toFunctionT(xEntry.compiled.fn);
    const fnY = toFunctionT(yEntry.compiled.fn);
    const curve = sampleParametric2D(fnX, fnY, tMin, tMax, samples);

    results.push(
      successResult(
        yEntry.expression,
        `${xEntry.compiled.normalized} ; ${yEntry.compiled.normalized}`,
        curve,
        "parametric",
      ),
    );
  }

  for (let i = pairs; i < paramX.length; i++) {
    results.push(
      errorResult(
        paramX[i]!.expression,
        "Add a matching y = …(t) equation",
        paramX[i]!.compiled.normalized,
      ),
    );
  }

  for (let i = pairs; i < paramY.length; i++) {
    results.push(
      errorResult(
        paramY[i]!.expression,
        "Add a matching x = …(t) equation",
        paramY[i]!.compiled.normalized,
      ),
    );
  }

  for (const entry of cartesian) {
    const fn2d = (x: number) =>
      entry.compiled.fn({ x, e: Math.E, pi: Math.PI });
    const curve = sampleCurve2D(fn2d, {
      xMin: bounds.xMin,
      xMax: bounds.xMax,
      samples,
    });
    results.push(
      successResult(
        entry.expression,
        entry.compiled.normalized,
        curve,
        entry.compiled.equation.kind,
      ),
    );
  }

  return results;
}
