"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";

import { Bioluminescence } from "@/components/three/dive/Bioluminescence";
import { MarineSnow } from "@/components/three/dive/MarineSnow";
import { Seafloor } from "@/components/three/dive/Seafloor";
import { Submersible } from "@/components/three/dive/Submersible";
import { Sunrays } from "@/components/three/dive/Sunrays";
import { Water } from "@/components/three/dive/Water";

const canRender = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
};

export const DiveSceneImpl = () => {
  // Lazy init, not an effect: this component only ever mounts client-side
  // (its parent dynamic-imports it with ssr:false), so reading window/canvas
  // capability once on first render is safe and avoids a redundant re-render.
  const [ok] = useState(canRender);
  // Touch devices get half the particles and a 1x canvas.
  const [lite] = useState(() => window.matchMedia("(pointer: coarse)").matches);
  if (!ok) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      {/* The chapter stages cover the canvas edge to edge, so it never sees a
          pointer event of its own (which also left the sub's parallax dead).
          Listening on <body> lets R3F raycast every pointer: the sub's hull is
          the drag hit area, and whatever sits on top still gets its clicks. */}
      <Canvas
        eventSource={document.body}
        eventPrefix="client"
        dpr={lite ? 1 : [1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 40 }}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
      >
        <Water />
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 6, 4]} intensity={3} />
        <Sunrays count={lite ? 3 : 5} />
        <MarineSnow count={lite ? 500 : 1400} />
        <Bioluminescence count={lite ? 40 : 80} />
        <Seafloor />
        <Submersible />
      </Canvas>
    </div>
  );
};
