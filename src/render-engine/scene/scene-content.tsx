"use client";

import { Suspense, useDeferredValue } from "react";
import { useEvaluatedSurfaces } from "@/hooks/use-evaluated-surfaces";
import { useGraph3DTheme } from "@/hooks/use-graph-3d-theme";
import { useGraphStore } from "@/store";
import { CameraController } from "./camera-controller";
import { SceneAxes } from "./scene-axes";
import { SceneGrid } from "./scene-grid";
import { SceneLights } from "./scene-lights";
import { SurfaceMesh } from "./surface-mesh";

export function SceneContent() {
  const theme = useGraph3DTheme();
  const bounds = useGraphStore((s) => s.bounds);
  const expressions = useGraphStore((s) => s.expressions);
  const showGrid = useGraphStore((s) => s.showGrid);
  const showAxes = useGraphStore((s) => s.showAxes);
  const cameraResetToken = useGraphStore((s) => s.cameraResetToken);

  const deferredExpressions = useDeferredValue(expressions);
  const evaluated = useEvaluatedSurfaces(deferredExpressions, bounds);

  return (
    <>
      <color attach="background" args={[theme.background]} />
      <fog attach="fog" args={[theme.fog, 35, 90]} />

      <SceneLights theme={theme} />
      <CameraController resetToken={cameraResetToken} />

      <SceneGrid theme={theme} visible={showGrid} />
      {showAxes && <SceneAxes theme={theme} />}

      <Suspense fallback={null}>
        <group>
          {evaluated.map((ev) => (
            <SurfaceMesh key={ev.id} evaluated={ev} />
          ))}
        </group>
      </Suspense>
    </>
  );
}
