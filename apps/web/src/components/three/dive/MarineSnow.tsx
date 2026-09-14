"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { dive } from "@/lib/dive/depth";
import { scatter } from "@/lib/dive/scatter";

const BOX = { x: 14, y: 10, z: 8 };

/** Drifting particulate. It streams upward faster while scrolling — we are the ones sinking. */
export const MarineSnow = ({ count = 1400 }: { count?: number }) => {
  const points = useRef<THREE.Points>(null);
  const last = useRef(0);
  const positions = useMemo(() => scatter(count, [BOX.x, BOX.y, BOX.z], [0, 0, -2], 1), [count]);

  useFrame((_, dt) => {
    const pts = points.current;
    if (!pts) return;
    const p = dive.get().progress;
    // Progress per second, not per frame, so the stream speed ignores fps.
    const velocity = Math.abs(p - last.current) / Math.max(dt, 1e-3);
    last.current = p;
    const speed = 0.12 + Math.min(velocity * 36, 4);
    const attr = pts.geometry.attributes.position;
    const arr = attr.array as Float32Array;
    for (let i = 1; i < arr.length; i += 3) {
      arr[i] += speed * dt;
      if (arr[i] > BOX.y / 2) arr[i] -= BOX.y;
    }
    attr.needsUpdate = true;
    (pts.material as THREE.PointsMaterial).opacity = 0.35 + p * 0.35;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#dfe9f2" size={0.025} transparent opacity={0.4} depthWrite={false} sizeAttenuation />
    </points>
  );
};
