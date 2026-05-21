import { GRAPH_RENDER } from "@/lib/graph-config";
import type { ViewportBounds } from "@/shared/types";

export type PlotArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CoordinateSystem = {
  bounds: ViewportBounds;
  plot: PlotArea;
  width: number;
  height: number;
};

export function getPlotArea(
  width: number,
  height: number,
  padding = GRAPH_RENDER.padding,
): PlotArea {
  return {
    x: padding.left,
    y: padding.top,
    width: width - padding.left - padding.right,
    height: height - padding.top - padding.bottom,
  };
}

export function createCoordinateSystem(
  bounds: ViewportBounds,
  width: number,
  height: number,
): CoordinateSystem {
  return {
    bounds,
    plot: getPlotArea(width, height),
    width,
    height,
  };
}

export function worldToScreen(
  x: number,
  y: number,
  system: CoordinateSystem,
): { sx: number; sy: number } {
  const { bounds, plot } = system;
  const sx =
    plot.x + ((x - bounds.xMin) / (bounds.xMax - bounds.xMin)) * plot.width;
  const sy =
    plot.y +
    plot.height -
    ((y - bounds.yMin) / (bounds.yMax - bounds.yMin)) * plot.height;
  return { sx, sy };
}

export function screenToWorld(
  sx: number,
  sy: number,
  system: CoordinateSystem,
): { x: number; y: number } {
  const { bounds, plot } = system;
  const x =
    bounds.xMin + ((sx - plot.x) / plot.width) * (bounds.xMax - bounds.xMin);
  const y =
    bounds.yMin +
    ((plot.y + plot.height - sy) / plot.height) * (bounds.yMax - bounds.yMin);
  return { x, y };
}

/** Nice tick step for axis labels (1–2–5 × 10^n). */
export function computeTickStep(span: number, pixelSpan: number): number {
  const { minTickPixels, maxTickPixels } = GRAPH_RENDER;
  const rough = span / Math.max(pixelSpan / minTickPixels, 2);
  const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
  const residual = rough / magnitude;

  let nice: number;
  if (residual <= 1.5) nice = 1;
  else if (residual <= 3.5) nice = 2;
  else if (residual <= 7.5) nice = 5;
  else nice = 10;

  const step = nice * magnitude;
  const pixelsPerTick = (step / span) * pixelSpan;
  if (pixelsPerTick < minTickPixels) return step * 2;
  if (pixelsPerTick > maxTickPixels) return step / 2;
  return step;
}

export function generateTicks(
  min: number,
  max: number,
  step: number,
): number[] {
  if (step <= 0 || !Number.isFinite(min) || !Number.isFinite(max)) return [];

  const start = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  const limit = Math.min(max + step * 0.001, min + step * 500);

  for (let v = start; v <= limit; v += step) {
    if (v >= min - step * 0.001 && v <= max + step * 0.001) {
      ticks.push(Number(v.toPrecision(12)));
    }
  }

  return ticks;
}

export function computeMinorTickStep(majorStep: number): number {
  const { minorDivisions } = GRAPH_RENDER;
  return majorStep / minorDivisions;
}

export function formatTick(value: number): string {
  if (Math.abs(value) < 1e-10) return "0";
  if (Math.abs(value) >= 10000 || (Math.abs(value) < 0.001 && value !== 0)) {
    return value.toExponential(1);
  }
  const rounded = Math.round(value * 1e9) / 1e9;
  return String(rounded);
}
