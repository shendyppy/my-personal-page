"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

import { Bioluminescence } from "@/components/three/dive/Bioluminescence";
import { Bubbles } from "@/components/three/dive/Bubbles";
import { Fish } from "@/components/three/dive/Fish";
import { MarineSnow } from "@/components/three/dive/MarineSnow";
import { Seafloor } from "@/components/three/dive/Seafloor";
import { Submersible } from "@/components/three/dive/Submersible";
import { Sunrays } from "@/components/three/dive/Sunrays";
import { Water } from "@/components/three/dive/Water";
import { MAX_DPR, resolutionFor } from "@/lib/dive/resolution";

/** Average frame time (s) that counts as struggling: under ~45 fps. */
const SLOW_FRAME = 1 / 45;
/** Seconds of frames per verdict; the first window is skipped (shader compile). */
const WINDOW_S = 2;

const canRender = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
};

/**
 * Keeps the canvas at the device's own sharpness (lib/dive/resolution) as the
 * viewport resizes, and gives resolution back a quarter step at a time while
 * frames run slow — only ever down, so it never oscillates.
 */
const Resolution = () => {
  const setDpr = useThree((s) => s.setDpr);
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);
  const [ceiling, setCeiling] = useState(MAX_DPR);
  const probe = useRef({ t: -WINDOW_S, frames: 0 });
  const dpr = resolutionFor(window.devicePixelRatio, width, height, ceiling);

  useEffect(() => setDpr(dpr), [dpr, setDpr]);

  useFrame((_, delta) => {
    // At the floor already, or a hidden tab / one-off hitch rather than load.
    if (dpr <= 1 || delta > 0.25) return;
    const p = probe.current;
    p.t += delta;
    p.frames += 1;
    if (p.t < WINDOW_S) {
      if (p.t < 0) p.frames = 0;
      return;
    }
    if (p.t / p.frames > SLOW_FRAME) setCeiling(Math.max(1, dpr - 0.25));
    p.t = 0;
    p.frames = 0;
  });

  return null;
};

export const DiveSceneImpl = () => {
  // Lazy init, not an effect: this component only ever mounts client-side
  // (its parent dynamic-imports it with ssr:false), so reading window/canvas
  // capability once on first render is safe and avoids a redundant re-render.
  const [ok] = useState(canRender);
  // Touch devices get half the particles; resolution is Resolution's call.
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
        dpr={resolutionFor(window.devicePixelRatio, window.innerWidth, window.innerHeight)}
        camera={{ position: [0, 0, 8], fov: 40 }}
        // MSAA only re-samples geometry edges, so the full-screen water pays
        // almost nothing for it; without it the hull and palms stair-stepped.
        gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
      >
        <Resolution />
        <Water />
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 6, 4]} intensity={3} />
        <Sunrays count={lite ? 3 : 5} />
        <MarineSnow count={lite ? 300 : 1400} />
        <Bioluminescence count={lite ? 40 : 80} />
        <Seafloor />
        <Fish lite={lite} />
        <Submersible />
        <Bubbles count={lite ? 120 : 220} />
      </Canvas>
    </div>
  );
};
