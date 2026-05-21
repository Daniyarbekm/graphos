import { MATH_FUNCTION_NAMES } from "../functions";

/** @deprecated Use MATH_FUNCTION_NAMES from functions.ts */
export const MATH_FUNCTIONS = MATH_FUNCTION_NAMES;

export const MATH_CONSTANTS = ["pi", "e", "PI", "E"] as const;

/** Variables allowed per equation kind */
export const ALLOWED_VARS: Record<string, readonly string[]> = {
  "cartesian-y": ["x"],
  "cartesian-z": ["x", "y"],
  "parametric-x": ["t"],
  "parametric-y": ["t"],
  bare: ["x", "y", "t"],
};

export const CONSTANT_SYMBOLS = new Set(["e", "pi", "PI", "E"]);
