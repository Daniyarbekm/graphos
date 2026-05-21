"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import { GlassPanel } from "@/components/glass-panel";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExpressionList } from "@/features/expression-list";
import { useIsMobile } from "@/hooks";
import { cn } from "@/lib/utils";
import { useGraphStore, useUIStore } from "@/store";

const SIDEBAR_WIDTH = 300;

export function AppSidebar() {
  const isMobile = useIsMobile();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

  if (isMobile) {
    return (
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -SIDEBAR_WIDTH }}
              animate={{ x: 0 }}
              exit={{ x: -SIDEBAR_WIDTH }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="fixed top-0 left-0 z-50 flex h-full flex-col p-3"
              style={{ width: SIDEBAR_WIDTH }}
            >
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {sidebarOpen && (
        <motion.aside
          key="sidebar"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: SIDEBAR_WIDTH, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
          className="hidden shrink-0 overflow-hidden md:block"
        >
          <div className="h-full p-3 pr-0" style={{ width: SIDEBAR_WIDTH }}>
            <SidebarContent />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const mode = useGraphStore((s) => s.mode);

  return (
    <GlassPanel strong className="flex h-full flex-col gap-4 p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <Logo />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            setSidebarOpen(false);
            onClose?.();
          }}
          aria-label="Close sidebar"
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>

      <Separator />

      <div className="min-h-0 flex-1">
        <ExpressionList />
      </div>

      <p className="text-center text-[10px] text-muted-foreground/60">
        {mode === "3d" ? "Drag to orbit · Scroll to zoom" : "Scroll to zoom · Drag to pan"}
      </p>
    </GlassPanel>
  );
}

export function SidebarToggle() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggle = useUIStore((s) => s.toggleSidebar);

  return (
    <Button
      variant="glass"
      size="icon-sm"
      onClick={toggle}
      aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
    >
      <PanelLeft className={cn("h-4 w-4", !sidebarOpen && "text-primary")} />
    </Button>
  );
}
