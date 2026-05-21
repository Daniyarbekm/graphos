import type { Expression, ExpressionId } from "@/shared/types";

export const EXPRESSION_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#22c55e",
  "#f59e0b",
  "#a855f7",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
] as const;

let idCounter = 0;

function generateId(): ExpressionId {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  idCounter += 1;
  return `expr-${idCounter}-${Date.now()}`;
}

export function createExpression(
  partial?: Partial<Expression> & { id?: ExpressionId },
): Expression {
  const id = partial?.id ?? generateId();
  const colorIndex =
    Math.abs(id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) %
    EXPRESSION_COLORS.length;

  return {
    id,
    latex: partial?.latex ?? "",
    color: partial?.color ?? EXPRESSION_COLORS[colorIndex] ?? EXPRESSION_COLORS[0],
    visible: partial?.visible ?? true,
    label: partial?.label,
  };
}
