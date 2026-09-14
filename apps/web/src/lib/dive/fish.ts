import type { ChapterId } from "@/constants/dive";
import type { Range } from "./depth";

/** A point in the dive named by chapter: `t` is how far through that chapter (0..1). */
export type Mark = { chapter: ChapterId; t: number };

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (a: number, b: number, x: number) => {
  const k = clamp01((x - a) / (b - a));
  return k * k * (3 - 2 * k);
};

export const markAt = (m: Mark, ranges: Range[]) => {
  const r = ranges.find((r) => r.id === m.chapter)!;
  return r.start + (r.end - r.start) * m.t;
};

/**
 * How present a species is at progress `p`: `weight` eases 0→1→0 across the
 * water it lives in (from → to, fading over `fade` progress at each end), and
 * `u` is where the dive sits inside that water (0..1), for parallax.
 */
export function presence(p: number, ranges: Range[], from: Mark, to: Mark, fade = 0.02) {
  const a = markAt(from, ranges);
  const b = markAt(to, ranges);
  // A window that opens at the very top (or closes at the very bottom) is
  // already there, not fading in off-screen.
  return {
    weight: (a <= 0 ? 1 : smooth(a, a + fade, p)) * (b >= 1 ? 1 : 1 - smooth(b - fade, b, p)),
    u: clamp01((p - a) / (b - a || 1)),
  };
}

/** `x` folded into [-span/2, span/2): a school that swims off one edge re-enters at the other. */
export const wrap = (x: number, span: number) => ((((x + span / 2) % span) + span) % span) - span / 2;
