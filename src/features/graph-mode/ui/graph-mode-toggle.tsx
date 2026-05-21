"use client";

import { motion } from "framer-motion";
import { Box, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGraphStore } from "@/store";
import type { GraphMode } from "@/shared/types";

const modes: { value: GraphMode; label: string; icon: typeof Square }[] = [
  { value: "2d", label: "2D", icon: Square },
  { value: "3d", label: "3D", icon: Box },
];

export function GraphModeToggle() {
  const mode = useGraphStore((s) => s.mode);
  const setMode = useGraphStore((s) => s.setMode);

  return (
    <div className="relative flex items-center gap-0.5 rounded-xl bg-muted/60 p-0.5">
      <motion.div
        layoutId="mode-indicator"
        className="absolute inset-y-0.5 rounded-lg bg-background shadow-sm"
        style={{
          width: "calc(50% - 2px)",
          left: mode === "2d" ? "2px" : "calc(50%)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
      />
      {modes.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          variant="ghost"
          size="sm"
          onClick={() => setMode(value)}
          className={cn(
            "relative z-10 h-7 gap-1.5 rounded-lg px-3 text-xs",
            mode === value
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
          aria-pressed={mode === value}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </Button>
      ))}
    </div>
  );
}
