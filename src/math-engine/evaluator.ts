import { compile, parse } from "mathjs";
import type { GraphMode } from "@/shared/types";
import { ALLOWED_VARS, CONSTANT_SYMBOLS } from "./core/constants";
import type { CompileResult, CompiledFunction, PreprocessResult } from "./core/types";
import {
  emptyInputError,
  formatMathError,
  unknownVariableError,
  unsupportedCharsError,
} from "./core/errors";
import { MATH_FUNCTION_SET } from "./functions";
import { transformLogsForMathJs } from "./normalizer";
import { findInvalidToken } from "./tokenizer";
import { preprocess } from "./preprocess";

function collectSymbols(normalized: string): Set<string> {
  const symbols = new Set<string>();
  const node = parse(normalized);
  node.traverse((n) => {
    if (n.type === "SymbolNode" && "name" in n && typeof n.name === "string") {
      symbols.add(n.name);
    }
  });
  return symbols;
}

function validateSymbols(
  equation: PreprocessResult,
  symbols: Set<string>,
): string | null {
  const allowed =
    ALLOWED_VARS[equation.kind] ?? ALLOWED_VARS["cartesian-y"] ?? ["x"];
  const allowedSet = new Set([...allowed, ...CONSTANT_SYMBOLS]);

  for (const sym of symbols) {
    if (MATH_FUNCTION_SET.has(sym.toLowerCase())) continue;
    if (CONSTANT_SYMBOLS.has(sym)) continue;
    if (!allowedSet.has(sym)) {
      return unknownVariableError(sym);
    }
  }

  return null;
}

function buildTestScope(equation: PreprocessResult): Record<string, number> {
  const scope: Record<string, number> = { x: 0.5, y: 0.5, t: 0.5 };
  if (equation.independentVar === "t") {
    scope.t = Math.PI / 4;
  } else if (equation.kind === "cartesian-z") {
    scope.x = 0.5;
    scope.y = 0.5;
  } else {
    scope.x = Math.PI / 4;
  }
  return scope;
}

export function validateEquation(
  raw: string,
  mode: GraphMode,
): import("./core/types").ValidationResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: emptyInputError(), normalized: "" };
  }

  const equation = preprocess(trimmed, mode);
  if (!equation.normalized) {
    return { ok: false, error: "Expression is empty", normalized: "" };
  }

  const mathExpr = transformLogsForMathJs(equation.normalized);
  const bad = findInvalidToken(mathExpr);
  if (bad) {
    return {
      ok: false,
      error: `Unexpected character "${bad.value}"`,
      normalized: equation.normalized,
    };
  }

  const compiled = compileEquation(trimmed, mode);
  if (!compiled.ok) {
    return {
      ok: false,
      error: compiled.error,
      normalized: equation.normalized,
    };
  }

  return { ok: true, normalized: equation.normalized, error: null };
}

export function compileEquation(
  raw: string,
  mode: GraphMode,
): CompileResult {
  const equation = preprocess(raw.trim(), mode);

  if (!equation.normalized) {
    return {
      ok: false,
      error: "Expression is empty",
      fn: null,
      normalized: "",
      equation: null,
    };
  }

  const mathExpr = transformLogsForMathJs(equation.normalized);

  try {
    const bad = findInvalidToken(mathExpr);
    if (bad) {
      return {
        ok: false,
        error: `Unexpected character "${bad.value}"`,
        fn: null,
        normalized: equation.normalized,
        equation,
      };
    }

    const symbols = collectSymbols(mathExpr);
    const symError = validateSymbols(equation, symbols);
    if (symError) {
      return {
        ok: false,
        error: symError,
        fn: null,
        normalized: equation.normalized,
        equation,
      };
    }

    const compiled = compile(mathExpr);
    const fn: CompiledFunction = (scope) => {
      try {
        const result = compiled.evaluate({ ...scope });
        return typeof result === "number" && Number.isFinite(result)
          ? result
          : NaN;
      } catch {
        return NaN;
      }
    };

    const testScope = buildTestScope(equation);
    const testVal = fn(testScope);
    if (!Number.isFinite(testVal)) {
      return {
        ok: false,
        error: "Expression must evaluate to a finite number",
        fn: null,
        normalized: equation.normalized,
        equation,
      };
    }

    return {
      ok: true,
      fn,
      normalized: equation.normalized,
      equation,
      error: null,
    };
  } catch (err) {
    return {
      ok: false,
      error: formatMathError(err),
      fn: null,
      normalized: equation.normalized,
      equation,
    };
  }
}

export type DebugEvaluation = {
  raw: string;
  normalized: string;
  mathJs: string;
  parsed: string;
  testValue: number | null;
  error: string | null;
  ok: boolean;
};

export function debugEvaluate(
  raw: string,
  mode: GraphMode,
  testX = 1,
  testY = 1,
  testT = 1,
): DebugEvaluation {
  const equation = preprocess(raw.trim(), mode);
  const mathJs = transformLogsForMathJs(equation.normalized);

  let parsed = "";
  try {
    parsed = mathJs ? parse(mathJs).toString() : "";
  } catch (err) {
    return {
      raw,
      normalized: equation.normalized,
      mathJs,
      parsed: "",
      testValue: null,
      error: formatMathError(err),
      ok: false,
    };
  }

  const compiled = compileEquation(raw, mode);
  if (!compiled.ok || !compiled.fn) {
    return {
      raw,
      normalized: equation.normalized,
      mathJs,
      parsed,
      testValue: null,
      error: compiled.error,
      ok: false,
    };
  }

  const scope: Record<string, number> = { x: testX, y: testY, t: testT };
  const testValue = compiled.fn(scope);

  return {
    raw,
    normalized: equation.normalized,
    mathJs,
    parsed,
    testValue: Number.isFinite(testValue) ? testValue : null,
    error: null,
    ok: Number.isFinite(testValue),
  };
}
