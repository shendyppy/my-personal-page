"use client";

import { Suspense } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";

import type { Skill } from "@/types";

const SkillModel = ({ skill, theme }: { skill: Skill; theme: string }) => {
  const glb = useGLTF(skill.model);

  const box = new THREE.Box3().setFromObject(glb.scene);
  const size = box.getSize(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z);
  const targetSize = 2.5;
  const scale = maxDimension > 0 ? targetSize / maxDimension : 1.2;

  glb.scene.traverse((child: THREE.Object3D) => {
    if ((child as THREE.Mesh).isMesh) {
      (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
        color:
          theme === "dark"
            ? new THREE.Color(skill.color).offsetHSL(0, 0, 0.1)
            : skill.color,
        metalness: 0.3,
        roughness: 0.6,
        side: THREE.DoubleSide,
      });
    }
  });

  return (
    <group rotation={[Math.PI / 2, 0, 0]} scale={scale}>
      <primitive object={glb.scene} />
    </group>
  );
};

type SkillCanvasProps = {
  skill: Skill;
  theme: string;
};

/**
 * 3D viewer for the Skills section.
 *
 * The container uses `position: relative` + `minWidth: 0` so it can shrink
 * freely inside flex/grid parents, while the Canvas is `position: absolute`
 * to stay out of normal flow. This lets R3F's built-in ResizeObserver
 * track the real available space in both grow and shrink directions.
 */
const SkillCanvas = ({ skill, theme }: SkillCanvasProps) => (
  <div
    style={{
      position: "relative",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      minWidth: 0,
    }}
  >
    <Canvas
      camera={{ position: [0, 0, 12], fov: 60 }}
      dpr={[1, 1.5]}
      resize={{ debounce: { scroll: 50, resize: 0 } }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <ambientLight intensity={theme === "dark" ? 0.4 : 0.7} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={theme === "dark" ? 1.5 : 2}
      />
      <Suspense fallback={null}>
        <OrbitControls
          enableZoom
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
        />
        <SkillModel skill={skill} theme={theme} />
      </Suspense>
    </Canvas>
  </div>
);

export default SkillCanvas;
