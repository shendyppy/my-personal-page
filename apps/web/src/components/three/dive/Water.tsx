"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { dive } from "@/lib/dive/depth";
import { SURFACE_LINE, waterAt, waterlineAt } from "@/lib/dive/water";

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.9999, 1.0); }
`;

/*
 * Underwater: the depth gradient. Above uLine (the sea surface, in screen
 * height): a dusk sky with a low sun, a coast of hills and palms at the right
 * edge, a strip of sand, and foam where they meet the water. Just under the
 * line, a lit band with caustics and the sun's glitter. The dive is uLine
 * climbing off the top of the screen.
 */
const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform vec3 uTop; uniform vec3 uBottom; uniform float uTime; uniform float uLine; uniform float uAspect;


  float hash(float n) { return fract(sin(n) * 43758.5453); }
  float noise(float x) { float i = floor(x); float f = fract(x); return mix(hash(i), hash(i + 1.0), f * f * (3.0 - 2.0 * f)); }

  // Palm silhouette, p measured from the base in palm heights: a trunk
  // leaning left and six fronds that arc out and droop under their weight.
  float palm(vec2 p) {
    float lean = -p.y * p.y * 0.25;
    float trunk = step(abs(p.x - lean), 0.024 * (1.0 - 0.4 * p.y)) * step(0.0, p.y) * step(p.y, 1.0);
    vec2 c = p - vec2(-0.25, 1.0);
    float fronds = 0.0;
    for (int i = 0; i < 6; i++) {
      float a = 0.15 + float(i) * 0.57;
      vec2 d = normalize(vec2(cos(a), sin(a) * 0.55 + 0.15));
      float along = clamp(dot(c, d), 0.0, 0.62);
      vec2 spine = d * along - vec2(0.0, 1.1 * along * along);
      float w = 0.055 * (1.0 - along / 0.62);
      fronds = max(fronds, step(length(c - spine), w) * step(0.01, along));
    }
    return max(trunk, fronds);
  }

  void main() {
    vec2 uv = vUv;
    float x = uv.x * uAspect;
    float wave = sin(x * 18.0 + uTime * 1.2) * 0.003 + sin(x * 7.0 - uTime * 0.7) * 0.005;
    float line = uLine + wave;
    // Portrait screens put body copy right where a centred sun would glare, so
    // the sun moves out over the coast and dims.
    float wide = smoothstep(0.8, 1.4, uAspect);
    vec2 SUN = vec2(mix(0.78, 0.6, wide), 0.05);

    if (uv.y < line) {
      float band = sin(uv.y * 9.0 + uTime * 0.25) * 0.012;
      vec3 water = mix(uBottom, uTop, smoothstep(0.0, 1.0, uv.y + band));
      float depth = line - uv.y;
      float lit = exp(-depth * 9.0);
      float caustic = pow(abs(sin(x * 40.0 + sin(uv.y * 30.0 + uTime) * 2.0 + uTime * 0.8)), 12.0);
      water += vec3(0.10, 0.22, 0.28) * lit + caustic * lit * 0.035;
      float glitterPath = pow(max(0.0, 1.0 - abs(uv.x - SUN.x) * 5.0), 3.0) * exp(-depth * 22.0);
      // Broken up by noise so the glitter never reads as a regular dot grid.
      float sparkle = step(0.75, sin(x * 140.0 + uTime * 3.0) * sin(uv.y * 260.0 - uTime * 2.0)) * step(0.55, noise(x * 30.0 + uTime * 2.0));
      water += vec3(1.0, 0.8, 0.6) * glitterPath * sparkle * 0.15;
      gl_FragColor = vec4(water, 1.0);
      return;
    }

    float h = uv.y - line;
    vec3 sky = mix(vec3(0.25, 0.40, 0.47), vec3(0.035, 0.10, 0.17), smoothstep(0.0, 0.55, h));
    vec2 sp = vec2((uv.x - SUN.x) * uAspect, h - SUN.y);
    float r2 = dot(sp, sp);
    sky += vec3(0.85, 0.50, 0.32) * exp(-r2 * 18.0) * mix(0.25, 0.55, wide);
    sky += vec3(1.0, 0.86, 0.66) * exp(-r2 * 900.0) * mix(0.5, 0.9, wide);

    // The coast holds the right edge, clear of the hero headline on the left.
    float reach = smoothstep(0.74, 0.92, uv.x);
    float hills = (0.02 + 0.035 * noise(x * 2.2) + 0.015 * noise(x * 6.0)) * reach;
    float beach = 0.01 * reach;
    vec3 col = sky;
    vec3 land = vec3(0.03, 0.07, 0.09);
    if (h < hills) col = mix(land, vec3(0.05, 0.10, 0.12), h / max(hills, 1e-3));
    if (h < beach) col = mix(vec3(0.42, 0.36, 0.29), vec3(0.30, 0.27, 0.24), h / max(beach, 1e-4));

    // Three palms on the strand, sized in screen height.
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float base = 0.86 + fi * 0.045 + hash(fi + 3.0) * 0.015;
      float size = 0.07 + hash(fi + 7.0) * 0.03;
      vec2 p = vec2((uv.x - base) * uAspect, h - beach * 0.6) / size;
      col = mix(col, land, palm(p) * reach);
    }

    float foam = smoothstep(0.006, 0.0, h) * 0.6;
    col = mix(col, vec3(0.85, 0.93, 0.95), foam);
    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Full-screen background: shore and sky at the top of the dive, then the depth gradient + scene fog. */
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
      uLine: { value: SURFACE_LINE },
      uAspect: { value: 1 },
    }),
    []
  );

  useFrame(({ size }, dt) => {
    const m = mat.current;
    if (!m) return;
    const s = dive.get();
    const w = waterAt(s.progress);
    const u = m.uniforms;
    u.uTop.value.setRGB(...w.top);
    u.uBottom.value.setRGB(...w.bottom);
    u.uTime.value += dt;
    u.uLine.value = waterlineAt(s.progress, s.ranges);
    u.uAspect.value = size.width / Math.max(1, size.height);
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
