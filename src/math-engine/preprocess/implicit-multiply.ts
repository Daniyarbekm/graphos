import { MATH_FUNCTIONS } from "../core/constants";

const FN_PATTERN = new RegExp(
  `\\b(${MATH_FUNCTIONS.join("|")})\\b`,
  "gi",
);

/**
 * Inserts explicit `*` for natural notation: 2x, 3sin(x), x(y+1), )( , etc.
 */
export function insertImplicitMultiplication(input: string): string {
  let s = input.trim();
  if (!s) return s;

  const placeholders: string[] = [];
  s = s.replace(FN_PATTERN, (match) => {
    const key = `__FN${placeholders.length}__`;
    placeholders.push(match.toLowerCase());
    return key;
  });

  s = s.replace(/\^/g, "^");

  const rules: [RegExp, string][] = [
    [/(\d)([a-zA-Z(])/g, "$1*$2"],
    [/(\))([a-zA-Z0-9(])/g, "$1*$2"],
    [/([a-zA-Z])(\()/g, "$1*$2"],
    [/(\d)\s*\*\s*__/g, "$1*__"],
    [/([a-zA-Z])([a-zA-Z])/g, "$1*$2"],
    [/(\))(\d)/g, "$1*$2"],
    [/(pi|e)([a-zA-Z(])/gi, "$1*$2"],
  ];

  for (const [re, rep] of rules) {
    s = s.replace(re, rep);
  }

  placeholders.forEach((fn, i) => {
    s = s.replaceAll(`__FN${i}__`, fn);
  });

  s = s.replace(/\*\*/g, "*");
  s = s.replace(/\+\s*\*/g, "+");
  s = s.replace(/\-\s*\*/g, "-");

  return s;
}
