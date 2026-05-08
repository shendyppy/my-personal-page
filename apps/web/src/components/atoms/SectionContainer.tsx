"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type SectionContainerProps = {
  id: string;
  children: ReactNode;
  className?: string;
  /**
   * Reveal animation duration in seconds. Defaults to 0.8s. Pass 0 to
   * disable the reveal entirely.
   */
  duration?: number;
};

/**
 * Page-section wrapper that fades + translates content in once it scrolls
 * into view. Built on Framer Motion's `whileInView` so we get spring-y
 * easing, a single `once: true` viewport trigger, and built-in respect
 * for `prefers-reduced-motion` via `useReducedMotion()`.
 *
 * Pre-Phase-6 this used a `useIntersectionObserver` hook + Tailwind
 * transition classes. Public API is preserved (id / children / className),
 * `duration` switched from a Tailwind class string to a number of seconds
 * since Motion's transition takes seconds.
 */
export const SectionContainer = ({
  id,
  children,
  className,
  duration = 0.8,
}: SectionContainerProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={cn(className)}
      initial={reduceMotion || duration === 0 ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
};
