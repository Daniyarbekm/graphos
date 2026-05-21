export const APP_NAME = "Graphos";
export const APP_DESCRIPTION =
  "Modern mathematical graph visualization — inspired by Desmos";

export const DEFAULT_VIEWPORT = {
  width: 800,
  height: 600,
} as const;

export const ANIMATION = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  spring: { type: "spring" as const, stiffness: 400, damping: 30 },
} as const;
