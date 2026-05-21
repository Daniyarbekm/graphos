"use client";

import { motion } from "framer-motion";
import { AlertCircle, Eye, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExpressionError } from "@/hooks/use-expression-errors";
import { cn } from "@/lib/utils";
import { useGraphStore } from "@/store";
import type { Expression } from "@/shared/types";
import { useUIStore } from "@/store";
import { ColorPicker } from "./color-picker";
import { ExpressionDebug } from "./expression-debug";

type ExpressionItemProps = {
  expression: Expression;
};

export function ExpressionItem({ expression }: ExpressionItemProps) {
  const activeId = useGraphStore((s) => s.activeExpressionId);
  const setActive = useGraphStore((s) => s.setActiveExpression);
  const update = useGraphStore((s) => s.updateExpression);
  const remove = useGraphStore((s) => s.removeExpression);
  const mode = useGraphStore((s) => s.mode);
  const mathDebug = useUIStore((s) => s.mathDebug);
  const error = useExpressionError(expression.latex);

  const isActive = activeId === expression.id;
  const placeholder =
    mode === "3d"
      ? "z = sin(x*y)"
      : "y = sin(x)  or  x = cos(t), y = sin(t)";
  const hasError = error !== null && expression.latex.trim() !== "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      className={cn(
        "group flex flex-col gap-2 rounded-xl border p-2.5 transition-theme",
        isActive
          ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
          : "border-transparent bg-muted/40 hover:border-border/60",
        hasError && !isActive && "border-destructive/40 bg-destructive/5",
      )}
      onClick={() => setActive(expression.id)}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-offset-1 ring-offset-transparent transition-transform hover:scale-125"
          style={{
            backgroundColor: expression.color,
            boxShadow: isActive ? `0 0 0 2px ${expression.color}40` : undefined,
          }}
          onClick={(e) => e.stopPropagation()}
          aria-label="Expression color"
        />
        <div className="min-w-0 flex-1">
          <input
            type="text"
            value={expression.latex}
            onChange={(e) =>
              update(expression.id, { latex: e.target.value })
            }
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "w-full bg-transparent font-mono text-sm outline-none",
              "placeholder:text-muted-foreground/60",
              hasError && "text-destructive",
            )}
            placeholder={placeholder}
            spellCheck={false}
          />
          {expression.label && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {expression.label}
            </p>
          )}
        </div>
        <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              update(expression.id, { visible: !expression.visible });
            }}
            aria-label={expression.visible ? "Hide graph" : "Show graph"}
          >
            {expression.visible ? (
              <Eye className="h-3.5 w-3.5" />
            ) : (
              <EyeOff className="h-3.5 w-3.5 opacity-50" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              remove(expression.id);
            }}
            aria-label="Remove expression"
          >
            <Trash2 className="h-3.5 w-3.5 text-destructive/80" />
          </Button>
        </div>
      </div>

      {hasError && (
        <div className="flex items-start gap-1.5 text-xs text-destructive">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isActive && (
        <>
          <ColorPicker
            value={expression.color}
            onChange={(color) => update(expression.id, { color })}
          />
          <ExpressionDebug latex={expression.latex} enabled={mathDebug} />
        </>
      )}
    </motion.div>
  );
}
