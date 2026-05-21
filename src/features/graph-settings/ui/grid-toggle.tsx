"use client";

import { Grid3x3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useGraphStore } from "@/store";

export function GridToggle() {
  const showGrid = useGraphStore((s) => s.showGrid);
  const setShowGrid = useGraphStore((s) => s.setShowGrid);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="glass"
          size="icon-sm"
          onClick={() => setShowGrid(!showGrid)}
          className={cn(showGrid && "bg-primary/10 text-primary")}
          aria-pressed={showGrid}
          aria-label="Toggle grid"
        >
          <Grid3x3 className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{showGrid ? "Hide grid" : "Show grid"}</TooltipContent>
    </Tooltip>
  );
}
