"use client";

import { useEffect } from "react";

const BUBBLES = 7;
/** Longest bubble delay + duration (ms), after which a burst is removed. */
const LIFE = 1400;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * Click anywhere and the water answers: a sonar ping rings out from the
 * pointer and a handful of bubbles wobble up from it. Plain DOM nodes with CSS
 * animations, one short-lived burst per click, never taking a pointer. Skipped
 * for keyboard clicks (no pointer to rise from) and reduced motion.
 */
export const ClickBubbles = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onClick = (e: MouseEvent) => {
      if (e.detail === 0) return;
      const burst = document.createElement("div");
      burst.className = "click-burst";
      burst.setAttribute("aria-hidden", "true");
      burst.style.left = `${e.clientX}px`;
      burst.style.top = `${e.clientY}px`;
      const ring = document.createElement("span");
      ring.className = "click-ring";
      burst.append(ring);
      for (let i = 0; i < BUBBLES; i += 1) {
        const b = document.createElement("span");
        b.className = "click-bubble";
        b.style.setProperty("--size", `${rand(4, 12).toFixed(1)}px`);
        b.style.setProperty("--dx", `${rand(-28, 28).toFixed(1)}px`);
        b.style.setProperty("--rise", `${rand(60, 130).toFixed(0)}px`);
        b.style.setProperty("--delay", `${rand(0, 180).toFixed(0)}ms`);
        b.style.setProperty("--dur", `${rand(800, 1150).toFixed(0)}ms`);
        burst.append(b);
      }
      document.body.append(burst);
      setTimeout(() => burst.remove(), LIFE);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return null;
};
