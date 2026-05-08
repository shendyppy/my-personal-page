"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

type UseMagneticHoverOptions = {
  /** Pixel cap on how far the element drifts from its natural position. */
  strength?: number;
  /** Spring stiffness — higher = snappier. */
  stiffness?: number;
  /** Spring damping — higher = less bouncy. */
  damping?: number;
};

type UseMagneticHoverResult<E extends HTMLElement> = {
  ref: React.RefObject<E | null>;
  x: MotionValue<number>;
  y: MotionValue<number>;
};

/**
 * Subtle pointer-following effect — the element drifts toward the cursor
 * by up to `strength` pixels, then springs back when the pointer leaves.
 * Disabled automatically on touch devices and for users with
 * `prefers-reduced-motion`.
 */
export function useMagneticHover<E extends HTMLElement = HTMLElement>({
  strength = 8,
  stiffness = 250,
  damping = 18,
}: UseMagneticHoverOptions = {}): UseMagneticHoverResult<E> {
  const ref = useRef<E>(null);
  const xRaw = useMotionValue(0);
  const yRaw = useMotionValue(0);
  const x = useSpring(xRaw, { stiffness, damping });
  const y = useSpring(yRaw, { stiffness, damping });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (event.clientX - cx) / (rect.width / 2);
      const dy = (event.clientY - cy) / (rect.height / 2);
      xRaw.set(dx * strength);
      yRaw.set(dy * strength);
    };

    const handleLeave = () => {
      xRaw.set(0);
      yRaw.set(0);
    };

    node.addEventListener("pointermove", handleMove);
    node.addEventListener("pointerleave", handleLeave);

    return () => {
      node.removeEventListener("pointermove", handleMove);
      node.removeEventListener("pointerleave", handleLeave);
    };
  }, [xRaw, yRaw, strength]);

  return { ref, x, y };
}
