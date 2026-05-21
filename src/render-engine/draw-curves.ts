import type { EvaluatedExpression } from "@/math-engine/types";
import { worldToScreen, type CoordinateSystem } from "./coordinates";
import { GRAPH_RENDER } from "./config";

export function drawCurves(
  ctx: CanvasRenderingContext2D,
  system: CoordinateSystem,
  evaluated: EvaluatedExpression[],
): void {
  const { plot } = system;

  ctx.save();
  ctx.beginPath();
  ctx.rect(plot.x, plot.y, plot.width, plot.height);
  ctx.clip();
  ctx.lineWidth = GRAPH_RENDER.curveLineWidth;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  for (const expr of evaluated) {
    if (!expr.visible || expr.error || !expr.curve) continue;

    ctx.strokeStyle = expr.color;

    for (const segment of expr.curve.segments) {
      const points = segment.points;
      if (points.length < 2) continue;

      ctx.beginPath();
      const first = points[0]!;
      const start = worldToScreen(first.x, first.y, system);
      ctx.moveTo(start.sx, start.sy);

      for (let i = 1; i < points.length; i++) {
        const p = points[i]!;
        const { sx, sy } = worldToScreen(p.x, p.y, system);
        ctx.lineTo(sx, sy);
      }

      ctx.stroke();
    }
  }

  ctx.restore();
}
