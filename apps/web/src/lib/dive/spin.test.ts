import { describe, expect, test } from "vitest";
import { createSpin, spinEnd, spinMove, spinStart, spinStep } from "@/lib/dive/spin";

const FRAME = 1 / 60;
const run = (s: ReturnType<typeof createSpin>, frames: number, dt = FRAME) => {
  for (let i = 0; i < frames; i += 1) spinStep(s, dt);
};

const flick = (dx = 40) => {
  const s = createSpin();
  spinStart(s, 0, 0);
  spinMove(s, dx, 0);
  spinEnd(s);
  return s;
};

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

  test("a released flick keeps turning the same way for a while", () => {
    const s = flick();
    const before = s.ry;
    run(s, 10);
    expect(s.ry).toBeGreaterThan(before + 0.5);
  });

  test("once the flick dies the sub settles back home, whichever way is shorter", () => {
    const s = flick(400); // several turns' worth
    run(s, 600);
    expect(Math.abs(s.ry)).toBeLessThan(1e-3);
    expect(Math.abs(s.rx)).toBeLessThan(1e-3);
  });

  test("a held sub stays where it was dragged — homing waits for the release", () => {
    const s = createSpin();
    spinStart(s, 0, 0);
    spinMove(s, 200, 0);
    const held = s.ry;
    run(s, 120);
    expect(s.ry).toBe(held);
  });

  test("a pause before release bleeds off the flick, so the sub only eases home", () => {
    const s = createSpin();
    spinStart(s, 0, 0);
    spinMove(s, 100, 0); // ry = 0.6
    run(s, 120); // held for two seconds
    spinEnd(s);
    let last = s.ry;
    for (let i = 0; i < 60; i += 1) {
      spinStep(s, FRAME);
      expect(s.ry).toBeLessThanOrEqual(last + 1e-9);
      last = s.ry;
    }
  });

  test("motion is close to frame-rate independent", () => {
    const at60 = flick();
    const at30 = flick();
    run(at60, 30, 1 / 60);
    run(at30, 15, 1 / 30);
    expect(at30.ry).toBeCloseTo(at60.ry, 1);
  });
});
