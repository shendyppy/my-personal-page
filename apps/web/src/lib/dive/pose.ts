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
  const move = Math.min(1, MOVE_BEATS / (range?.beats ?? 1));
  const hold = 1 - move;

  const { y2, ...from }: Pose = { ...SUB_POSES[id], ...lanes[id] };
  // Over the whole chapter, in step with the descent marker's own tween; the
  // flight to the next lane then leaves from wherever the sub has got to.
  if (y2 !== undefined) from.y = lerp(from.y, y2, clamp01(t));

  const next = CHAPTERS[i + 1];
  if (!next || t <= hold) return from;
  const { y2: _, ...to }: Pose = { ...SUB_POSES[next.id], ...lanes[next.id] };
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
