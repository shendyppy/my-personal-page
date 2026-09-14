/**
 * ScrollTrigger range for a chapter. A pinned stage scrubs across its pin,
 * which is `(beats - 1) × 100svh` long — zero for a one-beat chapter. Those
 * scrub the viewport-height they cross instead: the first chapter is on screen
 * at load, so its exit; every later one, its entrance.
 */
export const scrubRange = (index: number, beats: number) =>
  beats > 1
    ? { start: "top top", end: "bottom bottom", pin: true }
    : index === 0
      ? { start: "top top", end: "bottom top", pin: false }
      : { start: "top bottom", end: "bottom bottom", pin: false };
