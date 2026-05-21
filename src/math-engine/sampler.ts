import { GRAPH_SAMPLING } from "@/lib/graph-config";
import type { CompiledFunction2D, Curve2D, CurveSegment, SampleOptions } from "./types";

const { discontinuityThreshold, maxSegments, refinementDepth } = GRAPH_SAMPLING;

export function sampleCurve2D(
  fn: CompiledFunction2D,
  options: SampleOptions,
): Curve2D {
  const { xMin, xMax, samples = GRAPH_SAMPLING.baseSamples } = options;
  const rawPoints = uniformSample(fn, xMin, xMax, samples);
  const segments = splitDiscontinuities(rawPoints);
  const refined = segments.map((seg) =>
    refineSegment(fn, seg.points, xMin, xMax, refinementDepth),
  );

  return {
    segments: refined.filter((s) => s.points.length >= 2),
    domain: [xMin, xMax],
  };
}

function uniformSample(
  fn: CompiledFunction2D,
  xMin: number,
  xMax: number,
  count: number,
): { x: number; y: number }[] {
  const step = (xMax - xMin) / Math.max(count - 1, 1);
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i < count; i++) {
    const x = xMin + i * step;
    const y = fn(x);
    if (Number.isFinite(y)) {
      points.push({ x, y });
    }
  }

  return points;
}

function splitDiscontinuities(
  points: { x: number; y: number }[],
): CurveSegment[] {
  if (points.length === 0) return [];

  const segments: CurveSegment[] = [];
  let current: { x: number; y: number }[] = [points[0]!];

  const yRange =
    Math.max(...points.map((p) => p.y)) - Math.min(...points.map((p) => p.y));
  const threshold = Math.max(
    discontinuityThreshold,
    yRange * 0.5,
    Math.abs(points[0]!.y) * 2,
  );

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]!;
    const curr = points[i]!;
    const dy = Math.abs(curr.y - prev.y);
    const dx = Math.abs(curr.x - prev.x) || 1e-9;
    const slopeJump = dy / dx;

    if (slopeJump > threshold && current.length >= 2) {
      segments.push({ points: current });
      current = [curr];
    } else {
      current.push(curr);
    }
  }

  if (current.length >= 2) {
    segments.push({ points: current });
  }

  return segments.slice(0, maxSegments);
}

function refineSegment(
  fn: CompiledFunction2D,
  points: { x: number; y: number }[],
  xMin: number,
  xMax: number,
  depth: number,
): CurveSegment {
  if (depth <= 0 || points.length < 2) {
    return { points };
  }

  const refined: { x: number; y: number }[] = [points[0]!];

  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!;
    const b = points[i + 1]!;
    const midX = (a.x + b.x) / 2;
    const midY = fn(midX);

    const linearMidY = (a.y + b.y) / 2;
    const error = Number.isFinite(midY)
      ? Math.abs(midY - linearMidY)
      : Infinity;

    if (Number.isFinite(midY) && error > 0.05 * Math.max(1, Math.abs(midY))) {
      const left = refineSegment(
        fn,
        [a, { x: midX, y: midY }],
        xMin,
        xMax,
        depth - 1,
      );
      refined.push(...left.points.slice(1));
    }

    refined.push(b);
  }

  return { points: refined };
}
