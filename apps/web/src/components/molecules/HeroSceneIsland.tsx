"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { SplineScene } from "@/components/ui/splite";
import { useMediaQuery } from "@/hooks/useResponsive";

/** Hosted Spline robot scene (follows the cursor). */
const HERO_SPLINE_SCENE =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/**
 * Inner component that owns the ref + scroll-driven parallax. Only mounts
 * when we know we're rendering the scene (sm+ viewport) — that way
 * `useScroll` always finds a hydrated target and doesn't throw the
 * "Target ref is defined but not hydrated" warning.
 */
const HeroSceneInner = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.25]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className="absolute inset-0 z-0">
      <SplineScene scene={HERO_SPLINE_SCENE} className="h-full w-full" />
    </motion.div>
  );
};

/**
 * Client island for the 3D hero scene. Skipped outright on touch / small
 * viewports — the Spline runtime + hosted scene are heavy, so mobile gets the
 * static headline over the aurora wash instead.
 */
export const HeroSceneIsland = () => {
  const isSmUp = useMediaQuery({ min: 640 });

  if (!isSmUp) return null;

  return <HeroSceneInner />;
};
