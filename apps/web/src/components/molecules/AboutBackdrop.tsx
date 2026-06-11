"use client";

import dynamic from "next/dynamic";

import { useMediaQuery } from "@/hooks/useResponsive";

// WebGL plasma — fetched only when the About section actually renders, and
// never on the server (needs `window`).
const ShaderBackground = dynamic(
  () => import("@/components/ui/shader-background"),
  { ssr: false }
);

/**
 * Animated backdrop for the About section. On desktop the plasma flows
 * horizontally (existing look); on mobile/portrait it flows vertically so it
 * fits the tall viewport. Layered behind a theme wash so the cards/text stay
 * readable — softer on dark, stronger on the light base. Perf is guarded inside
 * the shader (DPR cap, off-screen pause, reduced-motion still-frame).
 */
export const AboutBackdrop = () => {
  const isMdUp = useMediaQuery({ min: 768 });

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <ShaderBackground
        vertical={!isMdUp}
        className="absolute inset-0 h-full w-full opacity-50 dark:opacity-70"
      />
      <div className="absolute inset-0 bg-accent/50 dark:bg-background/30" />
    </div>
  );
};
