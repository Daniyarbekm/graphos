import type { EquationKind, IndependentVar, PreprocessResult } from "../core/types";
import type { GraphMode } from "@/shared/types";

type PrefixMatch = {
  kind: EquationKind;
  body: string;
  lhs: string | null;
  independentVar: IndependentVar;
  dependentVar: "y" | "z" | "x" | null;
};

function match2D(trimmed: string): PrefixMatch {
  if (/^x\s*\(\s*t\s*\)\s*=/i.test(trimmed)) {
    return {
      kind: "parametric-x",
      body: trimmed.replace(/^x\s*\(\s*t\s*\)\s*=\s*/i, "").trim(),
      lhs: "x(t)",
      independentVar: "t",
      dependentVar: "x",
    };
  }

  if (/^x\s*=/i.test(trimmed)) {
    return {
      kind: "parametric-x",
      body: trimmed.replace(/^x\s*=\s*/i, "").trim(),
      lhs: "x",
      independentVar: "t",
      dependentVar: "x",
    };
  }

  if (/^y\s*=/i.test(trimmed)) {
    const body = trimmed.replace(/^y\s*=\s*/i, "").trim();
    const usesT = /\bt\b/i.test(body);
    const usesX = /\bx\b/i.test(body);

    if (usesT && !usesX) {
      return {
        kind: "parametric-y",
        body,
        lhs: "y",
        independentVar: "t",
        dependentVar: "y",
      };
    }

    return {
      kind: "cartesian-y",
      body,
      lhs: "y",
      independentVar: "x",
      dependentVar: "y",
    };
  }

  if (/^f\s*\(\s*x\s*\)\s*=/i.test(trimmed)) {
    return {
      kind: "cartesian-y",
      body: trimmed.replace(/^f\s*\(\s*x\s*\)\s*=\s*/i, "").trim(),
      lhs: "f(x)",
      independentVar: "x",
      dependentVar: "y",
    };
  }

  return {
    kind: "cartesian-y",
    body: trimmed,
    lhs: null,
    independentVar: "x",
    dependentVar: "y",
  };
}

function match3D(trimmed: string): PrefixMatch {
  if (/^f\s*\(\s*x\s*,\s*y\s*\)\s*=/i.test(trimmed)) {
    return {
      kind: "cartesian-z",
      body: trimmed.replace(/^f\s*\(\s*x\s*,\s*y\s*\)\s*=\s*/i, "").trim(),
      lhs: "f(x,y)",
      independentVar: "x",
      dependentVar: "z",
    };
  }

  if (/^z\s*=/i.test(trimmed)) {
    return {
      kind: "cartesian-z",
      body: trimmed.replace(/^z\s*=\s*/i, "").trim(),
      lhs: "z",
      independentVar: "x",
      dependentVar: "z",
    };
  }

  return {
    kind: "cartesian-z",
    body: trimmed,
    lhs: null,
    independentVar: "x",
    dependentVar: "z",
  };
}

export function stripEquationPrefix(
  raw: string,
  mode: GraphMode,
): PrefixMatch {
  const trimmed = raw.trim();
  return mode === "3d" ? match3D(trimmed) : match2D(trimmed);
}

export function is3DExpression(raw: string): boolean {
  const t = raw.trim();
  return /^z\s*=/i.test(t) || /^f\s*\(\s*x\s*,\s*y\s*\)\s*=/i.test(t);
}

export function isParametricExpression(raw: string): boolean {
  const t = raw.trim();
  if (/^x\s*=/i.test(t)) return true;
  if (/^y\s*=/i.test(t)) {
    const body = t.replace(/^y\s*=\s*/i, "");
    return /\bt\b/i.test(body) && !/\bx\b/i.test(body);
  }
  return false;
}

export function buildPreprocessResult(
  raw: string,
  mode: GraphMode,
  normalized: string,
): PreprocessResult {
  const prefix = stripEquationPrefix(raw, mode);
  return {
    kind: prefix.kind,
    raw,
    normalized,
    lhs: prefix.lhs,
    independentVar: prefix.independentVar,
    dependentVar: prefix.dependentVar,
  };
}
