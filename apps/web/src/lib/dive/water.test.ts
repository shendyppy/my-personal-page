import { describe, expect, test } from "vitest";
import { chapterRanges } from "./depth";
import { SUBMERGED_LINE, SURFACE_LINE, waterAt, waterlineAt } from "./water";

test("progress 0 returns the first stop as 0..1 rgb", () => {
  const w = waterAt(0);
  expect(w.top.map((c) => Math.round(c * 255))).toEqual([14, 74, 110]);
  expect(w.fog).toBe(0.02);
});

test("progress 1 returns the last stop", () => {
  expect(waterAt(1).fog).toBe(0.12);
});

test("halfway between stops interpolates", () => {
  expect(waterAt(0.125).fog).toBeCloseTo(0.0325);
});

test("progress in later bracket [0.5, 0.75) selects and interpolates correctly", () => {
  // 0.6 falls between WATER_STOPS[2] (at 0.5) and WATER_STOPS[3] (at 0.75)
  // t = (0.6 - 0.5) / (0.75 - 0.5) = 0.4
  // fog = 0.07 + (0.095 - 0.07) * 0.4 = 0.08
  const w = waterAt(0.6);
  expect(w.fog).toBeCloseTo(0.08);
  // top color: #03141f → #020a10 at t=0.4
  // R: 3/255 + (2/255 - 3/255) * 0.4 ≈ 0.0102
  expect(w.top[0]).toBeCloseTo((3 + (2 - 3) * 0.4) / 255);
});

test("clamped negative progress returns first stop", () => {
  const w = waterAt(-0.2);
  expect(w.fog).toBe(0.02);
  expect(w.top.map((c) => Math.round(c * 255))).toEqual([14, 74, 110]);
});

test("clamped progress > 1 returns last stop", () => {
  const w = waterAt(1.4);
  expect(w.fog).toBe(0.12);
});

describe("waterlineAt", () => {
  const r = chapterRanges([1, 5, 1.5, 3, 1.5, 1]);
  const at = (i: number, t: number) => r[i].start + (r[i].end - r[i].start) * t;

  test("at rest the sea surface sits across the hero, shore and sky above it", () => {
    expect(waterlineAt(0, r)).toBeCloseTo(SURFACE_LINE, 10);
  });

  test("scrolling the surface chapter carries the waterline up and off the top", () => {
    const heights = [0, 0.2, 0.4, 0.6].map((t) => waterlineAt(at(0, t), r));
    heights.slice(1).forEach((h, i) => expect(h).toBeGreaterThan(heights[i]));
    expect(waterlineAt(at(0, 0.7), r)).toBeCloseTo(SUBMERGED_LINE, 10);
    expect(SUBMERGED_LINE).toBeGreaterThan(1);
  });

  test("every later chapter is fully under", () => {
    for (let i = 1; i < r.length; i += 1) expect(waterlineAt(at(i, 0.5), r)).toBe(SUBMERGED_LINE);
  });
});
