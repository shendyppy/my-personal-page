"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text3D, Environment, Float } from "@react-three/drei";

import { scene3DColors } from "@/constants/colors";
import type { Theme } from "@/types";

const FloatingCube = ({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) => (
  <Float speed={3} rotationIntensity={1} floatIntensity={2}>
    <mesh position={position}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color={color} />
    </mesh>
  </Float>
);

const Scene3D = ({ theme, isSmUp }: { theme: Theme; isSmUp: boolean }) => {
  const colors = scene3DColors[theme];

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Environment preset="studio" />

      {isSmUp ? (
        <Text3D
          font="/fonts/Press Start 2P.json"
          size={1}
          height={0.2}
          position={[-1.5, 1.5, -1.2]}
        >
          Hi,
          <meshStandardMaterial color={colors.text} />
        </Text3D>
      ) : null}

      <FloatingCube position={[3, 1, 0]} color={colors.cubes[0]} />
      <FloatingCube position={[-3, -1.5, -5]} color={colors.cubes[1]} />
      <FloatingCube position={[-3, -1, 1]} color={colors.cubes[2]} />
      <FloatingCube position={[2, -1.5, -1]} color={colors.cubes[3]} />

      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
};

type HeroSceneProps = {
  theme: Theme;
  isSmUp: boolean;
};

/**
 * 3D hero scene. Extracted into its own module so the heavy R3F + drei +
 * three bundle is split out via `next/dynamic` from the parent. The text
 * + traits in the hero render immediately while this scene streams in.
 */
const HeroScene = ({ theme, isSmUp }: HeroSceneProps) => (
  <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
    <Suspense fallback={null}>
      <Scene3D theme={theme} isSmUp={isSmUp} />
    </Suspense>
  </Canvas>
);

export default HeroScene;
