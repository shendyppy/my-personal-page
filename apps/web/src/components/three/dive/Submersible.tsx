"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { dive } from "@/lib/dive/depth";
import { poseAt } from "@/lib/dive/pose";

const ACCENT = "#d7ff3e";
const HULL = "#232d3a";
const TRIM = "#3b4756";

// Ruling D: a SpotLight only aims at `target` once that Object3D is part of
// the scene graph. Each lamp gets its own target, rendered via <primitive>
// and passed explicitly — `target-position` on a detached default target is
// silently ignored.
const LAMP_Z = [0.22, -0.22] as const;

/**
 * Procedural submersible: capsule hull, porthole ring, two accent lamps with
 * spotlights, propeller guard, antenna. Position/scale/lamp come from poseAt
 * every frame, plus an idle bob and a small pointer parallax.
 */
export const Submersible = () => {
  const group = useRef<THREE.Group>(null);
  const lampA = useRef<THREE.SpotLight>(null);
  const lampB = useRef<THREE.SpotLight>(null);
  const glowA = useRef<THREE.MeshBasicMaterial>(null);
  const glowB = useRef<THREE.MeshBasicMaterial>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const targets = useMemo(() => [new THREE.Object3D(), new THREE.Object3D()], []);

  useFrame(({ clock, pointer: p }, dt) => {
    const g = group.current;
    if (!g) return;
    const s = dive.get();
    const pose = poseAt(s.progress, s.ranges);
    pointer.current.x += (p.x - pointer.current.x) * Math.min(1, dt * 3);
    pointer.current.y += (p.y - pointer.current.y) * Math.min(1, dt * 3);
    const t = clock.elapsedTime;
    g.position.set(pose.x, pose.y + Math.sin(t * 0.8) * 0.08, 0);
    g.rotation.set(pointer.current.y * -0.07, pointer.current.x * 0.07, pose.rotZ + Math.sin(t * 0.5) * 0.02);
    g.scale.setScalar(pose.scale);
    const lampIntensity = pose.lamp * 30;
    const glowOpacity = Math.min(1, 0.15 + pose.lamp * 0.3);
    if (lampA.current) lampA.current.intensity = lampIntensity;
    if (lampB.current) lampB.current.intensity = lampIntensity;
    if (glowA.current) glowA.current.opacity = glowOpacity;
    if (glowB.current) glowB.current.opacity = glowOpacity;
  });

  return (
    <group ref={group}>
      {/* hull */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.42, 1.5, 8, 24]} />
        <meshStandardMaterial color={HULL} metalness={0.2} roughness={0.55} />
      </mesh>
      {/* porthole ring + glass */}
      <mesh position={[0.55, 0.08, 0.36]} rotation={[0, 0.6, 0]}>
        <torusGeometry args={[0.16, 0.035, 12, 32]} />
        <meshStandardMaterial color={TRIM} metalness={0.35} roughness={0.4} />
      </mesh>
      <mesh position={[0.55, 0.08, 0.36]} rotation={[0, 0.6, 0]}>
        <circleGeometry args={[0.14, 24]} />
        <meshBasicMaterial color="#9fe6ff" transparent opacity={0.35} />
      </mesh>
      {/* lamps */}
      {LAMP_Z.map((z, i) => (
        <group key={z} position={[1.05, -0.1, z]}>
          <mesh>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshBasicMaterial ref={i === 0 ? glowA : glowB} color={ACCENT} transparent />
          </mesh>
          <primitive object={targets[i]} position={[4, -2, 0]} />
          <spotLight
            ref={i === 0 ? lampA : lampB}
            color={ACCENT}
            angle={0.5}
            penumbra={0.6}
            distance={9}
            decay={1}
            position={[0, 0, 0]}
            target={targets[i]}
          />
        </group>
      ))}
      {/* propeller guard */}
      <mesh position={[-1.05, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.28, 0.03, 10, 28]} />
        <meshStandardMaterial color={TRIM} metalness={0.35} roughness={0.4} />
      </mesh>
      {/* antenna */}
      <mesh position={[-0.3, 0.55, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.5, 6]} />
        <meshStandardMaterial color={TRIM} />
      </mesh>
    </group>
  );
};
