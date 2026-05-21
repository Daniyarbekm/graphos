import { GRAPH_SAMPLING } from "@/lib/graph-config";
import type { CompiledFunction } from "../core/types";
import type { Curve2D } from "../types";

export type CompiledFunctionT = (t: number) => number;

export function toFunctionT(fn: CompiledFunction): CompiledFunctionT {
  return (t: number) => fn({ t, e: Math.E, pi: Math.PI });
}

export function sampleParametric2D(
  fnX: CompiledFunctionT,
  fnY: CompiledFunctionT,
  tMin: number,
  tMax: number,
  samples: number = GRAPH_SAMPLING.baseSamples,
): Curve2D {
  const step = (tMax - tMin) / Math.max(samples - 1, 1);
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i < samples; i++) {
    const t = tMin + i * step;
    const x = fnX(t);
    const y = fnY(t);
    if (Number.isFinite(x) && Number.isFinite(y)) {
      points.push({ x, y });
    }
  }

  return {
    segments: points.length >= 2 ? [{ points }] : [],
    domain: [tMin, tMax],
  };
}
