import { describe, expect, test } from "vitest";
import {
  chapterAt,
  chapterRanges,
  depthForProgress,
  dive,
  localProgress,
} from "./depth";

const beats = [1, 5, 1.5, 3, 1.5, 1]; // total 13

describe("chapterRanges", () => {
  test("splits 0..1 proportionally to beats, in chapter order", () => {
    const r = chapterRanges(beats);
    expect(r.map((x) => x.id)).toEqual([
      "surface", "reef", "twilight", "descent", "midnight", "seafloor",
    ]);
    expect(r[0]).toMatchObject({ start: 0, end: 1 / 13 });
    expect(r[1].end).toBeCloseTo(6 / 13);
    expect(r[5].end).toBe(1);
  });
});

describe("depthForProgress", () => {
  test("maps 0..1 to 0..4000 metres, rounded, clamped", () => {
    expect(depthForProgress(0)).toBe(0);
    expect(depthForProgress(0.5)).toBe(2000);
    expect(depthForProgress(1)).toBe(4000);
    expect(depthForProgress(1.2)).toBe(4000);
    expect(depthForProgress(-0.1)).toBe(0);
  });
});

describe("chapterAt / localProgress", () => {
  const r = chapterRanges(beats);
  test("start of range belongs to that chapter, end belongs to the next", () => {
    expect(chapterAt(0, r)).toBe("surface");
    expect(chapterAt(1 / 13, r)).toBe("reef");
    expect(chapterAt(6 / 13 - 1e-9, r)).toBe("reef");
    expect(chapterAt(1, r)).toBe("seafloor");
  });
  test("localProgress is 0..1 inside the chapter", () => {
    expect(localProgress(1 / 13, r)).toEqual({ id: "reef", t: 0 });
    expect(localProgress(3.5 / 13, r).t).toBeCloseTo(0.5);
    expect(localProgress(1, r)).toEqual({ id: "seafloor", t: 1 });
  });
});

describe("dive store", () => {
  test("configure + set notify subscribers with derived state", () => {
    dive.configure(beats);
    const seen: number[] = [];
    const off = dive.subscribe((s) => seen.push(s.depth));
    dive.set(0.25);
    expect(dive.get()).toMatchObject({ progress: 0.25, depth: 1000, chapter: "reef" });
    off();
    dive.set(0.5);
    expect(seen).toEqual([1000]);
  });
});
