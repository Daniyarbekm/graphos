"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useGraphStore } from "@/store";
import { GraphCanvas2D } from "./graph-canvas-2d";
import { ViewportLoader } from "./viewport-loader";

const GraphScene3D = dynamic(
  () =>
    import("./scene/graph-scene-3d").then((m) => ({ default: m.GraphScene3D })),
  { ssr: false, loading: () => <ViewportLoader /> },
);

export function GraphView() {
  const mode = useGraphStore((s) => s.mode);
  const [sceneReady, setSceneReady] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence
        mode="wait"
        onExitComplete={() => setIsTransitioning(false)}
      >
        {mode === "2d" ? (
          <motion.div
            key="2d"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
            onAnimationStart={() => setIsTransitioning(true)}
            onAnimationComplete={() => setIsTransitioning(false)}
          >
            <GraphCanvas2D />
          </motion.div>
        ) : (
          <motion.div
            key="3d"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
            onAnimationStart={() => {
              setIsTransitioning(true);
              setSceneReady(false);
            }}
            onAnimationComplete={() => setIsTransitioning(false)}
          >
            <GraphScene3D onReady={() => setSceneReady(true)} />
            {(!sceneReady || isTransitioning) && <ViewportLoader />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
