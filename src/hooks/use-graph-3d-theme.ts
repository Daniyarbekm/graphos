"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export type Graph3DTheme = {
  background: string;
  grid: string;
  gridSection: string;
  axisX: string;
  axisY: string;
  axisZ: string;
  fog: string;
  ambient: number;
  directional: number;
};

const LIGHT: Graph3DTheme = {
  background: "#f8f9fc",
  grid: "#c8cdd8",
  gridSection: "#a8b0c0",
  axisX: "#ef4444",
  axisY: "#22c55e",
  axisZ: "#3b82f6",
  fog: "#f8f9fc",
  ambient: 0.55,
  directional: 1.1,
};

const DARK: Graph3DTheme = {
  background: "#12151c",
  grid: "#2a3040",
  gridSection: "#3d4558",
  axisX: "#f87171",
  axisY: "#4ade80",
  axisZ: "#60a5fa",
  fog: "#12151c",
  ambient: 0.45,
  directional: 1.25,
};

export function useGraph3DTheme(): Graph3DTheme {
  const { resolvedTheme } = useTheme();
  const [theme, setTheme] = useState<Graph3DTheme>(LIGHT);

  useEffect(() => {
    setTheme(resolvedTheme === "dark" ? DARK : LIGHT);
  }, [resolvedTheme]);

  return theme;
}
