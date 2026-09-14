/**
 * Drag-to-spin with inertia for the sub, ported from the old PlaygroundIsland
 * maths: a drag turns by the pointer delta, release keeps the last move's
 * velocity and lets it decay, and a released sub eases back home the short
 * way round so it never stays upside-down. Mutates in place — it runs in
 * useFrame, which should not allocate.
 */
export type Spin = { rx: number; ry: number; vx: number; vy: number; dragging: boolean; lx: number; ly: number };

const RAD_PER_PX = 0.006;
/** Velocity kept per 1/60 s. */
const DECAY = 0.94;
const LAMBDA = -Math.log(DECAY) * 60;
/** Per-second rate at which a released sub eases home. */
const HOME = 1.2;

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

export const createSpin = (): Spin => ({ rx: 0, ry: 0, vx: 0, vy: 0, dragging: false, lx: 0, ly: 0 });

export const spinStart = (s: Spin, x: number, y: number) => {
  s.dragging = true;
  s.lx = x;
  s.ly = y;
};

export const spinMove = (s: Spin, x: number, y: number) => {
  if (!s.dragging) return;
  s.vy = (x - s.lx) * RAD_PER_PX;
  s.vx = (y - s.ly) * RAD_PER_PX;
  s.lx = x;
  s.ly = y;
  s.ry += s.vy;
  s.rx += s.vx;
};

export const spinEnd = (s: Spin) => {
  s.dragging = false;
};

export const spinStep = (s: Spin, dt: number) => {
  const d = Math.exp(-LAMBDA * dt);
  if (!s.dragging) {
    // Exact integral of the decaying velocity over dt, so 30 fps and 60 fps
    // flicks travel alike; then the homing pull, on the wrapped angle.
    const travel = (60 * (1 - d)) / LAMBDA;
    const k = Math.exp(-HOME * dt);
    s.rx = wrap(s.rx + s.vx * travel) * k;
    s.ry = wrap(s.ry + s.vy * travel) * k;
  }
  // Velocity decays while held too: a pause kills the flick.
  s.vx *= d;
  s.vy *= d;
};
