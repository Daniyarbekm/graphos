import { worldToScreen, type CoordinateSystem } from "./coordinates";
import { GRAPH_RENDER } from "./config";

export type AxisColors = {
  axis: string;
};

/** Axes are drawn as part of drawGrid major lines at y=0 and x=0 */
export function drawAxes(
  _ctx: CanvasRenderingContext2D,
  _system: CoordinateSystem,
  _colors: AxisColors,
): void {
  /* Integrated into drawGrid for correct z-order (grid under curves, axes in grid pass) */
  void GRAPH_RENDER.axisLineWidth;
}
