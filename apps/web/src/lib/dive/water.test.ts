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
