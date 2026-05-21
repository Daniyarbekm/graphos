import { MATH_FUNCTION_NAMES } from "./functions";

const FN_REGEX = new RegExp(
  `\\b(${MATH_FUNCTION_NAMES.join("|")})\\b`,
  "gi",
);

const PH = "\uE000";
const PH_END = "\uE001";

function protectFunctions(input: string): { expr: string; restore: (s: string) => string } {
  const fns: string[] = [];
  const expr = input.replace(FN_REGEX, (match) => {
    const idx = fns.length;
    fns.push(match.toLowerCase());
    return `${PH}${idx}${PH_END}`;
  });

  return {
    expr,
    restore: (s: string) => {
      let out = s;
      fns.forEach((fn, i) => {
        out = out.split(`${PH}${i}${PH_END}`).join(fn);
      });
      return out;
    },
  };
}

export function insertFunctionParentheses(input: string): string {
  const names = MATH_FUNCTION_NAMES.join("|");
  let s = input;

  s = s.replace(
    new RegExp(`\\b(${names})\\s+\\(([^()]*)\\)`, "gi"),
    "$1($2)",
  );

  s = s.replace(
    new RegExp(
      `\\b(${names})\\s+([a-zA-Z][a-zA-Z0-9]*|\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)`,
      "gi",
    ),
    "$1($2)",
  );

  return s;
}

export function applyShorthands(input: string): string {
  let s = input;

  s = s.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");

  const latexTrig: [RegExp, string][] = [
    [/\\asin\b/g, "asin"],
    [/\\acos\b/g, "acos"],
    [/\\atan\b/g, "atan"],
    [/\\sinh\b/g, "sinh"],
    [/\\cosh\b/g, "cosh"],
    [/\\tanh\b/g, "tanh"],
    [/\\sin\b/g, "sin"],
    [/\\cos\b/g, "cos"],
    [/\\tan\b/g, "tan"],
    [/\\sqrt\{([^}]+)\}/g, "sqrt($1)"],
    [/\\sqrt\(([^)]+)\)/g, "sqrt($1)"],
    [/\\ln\b/g, "ln"],
    [/\\log\b/g, "log"],
    [/\\pi\b/g, "pi"],
    [/\\abs\{([^}]+)\}/g, "abs($1)"],
    [/\\left\(/g, "("],
    [/\\right\)/g, ")"],
  ];

  for (const [re, rep] of latexTrig) {
    s = s.replace(re, rep);
  }

  s = s.replace(/\bπ\b/g, "pi");
  s = s.replace(/\be\^\{([^}]+)\}/gi, "exp($1)");
  s = s.replace(/\be\^\(([^)]+)\)/gi, "exp($1)");
  s = s.replace(/\be\^([a-zA-Z0-9.]+)/gi, "exp($1)");

  return s;
}

export function insertImplicitMultiplication(input: string): string {
  let s = input.trim();
  if (!s) return s;

  const fnNames = MATH_FUNCTION_NAMES.join("|");
  s = s.replace(
    new RegExp(`([xyt])\\s*(${fnNames})\\s*\\(`, "gi"),
    "$1*$2(",
  );
  s = s.replace(
    new RegExp(`([xyt])(${fnNames})\\s*\\(`, "gi"),
    "$1*$2(",
  );

  const { expr, restore } = protectFunctions(s);
  s = expr;

  const phCall = new RegExp(`(\\d)\\s*${PH}(\\d+)${PH_END}\\s*\\(`, "g");
  s = s.replace(phCall, `$1*${PH}$2${PH_END}(`);

  const rules: [RegExp, string][] = [
    [new RegExp(`(\\d)\\s*(${fnNames})\\s*\\(`, "gi"), "$1*$2("],
    [/(\d)([xytXYT])/g, "$1*$2"],
    [/(\d)\s*\(/g, "$1*("],
    [/(\))([a-zA-Z0-9(])/g, "$1*$2"],
    [/([xytXYT])\s*\(/gi, "$1*("],
    [/([xytXYT])(\d)/gi, "$1*$2"],
    [/(pi|e)\s*\(/gi, "$1*("],
    [/(\d)\s*(pi|e)\b/gi, "$1*$2"],
    [/([xytXYT])(pi|e)\b/gi, "$1*$2"],
    [/(pi|e)([xytXYT])/gi, "$1*$2"],
    [/(\))(\d)/g, "$1*$2"],
  ];

  for (const [re, rep] of rules) {
    s = s.replace(re, rep);
  }

  s = restore(s);
  s = s.replace(/\*\*/g, "*");
  s = s.replace(/\+\s*\*/g, "+");
  s = s.replace(/-\s*\*/g, "-");

  return s;
}

export function normalizeMathExpression(body: string): string {
  let s = applyShorthands(body.trim());
  s = insertFunctionParentheses(s);
  s = insertImplicitMultiplication(s);
  return s;
}

export function transformLogsForMathJs(normalized: string): string {
  return normalized
    .replace(/\bln\s*\(/gi, "__NATLOG__(")
    .replace(/\blog\s*\(/gi, "__LOG10__(")
    .replace(/__NATLOG__\(/g, "log(")
    .replace(/__LOG10__\(/g, "log10(");
}
