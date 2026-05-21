"use client";

import { useEffect, type RefObject } from "react";
import { GRAPH_INTERACTION, GRAPH_RENDER } from "@/lib/graph-config";
import { createCoordinateSystem, screenToWorld } from "@/render-engine/coordinates";
import { useGraphStore } from "@/store";

export function useViewportInteraction(
  containerRef: RefObject<HTMLElement | null>,
) {
  const zoomAt = useGraphStore((s) => s.zoomAt);
  const pan = useGraphStore((s) => s.pan);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let isPanning = false;
    let lastX = 0;
    let lastY = 0;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;

      const system = createCoordinateSystem(
        useGraphStore.getState().bounds,
        rect.width,
        rect.height,
      );
      const anchor = screenToWorld(sx, sy, system);
      const factor = Math.exp(-e.deltaY * GRAPH_INTERACTION.zoomSensitivity);

      zoomAt(factor, anchor);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      isPanning = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPanning) return;
      const rect = el.getBoundingClientRect();
      const plotWidth =
        rect.width - GRAPH_RENDER.padding.left - GRAPH_RENDER.padding.right;
      const plotHeight =
        rect.height - GRAPH_RENDER.padding.top - GRAPH_RENDER.padding.bottom;

      const b = useGraphStore.getState().bounds;
      const dxPx = e.clientX - lastX;
      const dyPx = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      const dxWorld = (-dxPx / plotWidth) * (b.xMax - b.xMin);
      const dyWorld = (dyPx / plotHeight) * (b.yMax - b.yMin);

      pan(dxWorld, dyWorld);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isPanning) return;
      isPanning = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
    };
  }, [containerRef, zoomAt, pan]);
}
