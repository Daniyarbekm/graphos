export { is3DExpression, isParametricExpression } from "./preprocess";
import { preprocess } from "./preprocess";

/** @deprecated Use preprocess(raw, '3d') */
export function normalizeExpression3D(raw: string): string {
  return preprocess(raw, "3d").normalized;
}
