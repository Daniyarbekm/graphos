import { BufferAttribute, BufferGeometry } from "three";
import type { SurfaceMeshData } from "@/math-engine/types";

export function buildSurfaceGeometry(data: SurfaceMeshData): BufferGeometry {
  const geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new BufferAttribute(data.positions, 3),
  );
  geometry.setIndex(new BufferAttribute(data.indices, 1));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}
