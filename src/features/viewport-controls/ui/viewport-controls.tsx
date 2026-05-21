"use client";

import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GRAPH_INTERACTION } from "@/lib/graph-config";
import { useGraphStore } from "@/store";

export function ViewportControls() {
  const mode = useGraphStore((s) => s.mode);
  const zoomAt = useGraphStore((s) => s.zoomAt);
  const resetViewport = useGraphStore((s) => s.resetViewport);
  const bounds = useGraphStore((s) => s.bounds);

  const center = {
    x: (bounds.xMin + bounds.xMax) / 2,
    y: (bounds.yMin + bounds.yMax) / 2,
  };

  const is3d = mode === "3d";

  return (
    <>
      {!is3d && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="glass"
                size="icon-sm"
                onClick={() =>
                  zoomAt(GRAPH_INTERACTION.zoomButtonFactor, center)
                }
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom in</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="glass"
                size="icon-sm"
                onClick={() =>
                  zoomAt(1 / GRAPH_INTERACTION.zoomButtonFactor, center)
                }
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom out</TooltipContent>
          </Tooltip>
        </>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="glass"
            size="icon-sm"
            onClick={resetViewport}
            aria-label={is3d ? "Reset camera" : "Reset view"}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {is3d ? "Reset camera & domain" : "Reset view"}
        </TooltipContent>
      </Tooltip>
    </>
  );
}
