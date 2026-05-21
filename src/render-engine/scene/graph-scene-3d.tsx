"use client";

import { Canvas } from "@react-three/fiber";
import { GRAPH_3D } from "@/lib/graph-config";
import { cn } from "@/lib/utils";
import { SceneContent } from "./scene-content";

type GraphScene3DProps = {
  className?: string;
  onReady?: () => void;
};

export function GraphScene3D({ className, onReady }: GraphScene3DProps) {
  const [px, py, pz] = GRAPH_3D.camera.position;

  return (
    <div className={cn("relative h-full w-full", className)}>
      <Canvas
        className="h-full w-full touch-none"
        dpr={[1, 2]}
        camera={{
          position: [px, py, pz],
          fov: GRAPH_3D.camera.fov,
          near: GRAPH_3D.camera.near,
          far: GRAPH_3D.camera.far,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={onReady}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
