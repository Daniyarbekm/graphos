"use client";

import { memo, useEffect, useMemo } from "react";
import { DoubleSide } from "three";
import type { EvaluatedSurface3D } from "@/math-engine/types";
import { buildSurfaceGeometry } from "@/render-engine/geometry";

type SurfaceMeshProps = {
  evaluated: EvaluatedSurface3D;
};

function SurfaceMeshInner({ evaluated }: SurfaceMeshProps) {
  const surface = evaluated.surface;

  const geometry = useMemo(() => {
    if (!surface) return null;
    return buildSurfaceGeometry(surface);
  }, [surface]);

  useEffect(() => {
    return () => {
      geometry?.dispose();
    };
  }, [geometry]);

  if (!evaluated.visible || evaluated.error || !geometry) return null;

  return (
    <mesh geometry={geometry} frustumCulled>
      <meshStandardMaterial
        color={evaluated.color}
        side={DoubleSide}
        metalness={0.15}
        roughness={0.45}
        envMapIntensity={0.4}
      />
    </mesh>
  );
}

export const SurfaceMesh = memo(
  SurfaceMeshInner,
  (prev, next) =>
    prev.evaluated.id === next.evaluated.id &&
    prev.evaluated.color === next.evaluated.color &&
    prev.evaluated.visible === next.evaluated.visible &&
    prev.evaluated.error === next.evaluated.error &&
    prev.evaluated.latex === next.evaluated.latex &&
    prev.evaluated.surface === next.evaluated.surface,
);

SurfaceMesh.displayName = "SurfaceMesh";
