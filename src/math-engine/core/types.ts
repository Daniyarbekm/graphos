import type { GraphMode } from "@/shared/types";

/** How the equation should be graphed */
export type EquationKind =
  | "cartesian-y"
  | "cartesian-z"
  | "parametric-x"
  | "parametric-y"
  | "bare";

export type IndependentVar = "x" | "y" | "t";

export type PreprocessResult = {
  kind: EquationKind;
  raw: string;
  normalized: string;
  lhs: string | null;
  independentVar: IndependentVar;
  dependentVar: "y" | "z" | "x" | null;
};

export type ValidationResult =
  | { ok: true; normalized: string; error: null }
  | { ok: false; normalized: string; error: string };

export type ParseResult =
  | { ok: true; equation: PreprocessResult; ast: unknown }
  | { ok: false; error: string; normalized: string };

export type CompiledFunction = (scope: Record<string, number>) => number;

export type CompileResult =
  | {
      ok: true;
      fn: CompiledFunction;
      normalized: string;
      equation: PreprocessResult;
      error: null;
    }
  | {
      ok: false;
      fn: null;
      normalized: string;
      equation: PreprocessResult | null;
      error: string;
    };

export type EvalContext = {
  mode: GraphMode;
};
