"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * App Router `template.tsx` — re-mounted on every navigation, unlike
 * `layout.tsx`. We use it as the entry point for a global page-fade
 * transition. Keeps the loading bar (in layout.tsx) untouched while
 * the page contents themselves crossfade in.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
