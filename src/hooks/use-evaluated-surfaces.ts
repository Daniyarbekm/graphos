"use client";

import { useMemo } from "react";
import { evaluateAllExpressions3D } from "@/math-engine";
import type { EvaluatedSurface3D } from "@/math-engine/types";
import { GRAPH_3D } from "@/lib/graph-config";
import type { Expression, ViewportBounds } from "@/shared/types";

export function useEvaluatedSurfaces(
  expressions: Expression[],
  bounds: ViewportBounds,
): EvaluatedSurface3D[] {
  const key = useMemo(
    () =>
      [
        bounds.xMin,
        bounds.xMax,
        bounds.yMin,
        bounds.yMax,
        GRAPH_3D.resolution,
        ...expressions.map(
          (e) => `${e.id}:${e.latex}:${e.visible}:${e.color}`,
        ),
      ].join("|"),
    [expressions, bounds],
  );

  return useMemo(
    () =>
      evaluateAllExpressions3D(
        expressions,
        bounds,
        GRAPH_3D.resolution,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- key captures deps
    [key],
  );
}
