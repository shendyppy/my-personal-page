import { describe, expect, test } from "vitest";
import { createSpin, spinEnd, spinMove, spinStart, spinStep } from "@/lib/dive/spin";

const FRAME = 1 / 60;

describe("spin", () => {
  test("dragging turns the sub by the pointer delta: x spins about y, y about x", () => {
    const s = createSpin();
    spinStart(s, 100, 100);
    spinMove(s, 150, 80);
    expect(s.ry).toBeCloseTo(50 * 0.006, 10);
    expect(s.rx).toBeCloseTo(-20 * 0.006, 10);
  });

  test("moving without a drag does nothing", () => {
    const s = createSpin();
    spinMove(s, 500, 500);
    expect([s.rx, s.ry]).toEqual([0, 0]);
  });

  test("a released flick keeps turning the same way and settles", () => {
    const s = createSpin();
    spinStart(s, 0, 0);
    spinMove(s, 40, 0);
    spinEnd(s);
    const before = s.ry;
    spinStep(s, FRAME, true);
    expect(s.ry).toBeGreaterThan(before);
    for (let i = 0; i < 600; i += 1) spinStep(s, FRAME, true);
    const settled = s.ry;
    spinStep(s, FRAME, true);
    expect(s.ry - settled).toBeLessThan(1e-6);
  });

  test("holding still before release bleeds off the flick", () => {
    const s = createSpin();
    spinStart(s, 0, 0);
    spinMove(s, 40, 0);
    for (let i = 0; i < 120; i += 1) spinStep(s, FRAME, true); // two seconds held
    spinEnd(s);
    const held = s.ry;
    for (let i = 0; i < 600; i += 1) spinStep(s, FRAME, true);
    // A released flick of the same move travels ~3.7 rad; after the pause it
    // is a rounding error.
    expect(s.ry - held).toBeLessThan(0.01);
  });

  test("inertia is frame-rate independent", () => {
    const flick = () => {
      const s = createSpin();
      spinStart(s, 0, 0);
      spinMove(s, 40, 0);
      spinEnd(s);
      return s;
    };
    const at60 = flick();
    const at30 = flick();
    for (let i = 0; i < 60; i += 1) spinStep(at60, 1 / 60, true);
    for (let i = 0; i < 30; i += 1) spinStep(at30, 1 / 30, true);
    expect(at30.ry).toBeCloseTo(at60.ry, 2);
  });

  test("outside the seafloor the sub eases home the short way round and the drag ends", () => {
    const s = createSpin();
    spinStart(s, 0, 0);
    s.ry = Math.PI * 4 + 0.3; // two full turns and a bit
    s.rx = -0.2;
    spinStep(s, FRAME, false);
    expect(s.dragging).toBe(false);
    expect(Math.abs(s.ry)).toBeLessThan(0.3);
    for (let i = 0; i < 300; i += 1) spinStep(s, FRAME, false);
    expect(Math.abs(s.ry)).toBeLessThan(1e-3);
    expect(Math.abs(s.rx)).toBeLessThan(1e-3);
  });
});
