"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

type UseTiltOptions = {
  /** Maximum tilt in degrees applied at the card edges. */
  max?: number;
  /** Spring stiffness — higher = snappier. */
  stiffness?: number;
  /** Spring damping — higher = less bouncy. */
  damping?: number;
};

type UseTiltResult<E extends HTMLElement> = {
  ref: React.RefObject<E | null>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
};

/**
 * Pointer-driven 3D tilt — rotates the element around X/Y based on cursor
 * position relative to its center, up to `max` degrees. Disabled on
 * touch devices and for users with `prefers-reduced-motion`.
 *
 * Pair the returned motion values with framer-motion's `style={{ rotateX, rotateY }}`
 * and add `transform-style: preserve-3d` + a perspective on a parent.
 */
export function useTilt<E extends HTMLElement = HTMLElement>({
  max = 8,
  stiffness = 200,
  damping = 20,
}: UseTiltOptions = {}): UseTiltResult<E> {
  const ref = useRef<E>(null);
  const rxRaw = useMotionValue(0);
  const ryRaw = useMotionValue(0);
  const rotateX = useSpring(rxRaw, { stiffness, damping });
  const rotateY = useSpring(ryRaw, { stiffness, damping });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      // px/py in [0..1]; map to [-max..max], invert X so up = tilt back
      ryRaw.set((px - 0.5) * 2 * max);
      rxRaw.set(-(py - 0.5) * 2 * max);
    };

    const handleLeave = () => {
      rxRaw.set(0);
      ryRaw.set(0);
    };

    node.addEventListener("pointermove", handleMove);
    node.addEventListener("pointerleave", handleLeave);

    return () => {
      node.removeEventListener("pointermove", handleMove);
      node.removeEventListener("pointerleave", handleLeave);
    };
  }, [rxRaw, ryRaw, max]);

  return { ref, rotateX, rotateY };
}
