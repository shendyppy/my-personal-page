import { describe, expect, test } from "vitest";
import { chapterRanges } from "@/lib/dive/depth";
import { markAt, presence, wrap } from "@/lib/dive/fish";

const ranges = chapterRanges([1, 5, 1.5, 3, 1.5, 1]);
const from = { chapter: "reef", t: 0 } as const;
const to = { chapter: "twilight", t: 0.5 } as const;

describe("presence", () => {
  test("absent outside its water, fully there in the middle of it", () => {
    const a = markAt(from, ranges);
    const b = markAt(to, ranges);
    expect(presence(a - 0.01, ranges, from, to).weight).toBe(0);
    expect(presence(b + 0.01, ranges, from, to).weight).toBe(0);
    expect(presence((a + b) / 2, ranges, from, to).weight).toBe(1);
  });

  test("fades in rather than popping", () => {
    const a = markAt(from, ranges);
    const w = presence(a + 0.01, ranges, from, to, 0.02).weight;
    expect(w).toBeGreaterThan(0);
    expect(w).toBeLessThan(1);
  });

  test("a window that starts at the top of the dive is there on arrival", () => {
    const top = { chapter: "surface", t: 0 } as const;
    expect(presence(0, ranges, top, to).weight).toBe(1);
    const bottom = { chapter: "seafloor", t: 1 } as const;
    expect(presence(1, ranges, from, bottom).weight).toBe(1);
  });

  test("u runs 0..1 across the window", () => {
    expect(presence(markAt(from, ranges), ranges, from, to).u).toBe(0);
    expect(presence(markAt(to, ranges), ranges, from, to).u).toBe(1);
    expect(presence(1, ranges, from, to).u).toBe(1);
  });
});

describe("wrap", () => {
  test("keeps values inside the span, both directions", () => {
    expect(wrap(0, 10)).toBe(0);
    expect(wrap(6, 10)).toBe(-4);
    expect(wrap(-6, 10)).toBe(4);
    expect(wrap(123.5, 10)).toBeCloseTo(3.5);
    expect(wrap(-123.5, 10)).toBeCloseTo(-3.5);
  });
});
