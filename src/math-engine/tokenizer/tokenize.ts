import type { Token } from "./tokens";

const OPERATORS = new Set(["+", "-", "*", "/", "^", "!"]);

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i]!;

    if (/\s/.test(ch)) {
      let ws = ch;
      i++;
      while (i < input.length && /\s/.test(input[i]!)) {
        ws += input[i];
        i++;
      }
      tokens.push({ type: "whitespace", value: ws, pos: i - ws.length });
      continue;
    }

    if (ch === "(") {
      tokens.push({ type: "lparen", value: ch, pos: i });
      i++;
      continue;
    }

    if (ch === ")") {
      tokens.push({ type: "rparen", value: ch, pos: i });
      i++;
      continue;
    }

    if (ch === ",") {
      tokens.push({ type: "comma", value: ch, pos: i });
      i++;
      continue;
    }

    if (OPERATORS.has(ch)) {
      tokens.push({ type: "operator", value: ch, pos: i });
      i++;
      continue;
    }

    if (/[0-9.]/.test(ch)) {
      let num = ch;
      i++;
      while (i < input.length && /[0-9.eE]/.test(input[i]!)) {
        num += input[i];
        i++;
      }
      tokens.push({ type: "number", value: num, pos: i - num.length });
      continue;
    }

    if (/[a-zA-Z_]/.test(ch)) {
      let id = ch;
      i++;
      while (i < input.length && /[a-zA-Z0-9_]/.test(input[i]!)) {
        id += input[i];
        i++;
      }
      tokens.push({ type: "identifier", value: id, pos: i - id.length });
      continue;
    }

    tokens.push({ type: "unknown", value: ch, pos: i });
    i++;
  }

  return tokens;
}

export function tokenizeForValidation(input: string): Token[] {
  return tokenize(input).filter((t) => t.type !== "whitespace");
}
