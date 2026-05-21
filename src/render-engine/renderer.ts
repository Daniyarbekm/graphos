import type { EvaluatedExpression } from "@/math-engine/types";
import type { ViewportBounds } from "@/shared/types";
import { createCoordinateSystem } from "./coordinates";
import { drawCurves } from "./draw-curves";
import { drawGrid } from "./draw-grid";

export type GraphThemeColors = {
  background: string;
  gridMinor: string;
  grid: string;
  gridMajor: string;
  axis: string;
  label: string;
  origin: string;
};

export type RenderFrame = {
  width: number;
  height: number;
  bounds: ViewportBounds;
  evaluated: EvaluatedExpression[];
  showGrid: boolean;
  showAxes: boolean;
  colors: GraphThemeColors;
};

export function renderGraphFrame(
  ctx: CanvasRenderingContext2D,
  frame: RenderFrame,
): void {
  const { width, height, bounds, evaluated, showGrid, showAxes, colors } = frame;
  const dpr = Math.min(
    window.devicePixelRatio || 1,
    2,
  );

  const canvas = ctx.canvas;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, width, height);

  const system = createCoordinateSystem(bounds, width, height);

  if (showGrid || showAxes) {
    drawGrid(ctx, system, {
      gridMinor: colors.gridMinor,
      grid: colors.grid,
      gridMajor: colors.gridMajor,
      axis: showAxes ? colors.axis : colors.gridMajor,
      label: colors.label,
      origin: colors.origin,
    });
  }

  drawCurves(ctx, system, evaluated);
}
