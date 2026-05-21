export {
  prepareEquation,
  preprocess,
  parseEquation,
  classifyEquation,
  compileEquation,
  validateEquation,
  validateExpression,
  debugEvaluate,
  tokenize,
  tokenizeForValidation,
  normalizeMathExpression,
  applyShorthands,
  insertImplicitMultiplication,
  insertFunctionParentheses,
  MATH_EVAL_SCOPE,
  MATH_FUNCTION_NAMES,
} from "./pipeline";

export { compileFunction2D, compileFunction } from "./compiler";
export { compileFunction3D } from "./compiler-3d";
export { evaluateAllExpressions, evaluateExpression } from "./evaluate";
export {
  evaluateAllExpressions3D,
  evaluateExpression3D,
} from "./evaluate-3d";
export {
  normalizeExpression,
  normalizeExpressionForMode,
} from "./normalizer-legacy";
export {
  normalizeExpression3D,
  is3DExpression,
  isParametricExpression,
} from "./normalize-3d";
export { validateExpression2D } from "./validate";
export { validateExpression3D } from "./validator-3d";
export { sampleCurve2D } from "./graph/curve-2d";
export { sampleSurface3D } from "./graph/surface-3d";
export { sampleParametric2D, toFunctionT } from "./graph/parametric-2d";

export type { DebugEvaluation } from "./evaluator";
export type {
  EquationKind,
  PreprocessResult,
  CompiledFunction,
} from "./core/types";

export type {
  CompiledFunction2D,
  CompiledFunction3D,
  CompileResult,
  CompileResult3D,
  Curve2D,
  CurveSegment,
  EvaluatedExpression,
  EvaluatedSurface3D,
  ParseResult,
  SampleOptions,
  SampleSurfaceOptions,
  SurfaceBounds,
  SurfaceMeshData,
  ValidationResult,
} from "./types";
