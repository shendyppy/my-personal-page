import { WATER_STOPS } from "@/constants/dive";
import { localProgress, type Range } from "./depth";

export type Rgb = [number, number, number];

export const hexToRgb = (hex: string): Rgb => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const mix = (a: Rgb, b: Rgb, t: number): Rgb => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

export function waterAt(p: number): { top: Rgb; bottom: Rgb; fog: number } {
  const x = Math.min(1, Math.max(0, p));
  let i = 0;
  while (i < WATER_STOPS.length - 2 && x > WATER_STOPS[i + 1].at) i++;
  const a = WATER_STOPS[i];
  const b = WATER_STOPS[i + 1];
  const t = (x - a.at) / (b.at - a.at);
  return {
    top: mix(hexToRgb(a.top), hexToRgb(b.top), t),
    bottom: mix(hexToRgb(a.bottom), hexToRgb(b.bottom), t),
    fog: a.fog + (b.fog - a.fog) * t,
  };
}

/** Where the sea surface sits at the very top of the dive: 45% up the screen. */
export const SURFACE_LINE = 0.45;
/** Past this the line is above the viewport and only water is left. */
export const SUBMERGED_LINE = 1.3;
/** Share of the surface chapter it takes to go under. */
const DIVE_SHARE = 0.7;

/**
 * Height of the sea surface on screen (0 = bottom edge, 1 = top edge) for the
 * opening dive: the shore and sky fill the top of the hero at rest, and the
 * waterline climbs past the top of the viewport over the first 70% of the
 * surface chapter, so scrolling reads as going under. Every later chapter is
 * fully submerged.
 */
export function waterlineAt(p: number, ranges: Range[]): number {
  const { id, t } = localProgress(p, ranges);
  if (id !== "surface") return SUBMERGED_LINE;
  const k = Math.min(1, t / DIVE_SHARE);
  const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  return SURFACE_LINE + (SUBMERGED_LINE - SURFACE_LINE) * e;
}
