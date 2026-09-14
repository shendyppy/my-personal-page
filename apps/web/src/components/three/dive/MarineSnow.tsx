"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { dive } from "@/lib/dive/depth";
import { scatter } from "@/lib/dive/scatter";

const BOX = { x: 14, y: 10, z: 8 };

const vert = /* glsl */ `
  uniform float uRise;
  uniform float uSize;
  void main() {
    vec3 p = position;
    // Wrap the rise inside the box, so the field loops without CPU work.
    p.y = mod(p.y + uRise + ${(BOX.y / 2).toFixed(1)}, ${BOX.y.toFixed(1)}) - ${(BOX.y / 2).toFixed(1)};
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (300.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const frag = /* glsl */ `
  uniform float uOpacity;
  void main() {
    if (length(gl_PointCoord - 0.5) > 0.5) discard;
    gl_FragColor = vec4(0.875, 0.914, 0.949, uOpacity);
  }
`;

/**
 * Drifting particulate that streams upward faster while scrolling — we are
 * the ones sinking. The motion lives in the vertex shader: the CPU only
 * advances one uniform per frame instead of rewriting 1400 positions and
 * re-uploading them.
 */
export const MarineSnow = ({ count = 1400 }: { count?: number }) => {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const last = useRef(0);
  const positions = useMemo(() => scatter(count, [BOX.x, BOX.y, BOX.z], [0, 0, -2], 1), [count]);
  const uniforms = useMemo(() => ({ uRise: { value: 0 }, uSize: { value: 0.025 }, uOpacity: { value: 0.4 } }), []);

  useFrame((_, dt) => {
    const m = mat.current;
    if (!m) return;
    const p = dive.get().progress;
    // Progress per second, not per frame, so the stream speed ignores fps.
    const velocity = Math.abs(p - last.current) / Math.max(dt, 1e-3);
    last.current = p;
    m.uniforms.uRise.value += (0.12 + Math.min(velocity * 36, 4)) * dt;
    m.uniforms.uOpacity.value = 0.35 + p * 0.35;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} transparent depthWrite={false} />
    </points>
  );
};
