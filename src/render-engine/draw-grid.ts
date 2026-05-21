import {
  computeMinorTickStep,
  computeTickStep,
  formatTick,
  generateTicks,
  worldToScreen,
  type CoordinateSystem,
} from "./coordinates";
import { GRAPH_RENDER } from "./config";

export type GridColors = {
  gridMinor: string;
  grid: string;
  gridMajor: string;
  axis: string;
  label: string;
  origin: string;
};

function drawVerticalLine(
  ctx: CanvasRenderingContext2D,
  sx: number,
  plot: { x: number; y: number; width: number; height: number },
  color: string,
  width: number,
) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.moveTo(sx, plot.y);
  ctx.lineTo(sx, plot.y + plot.height);
  ctx.stroke();
}

function drawHorizontalLine(
  ctx: CanvasRenderingContext2D,
  sy: number,
  plot: { x: number; y: number; width: number; height: number },
  color: string,
  width: number,
) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.moveTo(plot.x, sy);
  ctx.lineTo(plot.x + plot.width, sy);
  ctx.stroke();
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  system: CoordinateSystem,
  colors: GridColors,
): void {
  const { bounds, plot } = system;
  const xSpan = bounds.xMax - bounds.xMin;
  const ySpan = bounds.yMax - bounds.yMin;

  const xMajor = computeTickStep(xSpan, plot.width);
  const yMajor = computeTickStep(ySpan, plot.height);
  const xMinor = computeMinorTickStep(xMajor);
  const yMinor = computeMinorTickStep(yMajor);

  const xMinors = generateTicks(bounds.xMin, bounds.xMax, xMinor);
  const yMinors = generateTicks(bounds.yMin, bounds.yMax, yMinor);
  const xMajors = generateTicks(bounds.xMin, bounds.xMax, xMajor);
  const yMajors = generateTicks(bounds.yMin, bounds.yMax, yMajor);

  const majorXSet = new Set(xMajors.map((v) => v.toFixed(8)));
  const majorYSet = new Set(yMajors.map((v) => v.toFixed(8)));

  ctx.save();
  ctx.beginPath();
  ctx.rect(plot.x, plot.y, plot.width, plot.height);
  ctx.clip();

  for (const x of xMinors) {
    if (majorXSet.has(x.toFixed(8))) continue;
    const { sx } = worldToScreen(x, 0, system);
    if (sx < plot.x || sx > plot.x + plot.width) continue;
    drawVerticalLine(ctx, sx, plot, colors.gridMinor, GRAPH_RENDER.gridMinorLineWidth);
  }

  for (const y of yMinors) {
    if (majorYSet.has(y.toFixed(8))) continue;
    const { sy } = worldToScreen(0, y, system);
    if (sy < plot.y || sy > plot.y + plot.height) continue;
    drawHorizontalLine(ctx, sy, plot, colors.gridMinor, GRAPH_RENDER.gridMinorLineWidth);
  }

  for (const x of xMajors) {
    const { sx } = worldToScreen(x, 0, system);
    if (sx < plot.x || sx > plot.x + plot.width) continue;
    const isAxis = Math.abs(x) < xMajor * 0.001;
    drawVerticalLine(
      ctx,
      sx,
      plot,
      isAxis ? colors.axis : colors.grid,
      isAxis ? GRAPH_RENDER.axisLineWidth : GRAPH_RENDER.gridMajorLineWidth,
    );
  }

  for (const y of yMajors) {
    const { sy } = worldToScreen(0, y, system);
    if (sy < plot.y || sy > plot.y + plot.height) continue;
    const isAxis = Math.abs(y) < yMajor * 0.001;
    drawHorizontalLine(
      ctx,
      sy,
      plot,
      isAxis ? colors.axis : colors.grid,
      isAxis ? GRAPH_RENDER.axisLineWidth : GRAPH_RENDER.gridMajorLineWidth,
    );
  }

  const origin = worldToScreen(0, 0, system);
  if (
    origin.sx >= plot.x &&
    origin.sx <= plot.x + plot.width &&
    origin.sy >= plot.y &&
    origin.sy <= plot.y + plot.height &&
    bounds.xMin <= 0 &&
    bounds.xMax >= 0 &&
    bounds.yMin <= 0 &&
    bounds.yMax >= 0
  ) {
    ctx.beginPath();
    ctx.fillStyle = colors.origin;
    ctx.arc(origin.sx, origin.sy, GRAPH_RENDER.originRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colors.axis;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.font = GRAPH_RENDER.labelFont;
  ctx.fillStyle = colors.label;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  for (const x of xMajors) {
    const { sx } = worldToScreen(x, 0, system);
    if (sx < plot.x || sx > plot.x + plot.width) continue;
    if (Math.abs(x) < xMajor * 0.001 && bounds.yMin <= 0) continue;
    ctx.fillText(formatTick(x), sx, plot.y + plot.height + 6);
  }

  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  for (const y of yMajors) {
    const { sy } = worldToScreen(0, y, system);
    if (sy < plot.y || sy > plot.y + plot.height) continue;
    if (Math.abs(y) < yMajor * 0.001 && bounds.xMin <= 0) continue;
    ctx.fillText(formatTick(y), plot.x - 8, sy);
  }

  ctx.restore();
}
