import { expect, test } from "vitest";
import { chapterRanges } from "./depth";
import { poseAt } from "./pose";
import { SUB_POSES } from "@/constants/dive";

const r = chapterRanges([1, 5, 1.5, 3, 1.5, 1]);

test("start of a chapter is exactly that chapter's pose", () => {
  expect(poseAt(0, r)).toEqual(SUB_POSES.surface);
  expect(poseAt(r[2].start, r)).toEqual(SUB_POSES.twilight);
});

test("end of the last chapter holds the seafloor pose", () => {
  expect(poseAt(1, r)).toEqual(SUB_POSES.seafloor);
});

test("midway through a chapter is between the two poses", () => {
  const mid = (r[0].start + r[0].end) / 2;
  const p = poseAt(mid, r);
  // x increases from surface to reef
  expect(p.x).toBeGreaterThan(SUB_POSES.surface.x);
  expect(p.x).toBeLessThan(SUB_POSES.reef.x);
  // y decreases from surface to reef
  expect(p.y).toBeLessThan(SUB_POSES.surface.y);
  expect(p.y).toBeGreaterThan(SUB_POSES.reef.y);
  // scale decreases from surface to reef
  expect(p.scale).toBeLessThan(SUB_POSES.surface.scale);
  expect(p.scale).toBeGreaterThan(SUB_POSES.reef.scale);
  // rotZ becomes more negative (decreases) from surface to reef
  expect(p.rotZ).toBeGreaterThan(SUB_POSES.reef.rotZ);
  expect(p.rotZ).toBeLessThan(SUB_POSES.surface.rotZ);
  // lamp increases from surface to reef
  expect(p.lamp).toBeGreaterThan(SUB_POSES.surface.lamp);
  expect(p.lamp).toBeLessThan(SUB_POSES.reef.lamp);
});
