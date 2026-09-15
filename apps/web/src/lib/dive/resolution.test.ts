import { describe, expect, test } from "vitest";
import { MAX_PIXELS, resolutionFor } from "@/lib/dive/resolution";

describe("resolutionFor", () => {
  test("a phone renders at 2x, not its native 3x and not 1x", () => {
    expect(resolutionFor(3, 390, 844)).toBe(2);
  });

  test("a 1080p TV browser (960x540 at 2x) gets its full ratio", () => {
    expect(resolutionFor(2, 960, 540)).toBe(2);
  });

  test("a large 2x screen is held to the pixel budget", () => {
    const dpr = resolutionFor(2, 1920, 1080);
    expect(dpr).toBeLessThan(2);
    expect(1920 * 1080 * dpr * dpr).toBeCloseTo(MAX_PIXELS, -2);
  });

  test("a 1x screen stays 1x, and a huge one never drops below it", () => {
    expect(resolutionFor(1, 1440, 900)).toBe(1);
    expect(resolutionFor(1, 3840, 2160)).toBe(1);
  });

  test("the frame-rate ceiling wins when it is lower", () => {
    expect(resolutionFor(3, 390, 844, 1.5)).toBe(1.5);
  });
});
