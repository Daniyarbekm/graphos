"use client";

import type { Graph3DTheme } from "@/hooks/use-graph-3d-theme";

type SceneLightsProps = {
  theme: Graph3DTheme;
};

export function SceneLights({ theme }: SceneLightsProps) {
  return (
    <>
      <ambientLight intensity={theme.ambient} />
      <directionalLight
        position={[12, 18, 10]}
        intensity={theme.directional}
        castShadow={false}
      />
      <directionalLight
        position={[-8, 6, -6]}
        intensity={theme.directional * 0.35}
      />
      <hemisphereLight
        args={[theme.fog, theme.background, 0.35]}
      />
    </>
  );
}
