"use client";

import { OrbitControls, Grid } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import MaleModel from "../models/MaleModel";

type Props = {
  waistValue: number;
  chestValue: number;
  heightValue: number;
  heightCm: number;
};

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

export function GridViewport({ waistValue, chestValue, heightValue, heightCm }: Props) {
  return (
    <div className="h-full w-full overflow-hidden rounded-md border border-foreground/30">
      <Canvas camera={{ fov: 35, position: [0, 1.4, 3] }}>
        <ambientLight intensity={1.5} />

        <directionalLight
          position={[3, 5, 4]}
          intensity={2}
        />

        <directionalLight
          position={[-3, 2, -2]}
          intensity={1}
        />

        <Grid
          args={[10, 10]}
          cellSize={0.5}
          cellThickness={0.5}
          sectionSize={2}
        />

        <MaleModel waistValue={waistValue} chestValue={chestValue} heightValue={heightValue} heightCm={heightCm} />

        <OrbitControls />

        <GridScene />
      </Canvas>
    </div>
  );
}
