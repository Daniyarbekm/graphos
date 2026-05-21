import type { GraphMode } from "@/shared/types";
import { validateEquation } from "./evaluator";
import type { ValidationResult } from "./core/types";

export function validateExpression(
  raw: string,
  mode: GraphMode = "2d",
): ValidationResult {
  return validateEquation(raw, mode);
}

export function validateExpression2D(raw: string): ValidationResult {
  return validateEquation(raw, "2d");
}

export function validateExpression3D(raw: string): ValidationResult {
  return validateEquation(raw, "3d");
}
