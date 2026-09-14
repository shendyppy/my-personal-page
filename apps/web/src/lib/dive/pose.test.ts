import { describe, expect, test } from "vitest";
import { SUB_POSES } from "@/constants/dive";
import { chapterRanges } from "./depth";
import { poseAt } from "./pose";

const r = chapterRanges([1, 5, 1.5, 3, 1.5, 1]);
/** Global progress at local `t` of chapter `i`. */
const at = (i: number, t: number) => r[i].start + (r[i].end - r[i].start) * t;

describe("poseAt", () => {
  test("start of a chapter is exactly that chapter's pose", () => {
    expect(poseAt(0, r)).toEqual(SUB_POSES.surface);
    expect(poseAt(r[2].start, r)).toEqual(SUB_POSES.twilight);
  });

  test("end of the last chapter holds the seafloor pose", () => {
    expect(poseAt(1, r)).toEqual(SUB_POSES.seafloor);
  });

  test("the sub holds its lane while the chapter is read and moves only in the last beat", () => {
    // Reef is 5 beats: it holds until 4 beats in (t = 0.8).
    expect(poseAt(at(1, 0.5), r)).toEqual(SUB_POSES.reef);
    expect(poseAt(at(1, 0.79), r)).toEqual(SUB_POSES.reef);
    const moving = poseAt(at(1, 0.9), r);
    expect(moving.x).not.toBeCloseTo(SUB_POSES.reef.x, 5);
    expect(poseAt(at(1, 0.9999), r).x).toBeCloseTo(SUB_POSES.twilight.x, 2);
  });

  test("a one-beat chapter spends its whole beat moving on", () => {
    const mid = poseAt(at(0, 0.7), r);
    const lo = Math.min(SUB_POSES.surface.x, SUB_POSES.reef.x);
    const hi = Math.max(SUB_POSES.surface.x, SUB_POSES.reef.x);
    expect(mid.x).toBeGreaterThan(lo);
    expect(mid.x).toBeLessThan(hi);
  });

  test("a measured lane overrides the fallback position and size but keeps rotZ and lamp", () => {
    const lane = { x: -0.3, y: 0.1, w: 0.2, h: 0.3 };
    const p = poseAt(at(2, 0.2), r, { twilight: lane });
    expect(p).toEqual({ ...SUB_POSES.twilight, ...lane });
  });

  test("the transition flies from the current lane to the next lane", () => {
    const lanes = { reef: { x: 0.5, y: 0, w: 0.2, h: 0.2 }, twilight: { x: -0.5, y: 0, w: 0.2, h: 0.2 } };
    expect(poseAt(at(1, 0.9), r, lanes).x).toBeCloseTo(0, 1);
  });

  test("a travel lane descends in step with the chapter, like the descent marker", () => {
    const lanes = { descent: { x: 0, y: 0.8, y2: -0.8, w: 0.1, h: 1 } };
    expect(poseAt(at(3, 0), r, lanes).y).toBeCloseTo(0.8);
    expect(poseAt(at(3, 0.25), r, lanes).y).toBeCloseTo(0.4);
    expect(poseAt(at(3, 0.5), r, lanes).y).toBeCloseTo(0);
    // Descent is 3 beats, so it holds until t = 2/3 and is still on the line there.
    expect(poseAt(at(3, 0.6), r, lanes)).toMatchObject({ x: 0, y: expect.closeTo(-0.16, 5) });
  });
});
