import {
  acos,
  asin,
  atan,
  cos,
  cosh,
  exp,
  log,
  log10,
  pi,
  sin,
  sinh,
  sqrt,
  tan,
  tanh,
  e,
  abs,
  floor,
  ceil,
  min,
  max,
} from "mathjs";

/** All function names exposed to the evaluator */
export const MATH_FUNCTION_NAMES = [
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "sinh",
  "cosh",
  "tanh",
  "sqrt",
  "abs",
  "log",
  "log10",
  "ln",
  "exp",
  "floor",
  "ceil",
  "min",
  "max",
] as const;

export type MathFunctionName = (typeof MATH_FUNCTION_NAMES)[number];

export const MATH_FUNCTION_SET = new Set<string>(MATH_FUNCTION_NAMES);

/** Explicit evaluation scope — ensures trig & constants resolve correctly */
export const MATH_EVAL_SCOPE = {
  sin,
  cos,
  tan,
  asin,
  acos,
  atan,
  sinh,
  cosh,
  tanh,
  sqrt,
  abs,
  log,
  log10,
  ln: log,
  exp,
  floor,
  ceil,
  min,
  max,
  pi,
  e,
  E: e,
  PI: pi,
} as const;

export function isMathFunction(name: string): boolean {
  return MATH_FUNCTION_SET.has(name.toLowerCase());
}
