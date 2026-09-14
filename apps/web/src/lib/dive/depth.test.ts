import { describe, expect, test } from "vitest";
import {
  chapterAt,
  chapterRanges,
  depthForProgress,
  dive,
  localProgress,
  type DiveState,
} from "./depth";

const beats = [1, 5, 1.5, 3, 1.5, 1]; // total 13
const divergentBeats = [2, 10, 1, 1, 1, 1]; // total 16, deliberately unlike `beats`/CHAPTERS defaults

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

  test("is proportional to a divergent beats array, not the CHAPTERS defaults", () => {
    const r = chapterRanges(divergentBeats);
    expect(r[0].end).toBeCloseTo(2 / 16);
    expect(r[1].end).toBeCloseTo(12 / 16);
  });

  test("ranges are contiguous regardless of beats", () => {
    for (const b of [beats, divergentBeats]) {
      const r = chapterRanges(b);
      expect(r[0].start).toBe(0);
      expect(r[r.length - 1].end).toBe(1);
      for (let i = 1; i < r.length; i++) {
        expect(r[i].start).toBe(r[i - 1].end);
      }
    }
  });
});

describe("depthForProgress", () => {
  const r = chapterRanges(beats);
  test("follows each chapter's depth band, rounded, clamped", () => {
    expect(depthForProgress(0, r)).toBe(0);
    expect(depthForProgress(1 / 13, r)).toBe(5); // reef starts in the sunlit shallows
    expect(depthForProgress(3.5 / 13, r)).toBeCloseTo(27.5, -0.5); // half-way through the reef's 5..50 m
    expect(depthForProgress(7.5 / 13, r)).toBe(1000); // descent opens at the midnight zone
    expect(depthForProgress(1, r)).toBe(4000);
    expect(depthForProgress(1.2, r)).toBe(4000);
    expect(depthForProgress(-0.1, r)).toBe(0);
  });

  test("never jumps at a chapter boundary", () => {
    for (const x of r.slice(1)) {
      expect(Math.abs(depthForProgress(x.start - 1e-9, r) - depthForProgress(x.start, r))).toBeLessThanOrEqual(1);
    }
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
    expect(dive.get()).toMatchObject({
      progress: 0.25,
      depth: 25,
      chapter: "reef",
      ranges: chapterRanges(beats),
    });
    off();
    dive.set(0.5);
    expect(seen).toEqual([25]);
  });

  test("configure notifies subscribers even without a set() call", () => {
    dive.configure(beats);
    dive.set(0.6); // known baseline: chapter "descent" under `beats`
    const seen: DiveState[] = [];
    const off = dive.subscribe((s) => seen.push(s));

    dive.configure(divergentBeats);
    off();

    const expectedRanges = chapterRanges(divergentBeats);
    expect(seen).toHaveLength(1);
    expect(seen[0]).toMatchObject({
      progress: 0.6,
      chapter: chapterAt(0.6, expectedRanges), // "reef" under divergentBeats — proves it recomputed
      ranges: expectedRanges,
    });
  });
});
