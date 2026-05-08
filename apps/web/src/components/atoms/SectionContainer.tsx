"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

type SectionContainerProps = {
  id: string;
  children: ReactNode;
  className?: string;
  /**
   * Tailwind transition-duration class applied to the reveal animation.
   * Defaults to `duration-1000`.
   */
  duration?: string;
};

/**
 * Page-section wrapper that fades + translates content in once it scrolls
 * into view. The reveal pattern was duplicated across every section before
 * Phase 4 — extracted here as the single source of truth.
 *
 * Phase 6 will swap the intersection-observer + Tailwind transition for
 * `motion.section` + `whileInView`. Keep the public API identical so the
 * cutover is a one-file change.
 */
export const SectionContainer = ({
  id,
  children,
  className,
  duration = "duration-1000",
}: SectionContainerProps) => {
  const ref = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(ref, {
    threshold: 0.1,
    rootMargin: "100px",
  });

  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        "transition-all ease-out",
        duration,
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className
      )}
    >
      {children}
    </section>
  );
};
