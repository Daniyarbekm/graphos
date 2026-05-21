import type { EvaluatedExpression } from "@/math-engine/types";
import type { ViewportBounds } from "@/shared/types";

export type { GraphThemeColors, RenderFrame } from "./renderer";

export type RenderContext = {
  bounds: ViewportBounds;
  width: number;
  height: number;
  devicePixelRatio: number;
};

export type RenderableCurve = {
  evaluated: EvaluatedExpression;
};

export type RenderEngineConfig = {
  antialias?: boolean;
  backgroundColor?: string;
};
