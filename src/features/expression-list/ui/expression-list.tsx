"use client";

import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGraphStore } from "@/store";
import { ExpressionItem } from "./expression-item";

export function ExpressionList() {
  const expressions = useGraphStore((s) => s.expressions);
  const addExpression = useGraphStore((s) => s.addExpression);

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Expressions
        </h2>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => addExpression()}
          aria-label="Add expression"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 pr-2">
        <div className="flex flex-col gap-2 pb-2">
          <AnimatePresence mode="popLayout">
            {expressions.map((expr) => (
              <ExpressionItem key={expr.id} expression={expr} />
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
