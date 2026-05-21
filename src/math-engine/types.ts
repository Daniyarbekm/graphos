import type { Point2D, Point3D } from "@/shared/types";

export type {
  EquationKind,
  PreprocessResult,
  ValidationResult,
  ParseResult,
  CompiledFunction,
} from "./core/types";

export type CompiledFunction2D = (x: number) => number;
export type CompiledFunction3D = (x: number, y: number) => number;

export type CompileResult =
  | {
      ok: true;
      fn: CompiledFunction2D;
      normalized: string;
      error: null;
    }
  | {
      ok: false;
      fn: null;
      normalized: string;
      error: string;
    };

export type CompileResult3D =
  | {
      ok: true;
      fn: CompiledFunction3D;
      normalized: string;
      error: null;
    }
  | {
      ok: false;
      fn: null;
      normalized: string;
      error: string;
    };

export type SampleOptions = {
  xMin: number;
  xMax: number;
  samples?: number;
};

export type SampleSurfaceOptions = {
  resolution?: number;
};

export type CurveSegment = {
  points: Point2D[];
};

export type Curve2D = {
  segments: CurveSegment[];
  domain: [number, number];
};

export type SurfaceBounds = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  zMin: number;
  zMax: number;
};

export type SurfaceMeshData = {
  positions: Float32Array;
  indices: Uint32Array;
  valid: Uint8Array;
  resolution: [number, number];
  bounds: SurfaceBounds;
};

export type EvaluatedExpression = {
  id: string;
  color: string;
  visible: boolean;
  latex: string;
  normalized: string;
  error: string | null;
  curve: Curve2D | null;
  kind?: string;
};

export type EvaluatedSurface3D = {
  id: string;
  color: string;
  visible: boolean;
  latex: string;
  normalized: string;
  error: string | null;
  surface: SurfaceMeshData | null;
};

export type Surface3D = {
  points: Point3D[];
  resolution: [number, number];
};
