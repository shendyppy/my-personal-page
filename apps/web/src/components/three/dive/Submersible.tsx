"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

import { dive } from "@/lib/dive/depth";
import { poseAt } from "@/lib/dive/pose";
import { createSpin, spinEnd, spinMove, spinStart, spinStep } from "@/lib/dive/spin";

const ACCENT = "#d7ff3e";

// Ruling D: a SpotLight only aims at `target` once that Object3D is part of
// the scene graph. Each lamp gets its own target, rendered via <primitive>
// and passed explicitly — `target-position` on a detached default target is
// silently ignored.
const LAMP_Z = [0.2, -0.2] as const;
const SKID_Z = [0.3, -0.3] as const;
const POD_Z = [0.56, -0.56] as const;
const BLADES = [0, 1, 2];
// Three-quarter view: seen dead side-on the hull reads as a flat silhouette.
const YAW = -0.5;
const PITCH = 0.1;

/** Hull profile, tail (-y) to nose (+y), revolved and laid along +x. */
const HULL_PROFILE = [
  [0, -1.22], [0.14, -1.2], [0.26, -1.08], [0.36, -0.86], [0.42, -0.55],
  [0.44, -0.1], [0.43, 0.45], [0.39, 0.8], [0.31, 1.0], [0.24, 1.08], [0, 1.08],
].map(([r, y]) => new THREE.Vector2(r, y));

/** A three-bladed propeller; the parent spins it about x. */
const Propeller = ({ radius, mat }: { radius: number; mat: THREE.Material }) => (
  <>
    <mesh rotation={[0, 0, -Math.PI / 2]} material={mat}>
      <coneGeometry args={[radius * 0.28, radius * 0.7, 12]} />
    </mesh>
    {BLADES.map((i) => (
      <mesh key={i} rotation={[(i * Math.PI * 2) / 3, 0, 0]} material={mat}>
        <boxGeometry args={[0.02, radius * 0.95, radius * 0.34]} />
      </mesh>
    ))}
  </>
);

/**
 * Procedural deep-sea research submersible: revolved hull with seam bands, an
 * acrylic dome, sail with hatch and strobe, shrouded stern thruster, cruciform
 * tail, side thruster pods, skids, a lamp bar and a manipulator arm. Nose is
 * +x. Props spin faster while the page is scrolling. Position/scale/lamp come
 * from poseAt every frame, plus an idle bob and a small pointer parallax; a
 * mouse drag on the hull spins it with inertia (lib/dive/spin).
 */
export const Submersible = () => {
  const group = useRef<THREE.Group>(null);
  const lampA = useRef<THREE.SpotLight>(null);
  const lampB = useRef<THREE.SpotLight>(null);
  const glowA = useRef<THREE.MeshBasicMaterial>(null);
  const glowB = useRef<THREE.MeshBasicMaterial>(null);
  const strobe = useRef<THREE.MeshBasicMaterial>(null);
  const props = useRef<THREE.Group[]>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const lastProgress = useRef(0);
  const targets = useMemo(() => [new THREE.Object3D(), new THREE.Object3D()], []);
  const [spin] = useState(createSpin);

  const hull = useMemo(() => new THREE.LatheGeometry(HULL_PROFILE, 48), []);
  const mats = useMemo(
    () => ({
      hull: new THREE.MeshStandardMaterial({ color: "#c9d0d4", metalness: 0.15, roughness: 0.45 }),
      seam: new THREE.MeshStandardMaterial({ color: "#6f7a82", metalness: 0.3, roughness: 0.5 }),
      frame: new THREE.MeshStandardMaterial({ color: "#2b343c", metalness: 0.55, roughness: 0.4 }),
      metal: new THREE.MeshStandardMaterial({ color: "#8a949b", metalness: 0.7, roughness: 0.3 }),
      glass: new THREE.MeshStandardMaterial({
        color: "#9fe6ff",
        metalness: 0.1,
        roughness: 0.05,
        transparent: true,
        opacity: 0.32,
        depthWrite: false,
      }),
      cabin: new THREE.MeshStandardMaterial({ color: "#0c1418", roughness: 0.9 }),
      stripe: new THREE.MeshStandardMaterial({ color: ACCENT, roughness: 0.6, emissive: ACCENT, emissiveIntensity: 0.15 }),
    }),
    []
  );
  const addProp = (g: THREE.Group | null) => {
    if (g && !props.current.includes(g)) props.current.push(g);
  };

  // Move/up on window, not the group: the pointer leaves the hull mid-drag.
  useEffect(() => {
    const move = (e: PointerEvent) => spinMove(spin, e.clientX, e.clientY);
    const up = () => {
      if (!spin.dragging) return;
      spinEnd(spin);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [spin]);

  const atSeafloor = () => dive.get().chapter === "seafloor";

  // Mouse only: on touch the same gesture is the page scroll.
  const onDown = (e: ThreeEvent<PointerEvent>) => {
    if (e.pointerType !== "mouse" || !atSeafloor()) return;
    spinStart(spin, e.clientX, e.clientY);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
  };
  const onOver = () => {
    if (atSeafloor() && !spin.dragging) document.body.style.cursor = "grab";
  };
  const onOut = () => {
    if (!spin.dragging) document.body.style.cursor = "";
  };

  useFrame(({ clock, pointer: p }, dt) => {
    const g = group.current;
    if (!g) return;
    const s = dive.get();
    const pose = poseAt(s.progress, s.ranges);
    pointer.current.x += (p.x - pointer.current.x) * Math.min(1, dt * 3);
    pointer.current.y += (p.y - pointer.current.y) * Math.min(1, dt * 3);
    const t = clock.elapsedTime;
    spinStep(spin, dt, s.chapter === "seafloor");
    g.position.set(pose.x, pose.y + Math.sin(t * 0.8) * 0.08, 0);
    g.rotation.set(
      PITCH + pointer.current.y * -0.07 + spin.rx,
      YAW + pointer.current.x * 0.07 + spin.ry,
      pose.rotZ + Math.sin(t * 0.5) * 0.02
    );
    g.scale.setScalar(pose.scale);

    // Props idle at a slow churn and wind up with scroll speed.
    const velocity = Math.abs(s.progress - lastProgress.current) / Math.max(dt, 1e-3);
    lastProgress.current = s.progress;
    const rate = 2.5 + Math.min(velocity * 400, 30);
    props.current.forEach((prop) => (prop.rotation.x += rate * dt));

    const lampIntensity = pose.lamp * 30;
    if (lampA.current) lampA.current.intensity = lampIntensity;
    if (lampB.current) lampB.current.intensity = lampIntensity;
    const glowOpacity = Math.min(1, 0.15 + pose.lamp * 0.3);
    if (glowA.current) glowA.current.opacity = glowOpacity;
    if (glowB.current) glowB.current.opacity = glowOpacity;
    if (strobe.current) strobe.current.opacity = t % 1.6 < 0.12 ? 1 : 0.15;
  });

  return (
    <group ref={group} onPointerDown={onDown} onPointerOver={onOver} onPointerOut={onOut}>
      {/* hull, laid along +x */}
      <mesh geometry={hull} material={mats.hull} rotation={[0, 0, -Math.PI / 2]} />
      {[-0.6, 0.2].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.seam}>
          <torusGeometry args={[0.435, 0.012, 8, 48]} />
        </mesh>
      ))}
      {/* accent belt behind the dome */}
      <mesh position={[0.62, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.stripe}>
        <torusGeometry args={[0.415, 0.014, 8, 48]} />
      </mesh>

      {/* acrylic dome with a dark cabin behind it */}
      <mesh position={[1.02, 0.02, 0]} material={mats.cabin}>
        <sphereGeometry args={[0.2, 20, 16]} />
      </mesh>
      <mesh position={[1.02, 0.02, 0]} rotation={[0, 0, -Math.PI / 2]} material={mats.glass}>
        <sphereGeometry args={[0.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      <mesh position={[1.02, 0.02, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.metal}>
        <torusGeometry args={[0.3, 0.025, 10, 40]} />
      </mesh>

      {/* sail, hatch, strobe, antenna */}
      <RoundedBox args={[0.78, 0.3, 0.3]} radius={0.12} smoothness={4} position={[0.05, 0.5, 0]} material={mats.hull} />
      <mesh position={[0.2, 0.67, 0]} material={mats.metal}>
        <cylinderGeometry args={[0.09, 0.1, 0.05, 20]} />
      </mesh>
      <mesh position={[-0.25, 0.9, 0]} material={mats.frame}>
        <cylinderGeometry args={[0.008, 0.008, 0.5, 6]} />
      </mesh>
      <mesh position={[-0.25, 1.16, 0]}>
        <sphereGeometry args={[0.025, 10, 10]} />
        <meshBasicMaterial ref={strobe} color={ACCENT} transparent toneMapped={false} />
      </mesh>

      {/* cruciform tail */}
      {[0, Math.PI / 2].map((r) => (
        <mesh key={r} position={[-1.0, 0, 0]} rotation={[r, 0, 0]} material={mats.frame}>
          <boxGeometry args={[0.32, 0.9, 0.025]} />
        </mesh>
      ))}

      {/* shrouded stern thruster */}
      <mesh position={[-1.3, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.frame}>
        <torusGeometry args={[0.24, 0.045, 12, 36]} />
      </mesh>
      <group position={[-1.3, 0, 0]} ref={addProp}>
        <Propeller radius={0.4} mat={mats.metal} />
      </group>

      {/* side thruster pods on struts */}
      {POD_Z.map((z) => (
        <group key={z} position={[-0.35, -0.08, z]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={mats.frame}>
            <cylinderGeometry args={[0.1, 0.1, 0.36, 20]} />
          </mesh>
          <mesh position={[0, 0, -Math.sign(z) * 0.12]} rotation={[Math.PI / 2, 0, 0]} material={mats.frame}>
            <boxGeometry args={[0.08, 0.2, 0.03]} />
          </mesh>
          <group position={[-0.05, 0, 0]} ref={addProp}>
            <Propeller radius={0.18} mat={mats.metal} />
          </group>
        </group>
      ))}

      {/* skids and struts */}
      {SKID_Z.map((z) => (
        <group key={z}>
          <mesh position={[0, -0.62, z]} rotation={[0, 0, Math.PI / 2]} material={mats.frame}>
            <capsuleGeometry args={[0.03, 1.7, 6, 12]} />
          </mesh>
          {[-0.6, 0, 0.6].map((x) => (
            <mesh key={x} position={[x, -0.5, z * 0.8]} rotation={[z > 0 ? -0.35 : 0.35, 0, 0]} material={mats.frame}>
              <cylinderGeometry args={[0.018, 0.018, 0.26, 6]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* lamp bar under the nose */}
      <mesh position={[0.82, -0.36, 0]} material={mats.frame}>
        <boxGeometry args={[0.1, 0.06, 0.56]} />
      </mesh>
      {LAMP_Z.map((z, i) => (
        <group key={z} position={[0.9, -0.36, z]}>
          <mesh>
            <sphereGeometry args={[0.055, 12, 12]} />
            {/* Unlit so tonemapping never dulls the accent. */}
            <meshBasicMaterial ref={i === 0 ? glowA : glowB} color={ACCENT} transparent toneMapped={false} />
          </mesh>
          <primitive object={targets[i]} position={[4, -2, 0]} />
          <spotLight
            ref={i === 0 ? lampA : lampB}
            color={ACCENT}
            angle={0.5}
            penumbra={0.6}
            distance={9}
            decay={1}
            target={targets[i]}
          />
        </group>
      ))}

      {/* manipulator arm, folded forward under the dome */}
      <group position={[0.62, -0.42, 0.18]} rotation={[0, 0, -0.5]}>
        <mesh position={[0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.metal}>
          <cylinderGeometry args={[0.025, 0.03, 0.36, 10]} />
        </mesh>
        <group position={[0.36, 0, 0]} rotation={[0, 0, 0.9]}>
          <mesh position={[0.13, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.metal}>
            <cylinderGeometry args={[0.02, 0.025, 0.26, 10]} />
          </mesh>
          {[0.25, -0.25].map((a) => (
            <mesh key={a} position={[0.29, a * 0.12, 0]} rotation={[0, 0, a]} material={mats.frame}>
              <boxGeometry args={[0.09, 0.015, 0.02]} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};
