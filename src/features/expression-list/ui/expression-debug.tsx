"use client";

import { useExpressionDebug } from "@/hooks/use-expression-debug";
import { cn } from "@/lib/utils";

type ExpressionDebugProps = {
  latex: string;
  enabled: boolean;
};

export function ExpressionDebug({ latex, enabled }: ExpressionDebugProps) {
  const debug = useExpressionDebug(latex, enabled);

  if (!enabled || !debug) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-border/50 bg-muted/30 p-2 font-mono text-[10px]",
        "leading-relaxed text-muted-foreground",
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <Row label="Raw" value={debug.raw} />
      <Row label="Normalized" value={debug.normalized} />
      <Row label="math.js" value={debug.mathJs} />
      <Row label="AST" value={debug.parsed || "—"} />
      <Row
        label="f(test)"
        value={
          debug.testValue !== null
            ? String(debug.testValue)
            : debug.error ?? "NaN"
        }
        highlight={debug.ok}
      />
      {debug.error && (
        <p className="mt-1 text-destructive">{debug.error}</p>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex gap-2">
      <span className="w-20 shrink-0 text-muted-foreground/70">{label}</span>
      <span
        className={cn(
          "min-w-0 break-all",
          highlight ? "text-primary" : "text-foreground/80",
        )}
      >
        {value}
      </span>
    </div>
  );
}
