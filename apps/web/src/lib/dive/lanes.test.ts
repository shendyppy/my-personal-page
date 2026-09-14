import { describe, expect, test } from "vitest";
import { laneFromRect } from "@/lib/dive/lanes";

const VW = 1000;
const VH = 800;

describe("laneFromRect", () => {
  test("maps the anchor's centre to NDC and its size to viewport fractions", () => {
    // 200x100 box whose centre sits at (700, 200) on a stage that starts at 0.
    const lane = laneFromRect({ left: 600, top: 150, width: 200, height: 100 }, 0, VW, VH, false);
    expect(lane.x).toBeCloseTo(0.4);
    expect(lane.y).toBeCloseTo(0.5);
    expect(lane.w).toBeCloseTo(0.2);
    expect(lane.h).toBeCloseTo(0.125);
    expect(lane.y2).toBeUndefined();
  });

  test("measures vertically from the stage, so a stage scrolled away still maps to its pinned place", () => {
    const pinned = laneFromRect({ left: 0, top: 300, width: 100, height: 100 }, 0, VW, VH, false);
    const scrolled = laneFromRect({ left: 0, top: 300 + 2400, width: 100, height: 100 }, 2400, VW, VH, false);
    expect(scrolled).toEqual(pinned);
  });

  test("a travel anchor runs from its top edge to its bottom edge", () => {
    const lane = laneFromRect({ left: 450, top: 200, width: 100, height: 400 }, 0, VW, VH, true);
    expect(lane.x).toBeCloseTo(0);
    expect(lane.y).toBeCloseTo(0.5); // top edge, 200px down
    expect(lane.y2).toBeCloseTo(-0.5); // bottom edge, 600px down
  });
});
