"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";

import { Submersible } from "@/components/three/dive/Submersible";
import type { Pose } from "@/constants/dive";

/** Lamps half up, sized so a full turn never reaches the canvas edge. */
const POSE: Pose = { x: 0, y: -0.05, w: 0.8, h: 0.8, rotZ: 0, lamp: 1.4 };

const canRender = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
};

export const SubEscortImpl = () => {
  // Lazy init: client-only (dynamic ssr:false), so reading capabilities once is safe.
  const [ok] = useState(canRender);
  if (!ok) return null;

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 6, 4]} intensity={3} />
      <Submersible pose={POSE} turntable />
    </Canvas>
  );
};
