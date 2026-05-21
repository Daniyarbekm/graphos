import { validateEquation } from "./evaluator/validate";

export const validateExpression3D = (raw: string) =>
  validateEquation(raw, "3d");
