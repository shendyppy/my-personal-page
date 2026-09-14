import { describe, expect, test } from "vitest";
import { scatter } from "@/lib/dive/scatter";

describe("scatter", () => {
  test("every point lies inside the box around the offset", () => {
    const pts = scatter(500, [14, 10, 8], [0, 0, -2], 7);
    expect(pts).toHaveLength(1500);
    for (let i = 0; i < pts.length; i += 3) {
      expect(Math.abs(pts[i])).toBeLessThanOrEqual(7);
      expect(Math.abs(pts[i + 1])).toBeLessThanOrEqual(5);
      expect(Math.abs(pts[i + 2] + 2)).toBeLessThanOrEqual(4);
    }
  });

  test("the same seed gives the same field and another seed a different one", () => {
    expect(scatter(50, [1, 1, 1], [0, 0, 0], 3)).toEqual(scatter(50, [1, 1, 1], [0, 0, 0], 3));
    expect(scatter(50, [1, 1, 1], [0, 0, 0], 3)).not.toEqual(scatter(50, [1, 1, 1], [0, 0, 0], 4));
  });

  test("the spread actually fills the box rather than clumping", () => {
    const pts = scatter(2000, [2, 2, 2], [0, 0, 0], 11);
    const xs = pts.filter((_, i) => i % 3 === 0);
    expect(Math.min(...xs)).toBeLessThan(-0.9);
    expect(Math.max(...xs)).toBeGreaterThan(0.9);
  });
});
