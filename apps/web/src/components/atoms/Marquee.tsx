"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

const ITEMS = [
  "React",
  "TypeScript",
  "Next.js",
  "Three.js & WebGL",
  "Node.js",
  "NestJS",
  "PostgreSQL",
  "Motion Design",
  "Test-Driven",
];

/**
 * Rotated accent marquee that bridges the hero and the work. The base strip
 * loops seamlessly via CSS (`animate-marquee`); layered on top, the text leans
 * (skewX) in proportion to scroll velocity and direction, so the hero→projects
 * scroll reads as one continuous motion rather than two stacked sections. The
 * skew lives on a separate element from the CSS-animated strip so their
 * transforms never collide. Decorative, so it's `aria-hidden`.
 */
export const Marquee = () => {
  const reduceMotion = useReducedMotion();
  const strip = ITEMS.join(" ✦ ") + " ✦ ";

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 40,
    stiffness: 300,
  });
  // Fast scroll down leans the type one way, scrolling up the other; capped so
  // it stays a lean, never a collapse.
  const skew = useTransform(smoothVelocity, [-2500, 2500], [7, -7], {
    clamp: true,
  });

  return (
    <div
      aria-hidden
      className="relative z-[3] my-5 -mx-6 overflow-hidden bg-accent py-3.5 text-accent-foreground md:-mx-10"
      style={{ transform: "rotate(-1.5deg)" }}
    >
      <motion.div style={reduceMotion ? undefined : { skewX: skew }}>
        <div className="flex w-max animate-marquee whitespace-nowrap font-heading text-[22px] font-bold uppercase tracking-[0.02em] motion-reduce:animate-none">
          <span className="pr-8">{strip}</span>
          <span className="pr-8">{strip}</span>
        </div>
      </motion.div>
    </div>
  );
};
