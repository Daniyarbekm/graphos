/** Shared graph rendering & interaction constants */
export const GRAPH_RENDER = {
  padding: { top: 24, right: 24, bottom: 40, left: 48 },
  minTickPixels: 48,
  maxTickPixels: 120,
  minorDivisions: 5,
  curveLineWidth: 2.5,
  gridMinorLineWidth: 0.35,
  gridMajorLineWidth: 0.85,
  gridLineWidth: 0.5,
  axisLineWidth: 2,
  originRadius: 4,
  tickLineWidth: 1,
  labelFont: "11px var(--font-geist-sans), system-ui, sans-serif",
  axisFont: "12px var(--font-geist-sans), system-ui, sans-serif",
  devicePixelRatioMax: 2,
} as const;

export const GRAPH_INTERACTION = {
  zoomSensitivity: 0.0012,
  zoomButtonFactor: 0.75,
  panEnabled: true,
  minSpan: 0.5,
  maxSpan: 1e6,
} as const;

export const GRAPH_SAMPLING = {
  baseSamples: 400,
  maxSamples: 2000,
  maxSegments: 32,
  discontinuityThreshold: 8,
  refinementDepth: 4,
} as const;

export const GRAPH_3D = {
  resolution: 64,
  maxResolution: 96,
  zClamp: 50,
  domainSpan: 8,
  gridDivisions: 20,
  gridSize: 20,
  axisLength: 11,
  camera: {
    position: [14, 12, 14] as [number, number, number],
    fov: 45,
    near: 0.1,
    far: 500,
  },
  orbit: {
    minDistance: 4,
    maxDistance: 60,
    dampingFactor: 0.06,
    rotateSpeed: 0.5,
    zoomSpeed: 0.9,
  },
} as const;
