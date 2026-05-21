"use client";

import { motion } from "framer-motion";
import { GlassPanel } from "@/components/glass-panel";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GraphModeToggle } from "@/features/graph-mode";
import { GridToggle } from "@/features/graph-settings";
import { MathDebugToggle } from "@/features/math-debug";
import { ThemeToggle } from "@/features/theme-toggle";
import { ViewportControls } from "@/features/viewport-controls";
import { SidebarToggle } from "@/widgets/app-sidebar";

export function AppToolbar() {
  return (
    <TooltipProvider>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="shrink-0 px-3 pt-3"
      >
        <GlassPanel className="flex h-12 items-center gap-2 px-3 shadow-md">
          <SidebarToggle />
          <Separator orientation="vertical" className="mx-1 h-6" />
          <GraphModeToggle />
          <div className="flex-1" />
          <div className="flex items-center gap-1">
            <ViewportControls />
            <Separator orientation="vertical" className="mx-1 h-6" />
            <GridToggle />
            <MathDebugToggle />
            <ThemeToggle />
          </div>
        </GlassPanel>
      </motion.header>
    </TooltipProvider>
  );
}
