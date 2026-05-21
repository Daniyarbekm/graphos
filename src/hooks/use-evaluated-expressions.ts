"use client";

import { useMemo } from "react";
import { evaluateAllExpressions } from "@/math-engine";
import type { EvaluatedExpression } from "@/math-engine/types";
import { GRAPH_SAMPLING } from "@/lib/graph-config";
import type { Expression, ViewportBounds } from "@/shared/types";

export function useEvaluatedExpressions(
  expressions: Expression[],
  bounds: ViewportBounds,
): EvaluatedExpression[] {
  const key = useMemo(
    () =>
      [
        bounds.xMin,
        bounds.xMax,
        bounds.yMin,
        bounds.yMax,
        ...expressions.map(
          (e) => `${e.id}:${e.latex}:${e.visible}:${e.color}`,
        ),
      ].join("|"),
    [expressions, bounds],
  );

  return useMemo(
    () =>
      evaluateAllExpressions(
        expressions,
        bounds,
        GRAPH_SAMPLING.baseSamples,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- key captures deps
    [key],
  );
}
