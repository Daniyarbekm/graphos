"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import type { GraphThemeColors } from "@/render-engine/renderer";

const LIGHT: GraphThemeColors = {
  background: "oklch(0.99 0.002 255)",
  gridMinor: "oklch(0.92 0.008 255 / 35%)",
  grid: "oklch(0.86 0.01 255 / 55%)",
  gridMajor: "oklch(0.72 0.02 255 / 75%)",
  axis: "oklch(0.45 0.04 255 / 95%)",
  label: "oklch(0.5 0.02 260)",
  origin: "oklch(0.52 0.19 255)",
};

const DARK: GraphThemeColors = {
  background: "oklch(0.12 0.015 260)",
  gridMinor: "oklch(1 0 0 / 4%)",
  grid: "oklch(1 0 0 / 9%)",
  gridMajor: "oklch(1 0 0 / 16%)",
  axis: "oklch(1 0 0 / 42%)",
  label: "oklch(0.68 0.02 255)",
  origin: "oklch(0.68 0.16 255)",
};

export function useGraphThemeColors(): GraphThemeColors {
  const { resolvedTheme } = useTheme();
  const [colors, setColors] = useState<GraphThemeColors>(LIGHT);

  useEffect(() => {
    setColors(resolvedTheme === "dark" ? DARK : LIGHT);
  }, [resolvedTheme]);

  return colors;
}
