import { expect, test } from "vitest";
import { blipPosition } from "./sonar";

test("blips are evenly spaced starting at the top", () => {
  const a = blipPosition(0, 4, 100, 0, 0);
  const b = blipPosition(1, 4, 100, 0, 0);
  expect(a.angle).toBe(-90);
  expect(b.angle).toBe(0);
  expect(a.x).toBeCloseTo(0);
  expect(a.y).toBeCloseTo(-100);
  expect(b.x).toBeCloseTo(100);
  expect(b.y).toBeCloseTo(0);
});

test("centre offset is applied", () => {
  expect(blipPosition(0, 1, 50, 320, 320)).toMatchObject({ x: 320, y: 270 });
});
