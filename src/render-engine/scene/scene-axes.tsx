"use client";

import { Html, Line } from "@react-three/drei";
import { GRAPH_3D } from "@/lib/graph-config";
import type { Graph3DTheme } from "@/hooks/use-graph-3d-theme";

type SceneAxesProps = {
  theme: Graph3DTheme;
  length?: number;
};

function AxisLabel({
  children,
  position,
  color,
}: {
  children: string;
  position: [number, number, number];
  color: string;
}) {
  return (
    <Html position={position} center style={{ pointerEvents: "none" }}>
      <span
        className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold shadow-sm"
        style={{
          color,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(4px)",
        }}
      >
        {children}
      </span>
    </Html>
  );
}

export function SceneAxes({ theme, length = GRAPH_3D.axisLength }: SceneAxesProps) {
  const l = length;

  const axes = [
    {
      points: [
        [0, 0, 0],
        [l, 0, 0],
      ] as [number, number, number][],
      color: theme.axisX,
      label: "X",
      labelPos: [l + 0.6, 0, 0] as [number, number, number],
    },
    {
      points: [
        [0, 0, 0],
        [0, l, 0],
      ] as [number, number, number][],
      color: theme.axisY,
      label: "Z",
      labelPos: [0, l + 0.6, 0] as [number, number, number],
    },
    {
      points: [
        [0, 0, 0],
        [0, 0, l],
      ] as [number, number, number][],
      color: theme.axisZ,
      label: "Y",
      labelPos: [0, 0, l + 0.6] as [number, number, number],
    },
  ];

  return (
    <group>
      {axes.map((axis) => (
        <group key={axis.label}>
          <Line
            points={axis.points}
            color={axis.color}
            lineWidth={2.5}
            transparent
            opacity={0.95}
          />
          <AxisLabel position={axis.labelPos} color={axis.color}>
            {axis.label}
          </AxisLabel>
        </group>
      ))}
    </group>
  );
}
