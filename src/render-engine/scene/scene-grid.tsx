"use client";

import { Grid } from "@react-three/drei";
import { GRAPH_3D } from "@/lib/graph-config";
import type { Graph3DTheme } from "@/hooks/use-graph-3d-theme";

type SceneGridProps = {
  theme: Graph3DTheme;
  visible: boolean;
};

export function SceneGrid({ theme, visible }: SceneGridProps) {
  if (!visible) return null;

  const size = GRAPH_3D.gridSize;
  const divisions = GRAPH_3D.gridDivisions;
  const cell = size / divisions;
  const section = cell * 5;

  return (
    <group>
      <Grid
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        cellSize={cell}
        cellThickness={0.35}
        cellColor={theme.grid}
        sectionSize={section}
        sectionThickness={0.9}
        sectionColor={theme.gridSection}
        fadeDistance={45}
        fadeStrength={1.5}
        infiniteGrid
      />
      <Grid
        position={[0, -0.001, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        cellSize={cell}
        cellThickness={0.25}
        cellColor={theme.grid}
        sectionSize={section}
        sectionThickness={0.6}
        sectionColor={theme.gridSection}
        fadeDistance={35}
        fadeStrength={1.2}
        infiniteGrid
      />
    </group>
  );
}
