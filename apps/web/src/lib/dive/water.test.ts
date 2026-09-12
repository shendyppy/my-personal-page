import { expect, test } from "vitest";
import { waterAt } from "./water";

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
