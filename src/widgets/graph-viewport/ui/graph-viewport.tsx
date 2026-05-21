"use client";

import { motion } from "framer-motion";
import { GraphCanvas } from "@/render-engine";

export function GraphViewport() {
  return (
    <motion.main
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="relative min-h-0 flex-1 p-3 pt-2"
    >
      <div className="h-full overflow-hidden rounded-2xl border border-border/40 shadow-inner">
        <GraphCanvas />
      </div>
    </motion.main>
  );
}
