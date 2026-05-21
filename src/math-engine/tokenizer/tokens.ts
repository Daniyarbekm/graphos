export type TokenType =
  | "number"
  | "identifier"
  | "operator"
  | "lparen"
  | "rparen"
  | "comma"
  | "whitespace"
  | "unknown";

export type Token = {
  type: TokenType;
  value: string;
  pos: number;
};
