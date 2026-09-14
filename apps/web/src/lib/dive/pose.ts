import { CHAPTERS, SUB_POSES, type ChapterId, type Lane, type Pose } from "@/constants/dive";
import { localProgress, type Range } from "./depth";

/** How much of a chapter's end the sub spends flying to the next lane. */
const MOVE_BEATS = 1;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * The sub's pose at global progress `p`. It holds the current chapter's lane
 * while that chapter is read — a travel lane descends through all of it — and flies
 * to the next lane over the chapter's last beat. Measured lanes override
 * the fallback position and size; rotZ and lamp always come from SUB_POSES.
 */
export function poseAt(p: number, ranges: Range[], lanes: Partial<Record<ChapterId, Lane>> = {}): Pose {
  const { id, t } = localProgress(p, ranges);
  const i = CHAPTERS.findIndex((c) => c.id === id);
  const range = ranges.find((r) => r.id === id);
  // A one-beat chapter is all transition. Longer ones fly for a beat but never
  // more than 45% of the chapter: at a full beat, a 1.5-beat chapter (twilight,
  // midnight) held its lane for only the first third and the sub left the
  // sonar while it was still being read.
  const beats = range?.beats ?? 1;
  const move = beats <= 1 ? 1 : Math.min(MOVE_BEATS, beats * 0.45) / beats;
  const hold = 1 - move;

  const { y2, alt, ...from }: Pose = { ...SUB_POSES[id], ...lanes[id] };
  // Over the whole chapter, in step with the descent marker's own tween; the
  // flight to the next lane then leaves from wherever the sub has got to.
  if (y2 !== undefined) from.y = lerp(from.y, y2, clamp01(t));
  if (alt) {
    const s = altAt(p, ranges, lanes);
    from.x = lerp(from.x, alt.x, s);
    from.y = lerp(from.y, alt.y, s);
    from.w = lerp(from.w, alt.w, s);
    from.h = lerp(from.h, alt.h, s);
  }

  const next = CHAPTERS[i + 1];
  if (!next || t <= hold) return from;
  const { y2: _, alt: __, ...to }: Pose = { ...SUB_POSES[next.id], ...lanes[next.id] };
  const e = easeInOut((t - hold) / move);
  return {
    x: lerp(from.x, to.x, e),
    y: lerp(from.y, to.y, e),
    w: lerp(from.w, to.w, e),
    h: lerp(from.h, to.h, e),
    rotZ: lerp(from.rotZ, to.rotZ, e),
    lamp: lerp(from.lamp, to.lamp, e),
  };
}

/** A side swap starts this far (in beats) before a beat lands, and takes this long. */
const SWAP_LEAD = 0.6;
const SWAP_BEATS = 0.6;

/**
 * How far the sub has crossed to its lane's `alt` box: 0 in the lane, 1 in
 * alt. A chapter whose layout alternates sides beat by beat (the reef: odd
 * sites put the record on the right) swaps the sub across at each handover,
 * eased so it lands as the snap settles on the new beat. Always 0 for a
 * chapter whose lane has no `alt` — including the reef on phones, which parks
 * beside the head. Scroll-driven, so scrolling back swaps it back.
 */
export function altAt(p: number, ranges: Range[], lanes: Partial<Record<ChapterId, Lane>> = {}): number {
  const { id, t } = localProgress(p, ranges);
  if (!lanes[id]?.alt) return 0;
  const beats = ranges.find((r) => r.id === id)?.beats ?? 1;
  const pos = t * beats;
  let s = 0;
  for (let k = 1; k < beats && pos > k - SWAP_LEAD; k += 1) {
    const e = easeInOut(clamp01((pos - (k - SWAP_LEAD)) / SWAP_BEATS));
    s = k % 2 === 1 ? e : 1 - e;
  }
  return s;
}

/**
 * The opening plunge: across the surface chapter the nose tips down into the
 * dive (steepest halfway, level again as it reaches the reef) and the sub
 * sinks a little below its path, so going under reads as a dive rather than
 * a lift. Pitch in radians, dip in NDC. Zero outside the surface chapter.
 */
export function plungeAt(p: number, ranges: Range[]): { pitch: number; dip: number } {
  const { id, t } = localProgress(p, ranges);
  if (id !== "surface" || t === 0) return { pitch: 0, dip: 0 };
  const arc = Math.sin(Math.PI * easeInOut(t));
  return { pitch: -0.55 * arc, dip: -0.12 * arc };
}
