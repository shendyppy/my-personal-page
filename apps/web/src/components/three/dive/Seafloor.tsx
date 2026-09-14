"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { dive } from "@/lib/dive/depth";
import { lanes } from "@/lib/dive/lanes";
import { poseAt } from "@/lib/dive/pose";
import { scatter } from "@/lib/dive/scatter";

const PUFF = 80;
const ORIGIN = new THREE.Vector3();
/** Touch-down progress, and how far back up the dive must climb to re-arm the puff. */
const LAND_AT = 0.985;
const REARM_BELOW = 0.94;

/**
 * Undulating floor that rises into view for the landing, plus a one-shot silt
 * puff under the sub when it touches down. The puff spawns under the sub's
 * seafloor lane, since the sub's position now follows the layout; nudging the
 * scroll near the bottom never replays it.
 */
export const Seafloor = () => {
  const mesh = useRef<THREE.Mesh>(null);
  const puff = useRef<THREE.Points>(null);
  const landed = useRef(false);
  const puffT = useRef(0);

  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(24, 12, 48, 24);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 0.7) * 0.18 + Math.cos(y * 1.1 + x * 0.3) * 0.12);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  const puffSeed = useMemo(() => scatter(PUFF, [1.6, 0.2, 1.2], [0, 0.1, 0], 3), []);
  const puffPositions = useMemo(() => puffSeed.slice(), [puffSeed]);

  useFrame(({ camera, viewport }, dt) => {
    const s = dive.get();
    const p = s.progress;
    const vis = Math.min(1, Math.max(0, (p - 0.9) / 0.06));
    if (mesh.current) {
      mesh.current.visible = vis > 0.01;
      // Rises only far enough to show a horizon in the bottom third, under the band.
      mesh.current.position.y = -3.4 + vis * 0.7;
    }

    const pf = puff.current;
    if (!pf) return;
    if (p > LAND_AT && !landed.current) {
      landed.current = true;
      puffT.current = 0;
      // Lane centre minus half its height: roughly where the skids meet the floor.
      const view = viewport.getCurrentViewport(camera, ORIGIN);
      const pose = poseAt(1, s.ranges, lanes);
      pf.position.set((pose.x * view.width) / 2, ((pose.y - pose.h / 2) * view.height) / 2, 0);
      (pf.geometry.attributes.position.array as Float32Array).set(puffSeed);
    }
    if (p < REARM_BELOW) landed.current = false;

    puffT.current += dt;
    const t = puffT.current;
    pf.visible = landed.current && t < 2.5;
    if (!pf.visible) return;
    const attr = pf.geometry.attributes.position;
    const arr = attr.array as Float32Array;
    for (let i = 1; i < arr.length; i += 3) arr[i] += dt * 0.25;
    attr.needsUpdate = true;
    (pf.material as THREE.PointsMaterial).opacity = Math.max(0, 0.5 - t * 0.2);
  });

  return (
    <>
      <mesh ref={mesh} geometry={geo} rotation={[-Math.PI / 2.4, 0, 0]} position={[0, -3.4, -1]} visible={false}>
        <meshStandardMaterial color="#0b1a22" roughness={1} metalness={0} />
      </mesh>
      <points ref={puff} visible={false} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[puffPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#8fa3ad" size={0.05} transparent opacity={0.5} depthWrite={false} />
      </points>
    </>
  );
};
