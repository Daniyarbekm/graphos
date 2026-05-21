import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createExpression } from "@/entities/expression";
import { DEFAULT_BOUNDS_2D, DEFAULT_GRAPH_STATE } from "@/entities/graph";
import {
  is3DExpression,
  isParametricExpression,
} from "@/math-engine/normalize-3d";
import { GRAPH_INTERACTION } from "@/lib/graph-config";
import type { Expression, ExpressionId, GraphMode, ViewportBounds } from "@/shared/types";

const DEFAULT_3D_EXPRESSIONS = [
  createExpression({ latex: "z = x^2 + y^2", label: "Paraboloid" }),
  createExpression({ latex: "z = sin(x*y)", label: "Ripple" }),
  createExpression({ latex: "z = sin(x) + cos(y)", label: "Wave" }),
];

type GraphStoreState = {
  mode: GraphMode;
  bounds: ViewportBounds;
  showGrid: boolean;
  showAxes: boolean;
  cameraResetToken: number;
  expressions: Expression[];
  activeExpressionId: ExpressionId | null;
  setMode: (mode: GraphMode) => void;
  setBounds: (bounds: ViewportBounds) => void;
  setShowGrid: (show: boolean) => void;
  setShowAxes: (show: boolean) => void;
  zoom: (factor: number) => void;
  zoomAt: (factor: number, anchor: { x: number; y: number }) => void;
  pan: (dx: number, dy: number) => void;
  resetViewport: () => void;
  addExpression: (partial?: Partial<Expression>) => void;
  updateExpression: (id: ExpressionId, patch: Partial<Expression>) => void;
  removeExpression: (id: ExpressionId) => void;
  setActiveExpression: (id: ExpressionId | null) => void;
};

const initialExpressions2D = [
  createExpression({ latex: "y = sin(x)", label: "Sine" }),
  createExpression({ latex: "y = cos(x)", label: "Cosine" }),
  createExpression({ latex: "y = x^2", label: "Parabola" }),
];

function clampBounds(bounds: ViewportBounds): ViewportBounds {
  const xSpan = bounds.xMax - bounds.xMin;
  const ySpan = bounds.yMax - bounds.yMin;
  const maxSpan = GRAPH_INTERACTION.maxSpan;
  const minSpan = GRAPH_INTERACTION.minSpan;

  if (xSpan > maxSpan || ySpan > maxSpan) {
    const cx = (bounds.xMin + bounds.xMax) / 2;
    const cy = (bounds.yMin + bounds.yMax) / 2;
    const half = maxSpan / 2;
    return {
      xMin: cx - half,
      xMax: cx + half,
      yMin: cy - half,
      yMax: cy + half,
    };
  }

  if (xSpan < minSpan || ySpan < minSpan) {
    const cx = (bounds.xMin + bounds.xMax) / 2;
    const cy = (bounds.yMin + bounds.yMax) / 2;
    const half = minSpan / 2;
    return {
      xMin: cx - half,
      xMax: cx + half,
      yMin: cy - half,
      yMax: cy + half,
    };
  }

  return bounds;
}

function scaleBounds(bounds: ViewportBounds, factor: number): ViewportBounds {
  const cx = (bounds.xMin + bounds.xMax) / 2;
  const cy = (bounds.yMin + bounds.yMax) / 2;
  const halfW = ((bounds.xMax - bounds.xMin) / 2) * factor;
  const halfH = ((bounds.yMax - bounds.yMin) / 2) * factor;

  return clampBounds({
    xMin: cx - halfW,
    xMax: cx + halfW,
    yMin: cy - halfH,
    yMax: cy + halfH,
  });
}

function has3DExpressions(expressions: Expression[]): boolean {
  return expressions.some((e) => is3DExpression(e.latex));
}

export const useGraphStore = create<GraphStoreState>()(
  persist(
    (set) => ({
      ...DEFAULT_GRAPH_STATE,
      cameraResetToken: 0,
      expressions: initialExpressions2D,
      activeExpressionId: initialExpressions2D[0]?.id ?? null,

      setMode: (mode) =>
        set((s) => {
          const switchingTo3d = mode === "3d" && s.mode !== "3d";
          const switchingTo2d = mode === "2d" && s.mode !== "2d";

          let expressions = s.expressions;
          if (switchingTo3d && !has3DExpressions(s.expressions)) {
            expressions = DEFAULT_3D_EXPRESSIONS;
          }
          if (
            switchingTo2d &&
            !s.expressions.some(
              (e) =>
                /^y\s*=/i.test(e.latex) ||
                isParametricExpression(e.latex),
            )
          ) {
            expressions = initialExpressions2D;
          }

          return {
            mode,
            expressions,
            activeExpressionId: expressions[0]?.id ?? null,
            cameraResetToken: s.cameraResetToken + 1,
          };
        }),

      setBounds: (bounds) => set({ bounds: clampBounds(bounds) }),
      setShowGrid: (showGrid) => set({ showGrid }),
      setShowAxes: (showAxes) => set({ showAxes }),

      zoom: (factor) =>
        set((s) => ({ bounds: scaleBounds(s.bounds, factor) })),

      zoomAt: (factor, anchor) =>
        set((s) => {
          const b = s.bounds;
          return {
            bounds: clampBounds({
              xMin: anchor.x - (anchor.x - b.xMin) * factor,
              xMax: anchor.x + (b.xMax - anchor.x) * factor,
              yMin: anchor.y - (anchor.y - b.yMin) * factor,
              yMax: anchor.y + (b.yMax - anchor.y) * factor,
            }),
          };
        }),

      pan: (dx, dy) =>
        set((s) => ({
          bounds: clampBounds({
            xMin: s.bounds.xMin + dx,
            xMax: s.bounds.xMax + dx,
            yMin: s.bounds.yMin + dy,
            yMax: s.bounds.yMax + dy,
          }),
        })),

      resetViewport: () =>
        set((s) => ({
          bounds: { ...DEFAULT_BOUNDS_2D },
          cameraResetToken: s.cameraResetToken + 1,
        })),

      addExpression: (partial) =>
        set((s) => {
          const expr = createExpression({
            latex: s.mode === "3d" ? "z = x^2 + y^2" : "y = x^2",
            ...partial,
          });
          return {
            expressions: [...s.expressions, expr],
            activeExpressionId: expr.id,
          };
        }),

      updateExpression: (id, patch) =>
        set((s) => ({
          expressions: s.expressions.map((e) =>
            e.id === id ? { ...e, ...patch } : e,
          ),
        })),

      removeExpression: (id) =>
        set((s) => {
          const expressions = s.expressions.filter((e) => e.id !== id);
          const activeExpressionId =
            s.activeExpressionId === id
              ? (expressions[0]?.id ?? null)
              : s.activeExpressionId;
          return { expressions, activeExpressionId };
        }),

      setActiveExpression: (activeExpressionId) => set({ activeExpressionId }),
    }),
    {
      name: "graphos-graph",
      partialize: (state) => ({
        mode: state.mode,
        bounds: state.bounds,
        showGrid: state.showGrid,
        showAxes: state.showAxes,
        expressions: state.expressions,
        activeExpressionId: state.activeExpressionId,
      }),
    },
  ),
);