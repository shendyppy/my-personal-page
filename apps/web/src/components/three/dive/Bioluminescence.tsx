"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { dive } from "@/lib/dive/depth";
import { scatter } from "@/lib/dive/scatter";

/** Sparse lime specks that pulse in the deep; fade in past ~2800 m. */
export const Bioluminescence = ({ count = 120 }: { count?: number }) => {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => scatter(count, [12, 8, 6], [0, 0, -1], 2), [count]);

  useFrame(({ clock }) => {
    const pts = points.current;
    if (!pts) return;
    const vis = Math.min(1, Math.max(0, (dive.get().progress - 0.7) / 0.15));
    pts.visible = vis > 0.01;
    (pts.material as THREE.PointsMaterial).opacity = vis * (0.35 + 0.35 * Math.sin(clock.elapsedTime * 1.3));
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#d7ff3e"
        size={0.035}
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
        fog={false}
      />
    </points>
  );
};
