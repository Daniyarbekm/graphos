"use client";

import { useMemo } from "react";
import { debugEvaluate } from "@/math-engine/evaluator";
import { useGraphStore } from "@/store";

export function useExpressionDebug(latex: string, enabled: boolean) {
  const mode = useGraphStore((s) => s.mode);

  return useMemo(() => {
    if (!enabled || !latex.trim()) return null;
    return debugEvaluate(latex, mode, 1, 1, Math.PI / 2);
  }, [latex, mode, enabled]);
}
