"use client";

import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
    waistValue: number;
    chestValue: number;
    thighValue: number;
    heightCm: number;
};

export default function MaleModel({ waistValue, chestValue, heightCm, thighValue }: Props) {
    const { scene } = useGLTF("/models/male-base.glb");

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

                    const thighIndex = mesh.morphTargetDictionary["Thigh_Thick"];
                    if (thighIndex !== undefined) {
                        mesh.morphTargetInfluences[thighIndex] = thighValue;
                    }
                }
            }
        });
    }, [scene, waistValue, chestValue, thighValue]);

    const heightScale = heightCm / 175;
    const baseScale = 1.5;
    const scaledHeight = baseScale * heightScale;

    return (
        <primitive
            object={scene}
            scale={[
                baseScale,
                baseScale,
                scaledHeight
            ]}

            rotation={[
                0.5 * Math.PI,
                0,
                0.5 * Math.PI
            ]}

            position={[
                0,
                1.4,
                0
            ]}
        />
    );
}
