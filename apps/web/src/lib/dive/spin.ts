/**
 * Drag-to-spin with inertia for the seafloor sub, ported from the old
 * PlaygroundIsland maths: a drag turns by the pointer delta, release keeps the
 * last move's velocity and lets it decay. Mutates in place — it runs in
 * useFrame, which should not allocate.
 */
export type Spin = { rx: number; ry: number; vx: number; vy: number; dragging: boolean; lx: number; ly: number };

const RAD_PER_PX = 0.006;
/** Velocity kept per 1/60 s. */
const DECAY = 0.94;
const LAMBDA = -Math.log(DECAY) * 60;
/** Per-second rate at which the sub eases home outside the seafloor. */
const HOME = 3;

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

export const spinStep = (s: Spin, dt: number, active: boolean) => {
  if (!active) {
    // Wrap first so two full turns ease home as a small correction, not an unwind.
    const k = 1 - Math.exp(-HOME * dt);
    s.dragging = false;
    s.vx = s.vy = 0;
    s.rx = wrap(s.rx) * (1 - k);
    s.ry = wrap(s.ry) * (1 - k);
    return;
  }
  const d = Math.exp(-LAMBDA * dt);
  // Exact integral of the decaying velocity over dt, so 30 fps and 60 fps land
  // in the same place. Velocity decays while held too: a pause kills the flick.
  if (!s.dragging) {
    const travel = (60 * (1 - d)) / LAMBDA;
    s.rx += s.vx * travel;
    s.ry += s.vy * travel;
  }
  s.vx *= d;
  s.vy *= d;
};
