export type ThemeMode = "light" | "dark" | "system";

export type GraphMode = "2d" | "3d";

export type ViewportBounds = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

export type Point2D = { x: number; y: number };
export type Point3D = { x: number; y: number; z: number };

export type ExpressionId = string;

export type Expression = {
  id: ExpressionId;
  latex: string;
  color: string;
  visible: boolean;
  label?: string;
};
