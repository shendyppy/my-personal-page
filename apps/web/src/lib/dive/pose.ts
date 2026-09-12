import { CHAPTERS, SUB_POSES, type Pose } from "@/constants/dive";
import { localProgress, type Range } from "./depth";

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function poseAt(p: number, ranges: Range[]): Pose {
  const { id, t } = localProgress(p, ranges);
  const i = CHAPTERS.findIndex((c) => c.id === id);
  const from = SUB_POSES[id];
  const next = CHAPTERS[i + 1];
  if (!next) return { ...from };
  const to = SUB_POSES[next.id];
  const e = easeInOut(t);
  return {
    x: lerp(from.x, to.x, e),
    y: lerp(from.y, to.y, e),
    scale: lerp(from.scale, to.scale, e),
    rotZ: lerp(from.rotZ, to.rotZ, e),
    lamp: lerp(from.lamp, to.lamp, e),
  };
}
