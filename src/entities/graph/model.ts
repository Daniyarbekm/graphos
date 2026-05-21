import type { GraphMode, ViewportBounds } from "@/shared/types";

export const DEFAULT_BOUNDS_2D: ViewportBounds = {
  xMin: -10,
  xMax: 10,
  yMin: -10,
  yMax: 10,
};

export type GraphState = {
  mode: GraphMode;
  bounds: ViewportBounds;
  showGrid: boolean;
  showAxes: boolean;
};

export const DEFAULT_GRAPH_STATE: GraphState = {
  mode: "2d",
  bounds: DEFAULT_BOUNDS_2D,
  showGrid: true,
  showAxes: true,
};
