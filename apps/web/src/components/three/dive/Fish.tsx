"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { dive } from "@/lib/dive/depth";
import { presence, wrap, type Mark } from "@/lib/dive/fish";
import { scatter } from "@/lib/dive/scatter";
import { waterlineAt } from "@/lib/dive/water";

type Body = "fish" | "hatchet" | "angler" | "jelly";

type Species = {
  body: Body;
  from: Mark;
  to: Mark;
  schools: number;
  perSchool: number;
  /** Body length scale, world units. */
  size: number;
  /** Cruise speed (world units/s) and tail beat or bell pulse (rad/s). */
  speed: number;
  wag: number;
  /** Box each school's members scatter through: how tight the school swims. */
  spread: [number, number, number];
  /** World-z band the schools spread across, always behind the sub's plane. */
  z: [number, number];
  /** Shifts the schools' band up (+) or down (-), in view heights. */
  lift?: number;
  colors: string[];
  /** Peak opacity: the schools pass behind body copy, so they stay a backdrop. */
  opacity: number;
  material: THREE.MeshStandardMaterialParameters;
};

const TROPICAL = ["#ff8a5c", "#ffd166", "#5ad1e6", "#d7ff3e", "#ffb347"];

/*
 * Who lives where, following the real water column the HUD now reads:
 * reef fish in the sunlit shallows (0–50 m); silver hatchetfish and
 * lanternfish, both lit along the belly, in the twilight zone (200–1000 m);
 * glowing jellies and the odd anglerfish in the midnight zone below.
 */
const SPECIES: Species[] = [
  {
    // Under the hero's waterline before the dive starts; clipped to the water.
    body: "fish",
    from: { chapter: "surface", t: 0 },
    to: { chapter: "surface", t: 0.8 },
    schools: 2,
    perSchool: 8,
    size: 0.2,
    speed: 0.6,
    wag: 10,
    spread: [2.2, 0.6, 1],
    z: [-3, -5],
    lift: 0.3,
    colors: TROPICAL,
    opacity: 0.75,
    material: { roughness: 0.55, metalness: 0.05 },
  },
  {
    body: "fish",
    from: { chapter: "surface", t: 0.6 },
    to: { chapter: "twilight", t: 0.12 },
    schools: 3,
    perSchool: 12,
    size: 0.26,
    speed: 0.7,
    wag: 9,
    spread: [2.6, 1.1, 1.2],
    z: [-3, -6],
    colors: TROPICAL,
    opacity: 0.7,
    material: { roughness: 0.55, metalness: 0.05 },
  },
  {
    body: "hatchet",
    from: { chapter: "twilight", t: 0.15 },
    to: { chapter: "descent", t: 0.15 },
    schools: 2,
    perSchool: 14,
    size: 0.2,
    speed: 0.5,
    wag: 10,
    spread: [3, 1.4, 1.5],
    z: [-3.5, -6],
    colors: ["#dfe9ef", "#c3d3dc", "#eef4f7"],
    opacity: 0.6,
    material: { roughness: 0.25, metalness: 0.05, emissive: "#6fd0ff", emissiveIntensity: 0.6 },
  },
  {
    body: "fish",
    from: { chapter: "twilight", t: 0.3 },
    to: { chapter: "descent", t: 0.4 },
    schools: 3,
    perSchool: 6,
    size: 0.16,
    speed: 0.8,
    wag: 13,
    spread: [2.4, 1, 1],
    z: [-2.5, -4.5],
    colors: ["#1c2a33", "#26343c"],
    opacity: 0.75,
    // Fog would bury the photophores in the near-black water; the dark body
    // already reads as distance.
    material: { roughness: 0.8, emissive: "#7cf5d2", emissiveIntensity: 1, fog: false },
  },
  {
    body: "jelly",
    from: { chapter: "descent", t: 0.1 },
    to: { chapter: "seafloor", t: 0.7 },
    schools: 3,
    perSchool: 2,
    size: 0.5,
    speed: 0.08,
    wag: 2.2,
    spread: [4, 2.5, 1.5],
    z: [-2.5, -5],
    colors: ["#1a2440"],
    opacity: 0.45,
    material: {
      roughness: 1,
      emissive: "#8fb4ff",
      emissiveIntensity: 1.1,
      fog: false,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    },
  },
  {
    body: "angler",
    from: { chapter: "descent", t: 0.45 },
    to: { chapter: "seafloor", t: 1 },
    schools: 2,
    perSchool: 1,
    size: 0.55,
    speed: 0.18,
    wag: 4,
    spread: [0.1, 0.1, 0.1],
    z: [-2, -3.5],
    colors: ["#1b2328"],
    opacity: 0.9,
    material: { roughness: 0.9, emissive: "#d7ff3e", emissiveIntensity: 1.5, fog: false },
  },
];

type Vertex = (x: number, y: number, z: number) => number;
type Sway = (x: number, y: number, z: number) => [number, number, number];

/**
 * Bakes the per-vertex animation inputs the shared shader reads: aGlow (how
 * much of the emissive shows), aBend (direction and reach of the swim or sway
 * wave) and aPulse (radial breathing, for a jelly's bell).
 */
const tag = (g: THREE.BufferGeometry, glow: Vertex, bend: Sway, pulse: Vertex = () => 0) => {
  const pos = g.attributes.position;
  const aGlow = new Float32Array(pos.count);
  const aBend = new Float32Array(pos.count * 3);
  const aPulse = new Float32Array(pos.count);
  for (let i = 0; i < pos.count; i++) {
    const [x, y, z] = [pos.getX(i), pos.getY(i), pos.getZ(i)];
    aGlow[i] = glow(x, y, z);
    aBend.set(bend(x, y, z), i * 3);
    aPulse[i] = pulse(x, y, z);
  }
  g.setAttribute("aGlow", new THREE.BufferAttribute(aGlow, 1));
  g.setAttribute("aBend", new THREE.BufferAttribute(aBend, 3));
  g.setAttribute("aPulse", new THREE.BufferAttribute(aPulse, 1));
  return g;
};

const merge = (parts: THREE.BufferGeometry[]) => {
  const g = mergeGeometries(parts)!;
  parts.forEach((p) => p.dispose());
  return g;
};

const v2 = (x: number, y: number) => new THREE.Vector2(x, y);
const smooth = THREE.MathUtils.smoothstep;
/** Tail fins sway most; the head holds its line. */
const tailSway: Sway = (x) => [0, 0, 0.14 * (1 - smooth(x, -0.72, 0.2))];

/** Nose +x. `depth` is the body's half-height: slim for reef and lantern fish, a deep keel for a hatchetfish. */
const makeFish = (depth: number) => {
  const body = new THREE.SphereGeometry(1, 18, 12);
  const pos = body.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) * 0.5;
    // Narrows toward the tail so it reads as a fish, not an egg.
    const taper = x < 0 ? 1 + (x / 0.5) * 0.6 : 1;
    pos.setXYZ(i, x, pos.getY(i) * depth * taper, pos.getZ(i) * 0.1 * taper);
  }
  body.computeVertexNormals();
  // Photophores: a lit line along the belly.
  tag(body, (x, y) => (y < -depth * 0.55 && x > -0.4 ? 1 : 0), tailSway);
  const tail = new THREE.ShapeGeometry(
    new THREE.Shape([v2(-0.38, 0.03), v2(-0.74, 0.24), v2(-0.62, 0), v2(-0.74, -0.24), v2(-0.38, -0.03)])
  );
  const dorsal = new THREE.ShapeGeometry(
    new THREE.Shape([v2(-0.18, depth * 0.72), v2(0.14, depth * 0.84), v2(-0.26, depth + 0.12)])
  );
  return merge([body, tag(tail, () => 0, tailSway), tag(dorsal, () => 0, tailSway)]);
};

/** A round-bodied anglerfish, nose +x, with a lit lure on a stalk arching over its mouth. */
const makeAngler = () => {
  const body = new THREE.SphereGeometry(1, 18, 12);
  const pos = body.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) * 0.42;
    const taper = x < 0 ? 1 + (x / 0.42) * 0.45 : 1;
    pos.setXYZ(i, x, pos.getY(i) * 0.34 * taper, pos.getZ(i) * 0.28 * taper);
  }
  body.computeVertexNormals();
  const tail = new THREE.ShapeGeometry(new THREE.Shape([v2(-0.32, 0.04), v2(-0.62, 0.2), v2(-0.62, -0.2), v2(-0.32, -0.04)]));
  const stalkPath = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0.18, 0.3, 0),
    new THREE.Vector3(0.45, 0.72, 0),
    new THREE.Vector3(0.66, 0.46, 0)
  );
  const stalk = new THREE.TubeGeometry(stalkPath, 12, 0.014, 5);
  const lure = new THREE.SphereGeometry(0.09, 12, 8).translate(0.66, 0.42, 0);
  const still: Sway = () => [0, 0, 0];
  return merge([
    tag(body, () => 0, tailSway),
    tag(tail, () => 0, tailSway),
    tag(stalk, () => 0, still),
    // Above 1 so the bulb burns brighter than any belly photophore.
    tag(lure, () => 3, still),
  ]);
};

/** A jelly: a pulsing bell with trailing tentacles that sway more toward their tips. */
const makeJelly = () => {
  const bell = new THREE.SphereGeometry(0.35, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 0.8, 1);
  const parts = [tag(bell, () => 0.6, () => [0, 0, 0], (_, y) => 0.12 * (1 - y / 0.28))];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const tentacle = new THREE.PlaneGeometry(0.015, 0.9, 1, 8).translate(Math.cos(a) * 0.26, -0.45, Math.sin(a) * 0.26);
    parts.push(tag(tentacle, () => 0.8, (_, y) => [0.12 * (-y / 0.9), 0, 0.08 * (-y / 0.9)]));
  }
  return merge(parts);
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ORIGIN = new THREE.Vector3();
const buffer = new THREE.Vector2();
const m4 = new THREE.Matrix4();
const at = new THREE.Vector3();
const turn = new THREE.Quaternion();
const euler = new THREE.Euler();
const scale = new THREE.Vector3();

const Shoal = ({ species: sp, geometry, seed, lite }: {
  species: Species;
  geometry: THREE.BufferGeometry;
  seed: number;
  lite: boolean;
}) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const perSchool = lite ? Math.ceil(sp.perSchool / 2) : sp.perSchool;
  const count = perSchool * sp.schools;
  const offsets = useMemo(() => scatter(count, sp.spread, [0, 0, 0], seed), [count, sp, seed]);

  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, transparent: true, ...sp.material });
    // The motion lives in the vertex shader, phased per instance so a school
    // never beats in sync: a wave runs nose to tail (or down the tentacles),
    // and a jelly's bell breathes. Fragments above the sea surface are dropped,
    // so fish under the hero's waterline never show against the sky.
    m.userData.uniforms = { uTime: { value: 0 }, uWag: { value: sp.wag }, uLine: { value: 2 }, uResY: { value: 1 } };
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, m.userData.uniforms);
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
          uniform float uTime; uniform float uWag;
          attribute float aGlow; attribute vec3 aBend; attribute float aPulse;
          varying float vGlow;`
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
          float phase = uTime * uWag + float(gl_InstanceID) * 1.7;
          transformed.xz *= 1.0 + aPulse * sin(phase);
          transformed += aBend * sin(phase + position.x * 4.0 + position.y * 3.0);
          vGlow = aGlow;`
        );
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", "#include <common>\nuniform float uLine; uniform float uResY;\nvarying float vGlow;")
        .replace("void main() {", "void main() {\nif (gl_FragCoord.y > uLine * uResY) discard;")
        .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\ntotalEmissiveRadiance *= vGlow;");
    };
    return m;
  }, [sp]);

  useLayoutEffect(() => {
    const m = mesh.current!;
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) m.setColorAt(i, c.set(sp.colors[i % sp.colors.length]));
    m.instanceColor!.needsUpdate = true;
  }, [count, sp]);

  useFrame(({ camera, viewport, clock, gl }) => {
    const m = mesh.current;
    if (!m) return;
    const s = dive.get();
    const { weight, u } = presence(s.progress, s.ranges, sp.from, sp.to);
    m.visible = weight > 0.001;
    if (!m.visible) return;
    const t = clock.elapsedTime;
    const mat = m.material as THREE.MeshStandardMaterial;
    const uniforms = mat.userData.uniforms;
    mat.opacity = weight * sp.opacity;
    uniforms.uTime.value = t;
    uniforms.uLine.value = waterlineAt(s.progress, s.ranges);
    uniforms.uResY.value = gl.getDrawingBufferSize(buffer).y;

    for (let k = 0; k < sp.schools; k++) {
      const z = lerp(sp.z[0], sp.z[1], sp.schools > 1 ? k / (sp.schools - 1) : 0);
      const view = viewport.getCurrentViewport(camera, ORIGIN.set(0, 0, z));
      // Wide enough that the whole school is off screen before it wraps round.
      const span = view.width + sp.spread[0] * 2 + 1;
      const dir = k % 2 === 0 ? 1 : -1;
      const cx = wrap(k * span * 0.37 + dir * sp.speed * t, span);
      // Schools stack in bands and drift up as the dive sinks past them.
      const cy =
        ((k + 0.5) / sp.schools - 0.5 + (sp.lift ?? 0)) * view.height * 0.6 +
        Math.sin(t * 0.25 + k * 2) * 0.3 +
        (u - 0.5) * view.height * 0.8;

      for (let i = 0; i < perSchool; i++) {
        const j = k * perSchool + i;
        const bob = Math.sin(t * 0.9 + j * 1.3);
        at.set(
          cx + offsets[j * 3] + Math.sin(t * 0.5 + j) * 0.2,
          cy + offsets[j * 3 + 1] + bob * 0.08,
          z + offsets[j * 3 + 2]
        );
        euler.set(0, (dir > 0 ? 0 : Math.PI) + Math.sin(t * 1.1 + j) * 0.12, Math.cos(t * 0.9 + j * 1.3) * 0.12 * dir);
        turn.setFromEuler(euler);
        scale.setScalar(sp.size * (0.85 + 0.3 * ((j * 0.618) % 1)));
        m.setMatrixAt(j, m4.compose(at, turn, scale));
      }
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[geometry, material, count]} frustumCulled={false} visible={false} />;
};

/** Sea life that changes with depth, instanced per species. Pure background: it swims behind the sub. */
export const Fish = ({ lite = false }: { lite?: boolean }) => {
  const bodies = useMemo(
    () => ({ fish: makeFish(0.24), hatchet: makeFish(0.42), angler: makeAngler(), jelly: makeJelly() }),
    []
  );
  return SPECIES.map((sp, i) => (
    <Shoal key={i} species={sp} geometry={bodies[sp.body]} seed={i + 21} lite={lite} />
  ));
};
