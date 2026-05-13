"use client";

import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
    waistValue: number;
    chestValue: number;
    heightCm: number;
};

export default function FemaleModel({ waistValue, chestValue, heightCm }: Props) {
    const gltf = useGLTF("/models/female-base.glb");
    const scene = gltf.scene.clone();

    const meshRef = useRef<THREE.Mesh | null>(null);


    useEffect(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;

                mesh.material = new THREE.MeshStandardMaterial({
                    color: '#7a7a7a',
                    roughness: 0.85,
                    metalness: 0.05,
                })

                if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
                    meshRef.current = mesh;

                    const waistIndex = mesh.morphTargetDictionary["Waist_Wide"];
                    if (waistIndex !== undefined) {
                        mesh.morphTargetInfluences[waistIndex] = waistValue;
                    }

                    const chestIndex = mesh.morphTargetDictionary["Chest_Bulk"];
                    if (chestIndex !== undefined) {
                        mesh.morphTargetInfluences[chestIndex] = chestValue;
                    }
                }
            }
        });
    }, [scene, waistValue, chestValue]);

    const heightScale = heightCm / 175;
    const baseScale = 1.5;
    const scaledHeight = baseScale * heightScale;

    return (
        <primitive
            object={scene}
            scale={[
                baseScale,
                scaledHeight,
                baseScale
            ]}

            rotation={[
                0,
                0,
                0
            ]}

            position={[
                0,
                0,
                0
            ]}
        />
    );
}
