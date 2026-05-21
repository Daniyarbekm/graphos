"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function ViewportLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-graph-bg/60 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" strokeWidth={1.5} />
        <p className="text-xs font-medium text-muted-foreground">
          Loading 3D scene…
        </p>
      </div>
    </motion.div>
  );
}
