"use client";

import { useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { GRAPH_3D } from "@/lib/graph-config";

type CameraControllerProps = {
  resetToken: number;
};

export function CameraController({ resetToken }: CameraControllerProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const [px, py, pz] = GRAPH_3D.camera.position;

  useEffect(() => {
    camera.position.set(px, py, pz);
    camera.lookAt(0, 0, 0);
    const controls = controlsRef.current;
    if (controls) {
      controls.target.set(0, 0, 0);
      controls.update();
    }
  }, [resetToken, camera, px, py, pz]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={GRAPH_3D.orbit.dampingFactor}
      minDistance={GRAPH_3D.orbit.minDistance}
      maxDistance={GRAPH_3D.orbit.maxDistance}
      rotateSpeed={GRAPH_3D.orbit.rotateSpeed}
      zoomSpeed={GRAPH_3D.orbit.zoomSpeed}
      maxPolarAngle={Math.PI / 2 - 0.05}
    />
  );
}
