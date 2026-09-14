import { describe, expect, test } from "vitest";
import { scrubRange } from "@/lib/dive/scrub";

describe("scrubRange", () => {
  test("a multi-beat chapter pins its stage and scrubs across the pin", () => {
    expect(scrubRange(1, 5)).toEqual({ start: "top top", end: "bottom bottom", pin: true });
    expect(scrubRange(2, 1.5)).toEqual({ start: "top top", end: "bottom bottom", pin: true });
  });

  test("the first one-beat chapter is already on screen, so it scrubs its exit", () => {
    // top top → bottom bottom is zero pixels for a 100svh section: the surface
    // headline cut out at the first scroll tick instead of clearing with it.
    expect(scrubRange(0, 1)).toEqual({ start: "top top", end: "bottom top", pin: false });
  });

  test("any later one-beat chapter scrubs its entrance", () => {
    // The last chapter can never scroll past its own bottom, so an exit range
    // would hold its reveals at progress 0 for good.
    expect(scrubRange(5, 1)).toEqual({ start: "top bottom", end: "bottom bottom", pin: false });
  });
});
