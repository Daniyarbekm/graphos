"use client";

import { useCallback, useEffect, useRef } from "react";
import { useEvaluatedExpressions } from "@/hooks/use-evaluated-expressions";
import { useGraphThemeColors } from "@/hooks/use-graph-theme-colors";
import { useViewportInteraction } from "@/hooks/use-viewport-interaction";
import { useGraphStore } from "@/store";
import { renderGraphFrame } from "./renderer";

export function GraphCanvas2D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const rafRef = useRef<number>(0);

  const bounds = useGraphStore((s) => s.bounds);
  const showGrid = useGraphStore((s) => s.showGrid);
  const showAxes = useGraphStore((s) => s.showAxes);
  const expressions = useGraphStore((s) => s.expressions);

  const evaluated = useEvaluatedExpressions(expressions, bounds);
  const colors = useGraphThemeColors();

  useViewportInteraction(containerRef);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const { width, height } = sizeRef.current;
    if (!canvas || width <= 0 || height <= 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    renderGraphFrame(ctx, {
      width,
      height,
      bounds,
      evaluated,
      showGrid,
      showAxes,
      colors,
    });
  }, [bounds, evaluated, showGrid, showAxes, colors]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      sizeRef.current = { width, height };
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(paint);
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [paint]);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paint]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full cursor-grab bg-graph-bg transition-theme active:cursor-grabbing"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full touch-none"
        aria-label="2D graph canvas"
      />
    </div>
  );
}
