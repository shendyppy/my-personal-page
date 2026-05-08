"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";

import { useThemeContext } from "@/app/providers/ThemeProvider";
import { useMediaQuery } from "@/hooks/useResponsive";
import type { Theme } from "@/types";

// 3D scene streams in client-side; SSR is skipped entirely.
const HeroScene = dynamic(() => import("@/components/molecules/HeroScene"), {
  ssr: false,
  loading: () => null,
});

/**
 * Inner component that owns the ref + scroll-driven parallax. Only mounts
 * when we know we're rendering the scene (sm+ viewport) — that way
 * `useScroll` always finds a hydrated target and doesn't throw the
 * "Target ref is defined but not hydrated" warning.
 */
const HeroSceneInner = ({ theme, isSmUp }: { theme: Theme; isSmUp: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.25]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className="absolute inset-0 z-0">
      <HeroScene theme={theme} isSmUp={isSmUp} />
    </motion.div>
  );
};

/**
 * Client island for the 3D hero scene. Skipped outright on touch /
 * small viewports — saves the entire R3F + drei + three bundle and the
 * canvas's continuous rAF on mobile.
 */
export const HeroSceneIsland = () => {
  const { theme } = useThemeContext();
  const isSmUp = useMediaQuery({ min: 640 });

  if (!isSmUp) return null;

  return <HeroSceneInner theme={theme} isSmUp={isSmUp} />;
};
