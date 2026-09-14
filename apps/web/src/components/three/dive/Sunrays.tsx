"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { dive } from "@/lib/dive/depth";

/**
 * Alpha ramp for a shaft: soft across its width (sin), bright at the top and
 * gone by the bottom. Flat planes read as hard stripes laid over the hero type.
 */
const shaftAlpha = () => {
  const n = 32;
  const data = new Uint8Array(n * n * 4);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const i = (y * n + x) * 4;
      const a = Math.sin((Math.PI * (x + 0.5)) / n) * Math.pow(y / (n - 1), 1.6);
      data[i] = data[i + 1] = data[i + 2] = Math.round(a * 255);
      data[i + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, n, n);
  tex.magFilter = tex.minFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
};

/** Slanted light shafts near the surface; gone by ~700 m. */
export const Sunrays = ({ count = 5 }: { count?: number }) => {
  const group = useRef<THREE.Group>(null);
  const alpha = useMemo(() => shaftAlpha(), []);

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const vis = Math.max(0, 1 - dive.get().progress / 0.18);
    g.visible = vis > 0.01;
    if (!g.visible) return;
    const t = clock.elapsedTime;
    g.children.forEach((m, i) => {
      const mesh = m as THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
      mesh.material.opacity = 0.28 * vis * (0.6 + 0.4 * Math.sin(t * 0.4 + i));
      mesh.rotation.z = -0.35 + i * 0.12 + Math.sin(t * 0.15 + i) * 0.03;
    });
  });

  return (
    <group ref={group} position={[1.5, 5, -3]}>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i} position={[i * 0.9 - 2, 0, 0]}>
          <planeGeometry args={[0.7, 14]} />
          <meshBasicMaterial
            color="#9fd8ff"
            alphaMap={alpha}
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            fog={false}
          />
        </mesh>
      ))}
    </group>
  );
};
