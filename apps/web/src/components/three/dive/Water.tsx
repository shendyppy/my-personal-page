"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { dive } from "@/lib/dive/depth";
import { waterAt } from "@/lib/dive/water";

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.9999, 1.0); }
`;
const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform vec3 uTop; uniform vec3 uBottom; uniform float uTime;
  void main() {
    float band = sin((vUv.y * 9.0) + uTime * 0.25) * 0.012;
    vec3 c = mix(uBottom, uTop, smoothstep(0.0, 1.0, vUv.y + band));
    gl_FragColor = vec4(c, 1.0);
  }
`;

/** Full-screen gradient behind everything + scene fog, both driven by depth. */
export const Water = () => {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const fog = useRef<THREE.FogExp2>(null);
  // Stable identity for the initial `uniforms` prop below. Never mutated
  // directly by reference — per-frame updates go through `mat.current.uniforms`
  // instead (a ref access, like the rest of this file's imperative writes),
  // so this component never reads a ref's `.current` during render.
  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color("#0e4a6e") },
      uBottom: { value: new THREE.Color("#083352") },
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((_, dt) => {
    const m = mat.current;
    if (!m) return;
    const w = waterAt(dive.get().progress);
    const u = m.uniforms;
    u.uTop.value.setRGB(...w.top);
    u.uBottom.value.setRGB(...w.bottom);
    u.uTime.value += dt;
    if (fog.current) {
      fog.current.color.setRGB(...w.bottom);
      fog.current.density = w.fog;
    }
  });

  return (
    <>
      {/* Declarative `attach="fog"` handles scene.fog wiring + cleanup. */}
      <fogExp2 ref={fog} attach="fog" args={["#083352", 0.02]} />
      <mesh frustumCulled={false} renderOrder={-1}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          ref={mat}
          vertexShader={vert}
          fragmentShader={frag}
          uniforms={uniforms}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>
    </>
  );
};
