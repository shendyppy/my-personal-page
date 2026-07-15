"use client";

import { useCallback } from "react";
import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type BackToTopProps = {
  className?: string;
  label?: string;
};

/**
 * Animated "back to top". Replaces the old instant `<a href="#top">` jump with
 * a smooth `window.scrollTo`, respecting `prefers-reduced-motion` (jumps
 * instantly when reduced) and nudging the arrow upward on hover.
 *
 * Kept as a client island so the surrounding Footer can stay an RSC.
 */
export const BackToTop = ({ className, label = "BACK TO TOP" }: BackToTopProps) => {
  const reduceMotion = useReducedMotion();

  const handleClick = useCallback(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [reduceMotion]);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Scroll back to top"
      className={cn(
        "group inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.1em] text-muted-foreground transition-colors duration-300 hover:text-accent",
        className,
      )}
    >
      {label}
      <span
        aria-hidden="true"
        className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 motion-reduce:transition-none"
      >
        ↑
      </span>
    </button>
  );
};

export default BackToTop;
