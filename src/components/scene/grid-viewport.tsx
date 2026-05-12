"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

function GridScene() {
  return (
    <>
      <color attach="background" args={["#0c0c0c"]} />
      <ambientLight color="#f5f5f0" intensity={0.7} />
      <directionalLight color="#f5f5f0" position={[5, 8, 4]} intensity={0.8} />
      <gridHelper args={[20, 20, "#f5f5f0", "#f5f5f0"]} position={[0, -0.6, 0]} />
      <OrbitControls
        enablePan
        enableRotate
        enableZoom
        dampingFactor={0.08}
        maxDistance={20}
        minDistance={2}
      />
    </>
  );
}

export function GridViewport() {
  return (
    <div className="h-full w-full overflow-hidden rounded-md border border-foreground/30">
      <Canvas camera={{ fov: 50, position: [4, 4, 4] }}>
        <GridScene />
      </Canvas>
    </div>
  );
}
