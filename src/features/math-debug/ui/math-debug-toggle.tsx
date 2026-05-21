"use client";

import { Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store";

export function MathDebugToggle() {
  const mathDebug = useUIStore((s) => s.mathDebug);
  const toggle = useUIStore((s) => s.toggleMathDebug);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="glass"
          size="icon-sm"
          onClick={toggle}
          className={cn(mathDebug && "bg-primary/15 text-primary")}
          aria-pressed={mathDebug}
          aria-label="Toggle math debug"
        >
          <Bug className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {mathDebug ? "Hide math debug" : "Show math debug"}
      </TooltipContent>
    </Tooltip>
  );
}
