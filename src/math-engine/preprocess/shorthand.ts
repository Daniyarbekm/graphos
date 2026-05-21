/**
 * LaTeX-like and calculator shorthands → math.js syntax.
 */
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
    [/\\e\b/g, "e"],
    [/\\abs\{([^}]+)\}/g, "abs($1)"],
    [/\\left\(/g, "("],
    [/\\right\)/g, ")"],
  ];

  for (const [re, rep] of latexTrig) {
    s = s.replace(re, rep);
  }

  s = s.replace(/\bπ\b/g, "pi");

  s = s.replace(/\bln\s*\(/gi, "ln(");
  s = s.replace(/\blog\s*\(/gi, "log(");

  s = s.replace(/\be\^\{([^}]+)\}/gi, "exp($1)");
  s = s.replace(/\be\^\(([^)]+)\)/gi, "exp($1)");
  s = s.replace(/\be\^([a-zA-Z0-9.]+)/gi, "exp($1)");

  return s;
}
