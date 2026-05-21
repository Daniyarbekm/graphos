import { create, all } from "mathjs";
import type { MathJsInstance } from "mathjs";

let _math: MathJsInstance | null = null;

export function getMathScope(): MathJsInstance {
  if (!_math) {
    _math = create(all!);
  }
  return _math;
}

/** ln → natural log (math.js `log`), log → base-10 (`log10`) — Desmos convention */
export function transformForMathJs(normalized: string): string {
  return normalized
    .replace(/\bln\s*\(/gi, "__NATLOG__(")
    .replace(/\blog\s*\(/gi, "__LOG10__(")
    .replace(/__NATLOG__\(/g, "log(")
    .replace(/__LOG10__\(/g, "log10(");
}
