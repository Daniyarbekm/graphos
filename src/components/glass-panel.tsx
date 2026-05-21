"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type GlassPanelProps = HTMLMotionProps<"div"> & {
  strong?: boolean;
};

export function GlassPanel({
  className,
  strong = false,
  children,
  ...props
}: GlassPanelProps) {
  return (
    <motion.div
      initial={false}
      className={cn(
        "rounded-2xl transition-theme",
        strong ? "glass-panel-strong" : "glass-panel",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
