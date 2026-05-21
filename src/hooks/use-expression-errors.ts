"use client";

import { useMemo } from "react";
import { validateEquation } from "@/math-engine/evaluator";
import { useGraphStore } from "@/store";

export function useExpressionError(latex: string): string | null {
  const mode = useGraphStore((s) => s.mode);

  return useMemo(() => {
    const result = validateEquation(latex, mode);
    return result.ok ? null : result.error;
  }, [latex, mode]);
}
