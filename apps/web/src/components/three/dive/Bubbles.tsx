"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { subTelemetry } from "@/components/three/dive/Submersible";
import { dive } from "@/lib/dive/depth";
import { waterlineAt } from "@/lib/dive/water";

const LIFE = 2.2;
/** Bubbles per second at full thrust, and per splash when the sub breaks the surface. */
const RATE = 70;
const SPLASH = 60;

const vert = /* glsl */ `
  attribute float aAge;
  attribute float aSize;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float life = clamp(aAge / ${LIFE.toFixed(1)}, 0.0, 1.0);
    vAlpha = aAge < 0.0 ? 0.0 : (1.0 - life) * smoothstep(0.0, 0.08, life);
    gl_PointSize = aSize * (1.0 + life * 1.5) * (300.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const frag = /* glsl */ `
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float ring = smoothstep(0.5, 0.38, d) * (0.35 + 0.65 * smoothstep(0.2, 0.45, d));
    if (ring * vAlpha < 0.01) discard;
    gl_FragColor = vec4(0.82, 0.94, 1.0, ring * vAlpha * 0.8);
  }
`;

/**
 * The sub's wake: bubbles stream from the stern thruster in proportion to its
 * speed, rise with a wobble and fade, and a burst of them boils up when the
 * sub drops through the sea surface at the start of the dive.
 */
export const Bubbles = ({ count = 220 }: { count?: number }) => {
  const points = useRef<THREE.Points>(null);
  const cursor = useRef(0);
  const debt = useRef(0);
  const lastLine = useRef<number | null>(null);

  // Built once per count and only ever written through the points ref in
  // the frame loop, never during render.
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("aAge", new THREE.BufferAttribute(new Float32Array(count).fill(-1), 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(new Float32Array(count), 1));
    g.setAttribute("aVel", new THREE.BufferAttribute(new Float32Array(count * 2), 2));
    return g;
  }, [count]);

  useFrame(({ clock }, dt) => {
    const pts = points.current;
    if (!pts) return;
    const attrs = pts.geometry.attributes;
    const pos = attrs.position.array as Float32Array;
    const age = attrs.aAge.array as Float32Array;
    const size = attrs.aSize.array as Float32Array;
    const velocity = attrs.aVel.array as Float32Array;
    const t = clock.elapsedTime;
    const s = subTelemetry;

    // Seeded by the clock and slot, so no Math.random in the frame loop.
    const jitter = (i: number, k: number) => Math.sin(i * 12.9898 + k * 78.233 + t * 43.0) * 0.5;
    const emit = (spread: number, lift: number) => {
      const i = cursor.current;
      cursor.current = (i + 1) % count;
      pos[i * 3] = s.stern.x + jitter(i, 1) * spread * s.scale;
      pos[i * 3 + 1] = s.stern.y + jitter(i, 2) * spread * s.scale;
      pos[i * 3 + 2] = s.stern.z + jitter(i, 3) * 0.2;
      velocity[i * 2] = jitter(i, 4) * 0.6;
      velocity[i * 2 + 1] = lift + jitter(i, 5) * 0.4;
      size[i] = (0.05 + (jitter(i, 6) + 0.5) * 0.07) * Math.max(0.4, s.scale);
      age[i] = 0;
    };

    const d = dive.get();
    const line = waterlineAt(d.progress, d.ranges);
    const under = s.screenY < line;
    if (under) {
      debt.current += Math.min(s.speed, 6) / 6 * RATE * dt + 3 * dt;
      while (debt.current >= 1) {
        emit(0.15, 0.6);
        debt.current -= 1;
      }
    }
    // The surface swept past the sub this frame: it has just gone under.
    if (lastLine.current !== null && lastLine.current <= s.screenY && line > s.screenY) {
      for (let k = 0; k < SPLASH; k += 1) emit(1.1, 1.2);
    }
    lastLine.current = line;

    for (let i = 0; i < count; i += 1) {
      if (age[i] < 0) continue;
      age[i] += dt;
      if (age[i] > LIFE) {
        age[i] = -1;
        continue;
      }
      pos[i * 3] += (velocity[i * 2] + Math.sin(t * 3 + i) * 0.25) * dt;
      pos[i * 3 + 1] += velocity[i * 2 + 1] * dt;
      velocity[i * 2 + 1] += 0.4 * dt;
    }
    attrs.position.needsUpdate = true;
    attrs.aAge.needsUpdate = true;
    attrs.aSize.needsUpdate = true;
  });

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <shaderMaterial vertexShader={vert} fragmentShader={frag} transparent depthWrite={false} />
    </points>
  );
};
