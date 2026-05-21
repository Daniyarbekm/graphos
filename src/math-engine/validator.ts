import { validateEquation } from "./evaluator/validate";

/** @deprecated Use validateEquation(raw, '2d') */
export const validateExpression2D = (raw: string) =>
  validateEquation(raw, "2d");
