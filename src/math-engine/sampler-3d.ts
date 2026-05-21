import { GRAPH_3D } from "@/lib/graph-config";
import type { ViewportBounds } from "@/shared/types";
import type { CompiledFunction3D, SampleSurfaceOptions, SurfaceMeshData } from "./types";

function isValidZ(z: number): boolean {
  return Number.isFinite(z) && Math.abs(z) <= GRAPH_3D.zClamp;
}

export function sampleSurface3D(
  fn: CompiledFunction3D,
  bounds: ViewportBounds,
  options?: Partial<SampleSurfaceOptions>,
): SurfaceMeshData {
  const resolution = Math.min(
    options?.resolution ?? GRAPH_3D.resolution,
    GRAPH_3D.maxResolution,
  );
  const { xMin, xMax, yMin, yMax } = bounds;
  const nx = resolution;
  const ny = resolution;
  const xStep = (xMax - xMin) / nx;
  const yStep = (yMax - yMin) / ny;
  const cols = nx + 1;
  const rows = ny + 1;
  const vertexCount = cols * rows;

  const positions = new Float32Array(vertexCount * 3);
  const valid = new Uint8Array(vertexCount);
  let zMin = Infinity;
  let zMax = -Infinity;

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const idx = j * cols + i;
      const x = xMin + i * xStep;
      const y = yMin + j * yStep;
      const z = fn(x, y);
      const p = idx * 3;

      if (isValidZ(z)) {
        positions[p] = x;
        positions[p + 1] = z;
        positions[p + 2] = y;
        valid[idx] = 1;
        zMin = Math.min(zMin, z);
        zMax = Math.max(zMax, z);
      } else {
        positions[p] = x;
        positions[p + 1] = 0;
        positions[p + 2] = y;
        valid[idx] = 0;
      }
    }
  }

  if (!Number.isFinite(zMin)) {
    zMin = -1;
    zMax = 1;
  }

  const indices: number[] = [];
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const a = j * cols + i;
      const b = a + 1;
      const c = a + cols;
      const d = c + 1;

      if (valid[a] && valid[b] && valid[c]) {
        indices.push(a, c, b);
      }
      if (valid[b] && valid[d] && valid[c]) {
        indices.push(b, c, d);
      }
    }
  }

  return {
    positions,
    indices: new Uint32Array(indices),
    valid,
    resolution: [cols, rows],
    bounds: { xMin, xMax, yMin, yMax, zMin, zMax },
  };
}
