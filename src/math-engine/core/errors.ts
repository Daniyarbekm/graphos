const MATHJS_HINTS: [RegExp, string][] = [
  [/Undefined symbol/i, "Unknown variable or function"],
  [/Unexpected token/i, "Check parentheses and operators"],
  [/Parenthesis/i, "Mismatched parentheses"],
  [/Value expected/i, "Incomplete expression"],
  [/Too few arguments/i, "Function is missing arguments"],
  [/Too many arguments/i, "Too many arguments for function"],
];

export function formatMathError(err: unknown, fallback = "Invalid expression"): string {
  const raw =
    err instanceof Error ? err.message.split("\n")[0]?.trim() : fallback;

  if (!raw) return fallback;

  for (const [pattern, hint] of MATHJS_HINTS) {
    if (pattern.test(raw)) return `${hint}: ${raw}`;
  }

  return raw.length > 120 ? `${raw.slice(0, 117)}…` : raw;
}

export function emptyInputError(): string {
  return "Enter an equation";
}

export function unknownVariableError(name: string): string {
  return `Unknown variable: ${name}`;
}

export function unsupportedCharsError(): string {
  return "Unsupported characters — use numbers, operators, and functions like sin, cos, sqrt";
}
