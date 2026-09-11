# Deep Dive Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the landing page with a single scroll-driven "deep-sea dive" story: one persistent R3F ocean scene, six pinned chapters, a HUD with depth readout and rail, dark-only.

**Architecture:** A module-level depth store is written by one GSAP ScrollTrigger over `<main>` and read by the R3F scene (`useFrame`) and the HUD (subscribe). Each chapter is a server component that renders content into a client `ChapterFrame`, which pins its stage and runs a per-chapter GSAP timeline looked up by chapter id. Lenis provides smooth scroll; Framer Motion stays only for hover/gesture springs.

**Tech Stack:** Next.js 16 (App Router, RSC), React 19, Tailwind 4, GSAP 3.15 + ScrollTrigger + `@gsap/react`, Lenis 1.3, `@react-three/fiber` 9 + `three` 0.184 + `@react-three/drei` 10, Vitest 5, Prisma (read-only, unchanged).

**Spec:** `docs/superpowers/specs/2026-09-11-deep-dive-journey-design.md`

## Global Constraints

- All commands run from `apps/web` (there is no root `package.json`; `AGENTS.md` is stale on that point). Prefix every command below with `cd apps/web` if you are at the repo root.
- Branch `feat/deep-dive` off `development`. Never push to or force-push `development`/`main`. Open the PR only in the last task.
- Commit messages: conventional commits (`feat(dive): …`, `refactor(dive): …`, `chore(deps): …`, `docs: …`), imperative subject under 70 chars. Every commit message ends with these two trailer lines:
  ```
  Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_014eSQEHBBZz1W5ejoKk3F32
  ```
- Dark-only. `--accent` is the fixed lime `#D7FF3E`; `--hud` is cyan `#3EE0C8`. Fonts unchanged (Syne / Space Grotesk / Space Mono via the existing `--font-*` variables).
- `MAX_DEPTH_M = 4000`. Depth = `round(progress × 4000)`. Chapter progress ranges are **derived from beats** (cumulative `beats / totalBeats`), so the metre ranges in the spec's §4.2 table are approximate; the derived ranges are the truth.
- Chapter order and ids are fixed: `surface, reef, twilight, descent, midnight, seafloor`. Section ids are `dive-<id>`. Nothing hard-codes a chapter name outside `src/constants/dive.ts`.
- Every pinned section has an explicit height `calc(var(--beats) * 100svh)` in server HTML; pins use `pinSpacing: false`.
- No Prisma schema, seed, env, or `db push` changes. No `useEffect + fetch`. `next/image` + WebP for local images; CDN skill logos stay plain `<img>` (existing rule).
- `prefers-reduced-motion: reduce`: no Lenis, no pins, no canvas; all content visible.
- Atomic layering: `sections → organisms → molecules → atoms/ui`. `components/three/dive/*` are R3F leaf components and may only be imported by `DiveScene`.
- Lint + type-check must be green at the end of every task: `npm run lint && npx tsc --noEmit`.

---

## File structure (locked)

```
apps/web/
  vitest.config.ts                                   Vitest, node env, src/**/*.test.ts
  src/constants/dive.ts                              CHAPTERS, MAX_DEPTH_M, DIVE_COPY, SUB_POSES, WATER_STOPS
  src/lib/dive/depth.ts        (+ depth.test.ts)     chapterRanges, depthForProgress, chapterAt, localProgress, dive store
  src/lib/dive/pose.ts         (+ pose.test.ts)      poseAt(progress, ranges) — submersible keyframe interpolation
  src/lib/dive/water.ts        (+ water.test.ts)     waterAt(progress) — top/bottom colours + fog density
  src/lib/dive/sonar.ts        (+ sonar.test.ts)     blipPosition(index, count, ring)
  src/lib/dive/timelines.ts                          TIMELINES: Record<ChapterId, TimelineBuilder> (client-only GSAP)
  src/hooks/useWibClock.ts                           "HH:MM:SS WIB" string, 1 s tick
  src/hooks/useDive.ts                               useDiveSnapshot() — React subscription to the store (HUD only)
  src/components/atoms/ScrollCue.tsx                 "[ SCROLL TO DIVE ]" button
  src/components/atoms/ChapterHead.tsx               "02 · WORK  DIVE SITES" header line
  src/components/molecules/RecordPanel.tsx           hairline panel with label|value rows
  src/components/molecules/DiveSiteRecord.tsx        one project (Reef)
  src/components/molecules/DescentLogEntry.tsx       one experience (Descent)
  src/components/molecules/SonarReadout.tsx          readout panel for the hovered blip (Midnight)
  src/components/organisms/DiveShell.tsx             Lenis + global depth trigger + hash scroll + data-chapter on <html>
  src/components/organisms/ChapterFrame.tsx          client pin + timeline per chapter
  src/components/organisms/DiveHud.tsx               top bar + right rail (mode "dive" | "surface")
  src/components/organisms/DiveScene.tsx             dynamic R3F <Canvas> + composition of three/dive/*
  src/components/organisms/SonarChart.tsx            SVG sonar with blips → SonarReadout
  src/components/three/dive/Water.tsx                fullscreen gradient shader + fog
  src/components/three/dive/Submersible.tsx          procedural sub, pose from poseAt, drag at seafloor
  src/components/three/dive/Sunrays.tsx
  src/components/three/dive/MarineSnow.tsx
  src/components/three/dive/Bioluminescence.tsx
  src/components/three/dive/Seafloor.tsx
  src/components/sections/dive/SurfaceChapter.tsx    (server) hero
  src/components/sections/dive/ReefChapter.tsx       (server) projects
  src/components/sections/dive/TwilightChapter.tsx   (server) about
  src/components/sections/dive/DescentChapter.tsx    (server) career
  src/components/sections/dive/MidnightChapter.tsx   (server) toolbox
  src/components/sections/dive/SeafloorChapter.tsx   (server) contact
  src/app/page.tsx                                   composition
  src/app/layout.tsx                                 dark-only, no ThemeProvider
  src/app/globals.css                                single palette + water/hud tokens + dive keyframes
  scripts/dive-shots.mjs                             Playwright screenshot pass
```

---

### Task 1: Branch, dependencies, Vitest

**Files:**
- Create: `apps/web/vitest.config.ts`
- Create: `apps/web/src/lib/dive/smoke.test.ts` (deleted again in Task 2)
- Modify: `apps/web/package.json`

**Interfaces:**
- Produces: `npm test` (Vitest, `src/**/*.test.ts`), packages `gsap`, `@gsap/react`, `lenis` available.

- [ ] **Step 1: Create the branch**

```bash
git checkout development && git pull && git checkout -b feat/deep-dive
```

- [ ] **Step 2: Install dependencies**

```bash
cd apps/web
npm i gsap@^3.15.0 @gsap/react@^2.1.2 lenis@^1.3.26
npm i -D vitest@^5.0.0
```

- [ ] **Step 3: Add the test script**

In `apps/web/package.json` `"scripts"`, add after `"lint"`:

```json
"test": "vitest run",
```

- [ ] **Step 4: Write `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: { environment: "node", include: ["src/**/*.test.ts"] },
});
```

- [ ] **Step 5: Write a smoke test**

`src/lib/dive/smoke.test.ts`:

```ts
import { expect, test } from "vitest";
test("vitest runs", () => expect(1 + 1).toBe(2));
```

- [ ] **Step 6: Run it**

Run: `npm test`
Expected: `1 passed`.

- [ ] **Step 7: Lint + type-check, then commit**

```bash
npm run lint && npx tsc --noEmit
git add package.json package-lock.json vitest.config.ts src/lib/dive/smoke.test.ts
git commit -m "chore(deps): add gsap, lenis and vitest for the deep-dive journey"
```

---

### Task 2: Chapter registry + depth store

**Files:**
- Create: `apps/web/src/constants/dive.ts`
- Create: `apps/web/src/lib/dive/depth.ts`, `apps/web/src/lib/dive/depth.test.ts`
- Delete: `apps/web/src/lib/dive/smoke.test.ts`

**Interfaces:**
- Produces:
  - `type ChapterId = "surface" | "reef" | "twilight" | "descent" | "midnight" | "seafloor"`
  - `CHAPTERS: readonly { id: ChapterId; index: number; name: string; label: string; beats: number }[]` (reef/descent `beats` are defaults, overridden at runtime)
  - `MAX_DEPTH_M = 4000`
  - `type Range = { id: ChapterId; start: number; end: number }` (progress 0..1)
  - `chapterRanges(beats: number[]): Range[]`
  - `depthForProgress(p: number): number`
  - `chapterAt(p: number, ranges: Range[]): ChapterId`
  - `localProgress(p: number, ranges: Range[]): { id: ChapterId; t: number }`
  - `dive` store: `{ configure(beats: number[]): void; set(progress: number): void; get(): DiveState; subscribe(cb: (s: DiveState) => void): () => void }` with `DiveState = { progress: number; depth: number; chapter: ChapterId; ranges: Range[] }`

- [ ] **Step 1: Write `src/constants/dive.ts`**

```ts
export const MAX_DEPTH_M = 4000;

export const CHAPTER_IDS = [
  "surface",
  "reef",
  "twilight",
  "descent",
  "midnight",
  "seafloor",
] as const;
export type ChapterId = (typeof CHAPTER_IDS)[number];

export type Chapter = {
  id: ChapterId;
  index: number;
  /** Rail / HUD word, e.g. "REEF". */
  name: string;
  /** Chapter subtitle, e.g. "DIVE SITES". */
  label: string;
  /** Chapter head word (the content category). */
  category: string;
  /** Viewport-heights the pinned stage scrolls. reef/descent are replaced by data length. */
  beats: number;
};

export const CHAPTERS: readonly Chapter[] = [
  { id: "surface", index: 0, name: "SURFACE", label: "DEEP FIELD", category: "HERO", beats: 1 },
  { id: "reef", index: 1, name: "REEF", label: "DIVE SITES", category: "WORK", beats: 5 },
  { id: "twilight", index: 2, name: "TWILIGHT", label: "DIVER RECORD", category: "ABOUT", beats: 1.5 },
  { id: "descent", index: 3, name: "DESCENT", label: "DESCENT LOG", category: "CAREER", beats: 3 },
  { id: "midnight", index: 4, name: "MIDNIGHT", label: "SONAR", category: "TOOLBOX", beats: 1.5 },
  { id: "seafloor", index: 5, name: "SEAFLOOR", label: "SURFACE LINK", category: "CONTACT", beats: 1 },
];

export const sectionId = (id: ChapterId) => `dive-${id}`;

export const DIVE_COPY = {
  brand: "DEEP DIVE",
  scrollCue: "[ SCROLL TO DIVE ]",
  path: "Front-end → Full-stack",
  base: "Tangerang Selatan, ID",
  sonarIdle: "AWAITING CONTACT · HOVER A BLIP",
  dragCue: "DRAG THE SUB — IT'S YOURS TO SPIN",
  contactHeadline: "Have something worth building?",
  contactSub: "LET'S BUILD SOMETHING GOOD.",
  builtIn: "BUILT WITH CURIOSITY IN TANGERANG SELATAN",
  backToSurface: "↑ BACK TO SURFACE",
} as const;
```

- [ ] **Step 2: Write the failing tests `src/lib/dive/depth.test.ts`**

```ts
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
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module './depth'`.

- [ ] **Step 4: Write `src/lib/dive/depth.ts`**

```ts
import { CHAPTERS, MAX_DEPTH_M, type ChapterId } from "@/constants/dive";

export type Range = { id: ChapterId; start: number; end: number };

export type DiveState = {
  progress: number;
  depth: number;
  chapter: ChapterId;
  ranges: Range[];
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Progress ranges per chapter, proportional to beats. */
export function chapterRanges(beats: number[]): Range[] {
  const total = beats.reduce((a, b) => a + b, 0);
  let acc = 0;
  return CHAPTERS.map((c, i) => {
    const start = acc / total;
    acc += beats[i] ?? c.beats;
    return { id: c.id, start, end: i === CHAPTERS.length - 1 ? 1 : acc / total };
  });
}

export const depthForProgress = (p: number) => Math.round(clamp01(p) * MAX_DEPTH_M);

export function localProgress(p: number, ranges: Range[]): { id: ChapterId; t: number } {
  const x = clamp01(p);
  const r =
    ranges.find((r, i) => x >= r.start && (x < r.end || i === ranges.length - 1)) ??
    ranges[ranges.length - 1];
  const span = r.end - r.start || 1;
  return { id: r.id, t: clamp01((x - r.start) / span) };
}

export const chapterAt = (p: number, ranges: Range[]) => localProgress(p, ranges).id;

/* ---- store ---- */
type Listener = (s: DiveState) => void;

let ranges = chapterRanges(CHAPTERS.map((c) => c.beats));
let state: DiveState = { progress: 0, depth: 0, chapter: "surface", ranges };
const listeners = new Set<Listener>();

export const dive = {
  configure(beats: number[]) {
    ranges = chapterRanges(beats);
    state = { ...state, ranges, chapter: chapterAt(state.progress, ranges) };
  },
  set(progress: number) {
    const p = clamp01(progress);
    if (p === state.progress) return;
    state = { progress: p, depth: depthForProgress(p), chapter: chapterAt(p, ranges), ranges };
    listeners.forEach((l) => l(state));
  },
  get: () => state,
  subscribe(cb: Listener) {
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  },
};
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: all `depth.test.ts` tests PASS.

- [ ] **Step 6: Remove the smoke test, lint, commit**

```bash
git rm src/lib/dive/smoke.test.ts
npm run lint && npx tsc --noEmit
git add src/constants/dive.ts src/lib/dive/depth.ts src/lib/dive/depth.test.ts
git commit -m "feat(dive): chapter registry and depth store"
```

---

### Task 3: Pure scene maths — pose, water, sonar

**Files:**
- Create: `apps/web/src/lib/dive/pose.ts` + `pose.test.ts`
- Create: `apps/web/src/lib/dive/water.ts` + `water.test.ts`
- Create: `apps/web/src/lib/dive/sonar.ts` + `sonar.test.ts`
- Modify: `apps/web/src/constants/dive.ts` (append `SUB_POSES`, `WATER_STOPS`)

**Interfaces:**
- Produces:
  - `type Pose = { x: number; y: number; scale: number; rotZ: number; lamp: number }`
  - `SUB_POSES: Record<ChapterId, Pose>`
  - `poseAt(p: number, ranges: Range[]): Pose` — lerps pose[chapter] → pose[next] on eased local t
  - `WATER_STOPS: { at: number; top: string; bottom: string; fog: number }[]` (at = progress)
  - `waterAt(p: number): { top: [r,g,b]; bottom: [r,g,b]; fog: number }` (0..1 floats)
  - `blipPosition(index: number, count: number, ringRadius: number, cx?: number, cy?: number): { x: number; y: number; angle: number }`

- [ ] **Step 1: Append to `src/constants/dive.ts`**

```ts
export type Pose = { x: number; y: number; scale: number; rotZ: number; lamp: number };

/** Submersible target pose per chapter (scene units at z=0, camera z=8 fov=40). */
export const SUB_POSES: Record<ChapterId, Pose> = {
  surface: { x: 2.4, y: 0.6, scale: 1, rotZ: 0, lamp: 0 },
  reef: { x: 2.8, y: -0.2, scale: 0.9, rotZ: -0.105, lamp: 0.6 },
  twilight: { x: -2.6, y: 0.2, scale: 1, rotZ: 0.07, lamp: 1.2 },
  descent: { x: 0, y: 1.5, scale: 0.8, rotZ: 0, lamp: 1.8 },
  midnight: { x: 0, y: 0.4, scale: 0.55, rotZ: 0, lamp: 2.5 },
  seafloor: { x: 0, y: -1.4, scale: 1, rotZ: 0, lamp: 3 },
};

/** Water gradient + fog density along progress (spec §7 palette). */
export const WATER_STOPS = [
  { at: 0, top: "#0e4a6e", bottom: "#083352", fog: 0.02 },
  { at: 0.25, top: "#06263f", bottom: "#041a2c", fog: 0.045 },
  { at: 0.5, top: "#03141f", bottom: "#020c14", fog: 0.07 },
  { at: 0.75, top: "#020a10", bottom: "#010508", fog: 0.095 },
  { at: 1, top: "#010508", bottom: "#000203", fog: 0.12 },
] as const;
```

- [ ] **Step 2: Write failing tests**

`src/lib/dive/pose.test.ts`:

```ts
import { expect, test } from "vitest";
import { chapterRanges } from "./depth";
import { poseAt } from "./pose";
import { SUB_POSES } from "@/constants/dive";

const r = chapterRanges([1, 5, 1.5, 3, 1.5, 1]);

test("start of a chapter is exactly that chapter's pose", () => {
  expect(poseAt(0, r)).toEqual(SUB_POSES.surface);
  expect(poseAt(r[2].start, r)).toEqual(SUB_POSES.twilight);
});

test("end of the last chapter holds the seafloor pose", () => {
  expect(poseAt(1, r)).toEqual(SUB_POSES.seafloor);
});

test("midway through a chapter is between the two poses", () => {
  const mid = (r[0].start + r[0].end) / 2;
  const p = poseAt(mid, r);
  expect(p.x).toBeGreaterThan(SUB_POSES.surface.x);
  expect(p.x).toBeLessThan(SUB_POSES.reef.x);
});
```

`src/lib/dive/water.test.ts`:

```ts
import { expect, test } from "vitest";
import { waterAt } from "./water";

test("progress 0 returns the first stop as 0..1 rgb", () => {
  const w = waterAt(0);
  expect(w.top.map((c) => Math.round(c * 255))).toEqual([14, 74, 110]);
  expect(w.fog).toBe(0.02);
});

test("progress 1 returns the last stop", () => {
  expect(waterAt(1).fog).toBe(0.12);
});

test("halfway between stops interpolates", () => {
  expect(waterAt(0.125).fog).toBeCloseTo(0.0325);
});
```

`src/lib/dive/sonar.test.ts`:

```ts
import { expect, test } from "vitest";
import { blipPosition } from "./sonar";

test("blips are evenly spaced starting at the top", () => {
  const a = blipPosition(0, 4, 100, 0, 0);
  const b = blipPosition(1, 4, 100, 0, 0);
  expect(a.angle).toBe(-90);
  expect(b.angle).toBe(0);
  expect(a.x).toBeCloseTo(0);
  expect(a.y).toBeCloseTo(-100);
  expect(b.x).toBeCloseTo(100);
  expect(b.y).toBeCloseTo(0);
});

test("centre offset is applied", () => {
  expect(blipPosition(0, 1, 50, 320, 320)).toMatchObject({ x: 320, y: 270 });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — modules `./pose`, `./water`, `./sonar` not found.

- [ ] **Step 4: Implement**

`src/lib/dive/pose.ts`:

```ts
import { CHAPTERS, SUB_POSES, type Pose } from "@/constants/dive";
import { localProgress, type Range } from "./depth";

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function poseAt(p: number, ranges: Range[]): Pose {
  const { id, t } = localProgress(p, ranges);
  const i = CHAPTERS.findIndex((c) => c.id === id);
  const from = SUB_POSES[id];
  const next = CHAPTERS[i + 1];
  if (!next) return { ...from };
  const to = SUB_POSES[next.id];
  const e = easeInOut(t);
  return {
    x: lerp(from.x, to.x, e),
    y: lerp(from.y, to.y, e),
    scale: lerp(from.scale, to.scale, e),
    rotZ: lerp(from.rotZ, to.rotZ, e),
    lamp: lerp(from.lamp, to.lamp, e),
  };
}
```

`src/lib/dive/water.ts`:

```ts
import { WATER_STOPS } from "@/constants/dive";

export type Rgb = [number, number, number];

export const hexToRgb = (hex: string): Rgb => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const mix = (a: Rgb, b: Rgb, t: number): Rgb => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

export function waterAt(p: number): { top: Rgb; bottom: Rgb; fog: number } {
  const x = Math.min(1, Math.max(0, p));
  let i = 0;
  while (i < WATER_STOPS.length - 2 && x > WATER_STOPS[i + 1].at) i++;
  const a = WATER_STOPS[i];
  const b = WATER_STOPS[i + 1];
  const t = (x - a.at) / (b.at - a.at);
  return {
    top: mix(hexToRgb(a.top), hexToRgb(b.top), t),
    bottom: mix(hexToRgb(a.bottom), hexToRgb(b.bottom), t),
    fog: a.fog + (b.fog - a.fog) * t,
  };
}
```

`src/lib/dive/sonar.ts`:

```ts
/** Evenly spaced blip on a ring, index 0 at 12 o'clock, clockwise. */
export function blipPosition(
  index: number,
  count: number,
  ringRadius: number,
  cx = 0,
  cy = 0
): { x: number; y: number; angle: number } {
  const angle = -90 + (360 / Math.max(1, count)) * index;
  const rad = (angle * Math.PI) / 180;
  return { x: cx + Math.cos(rad) * ringRadius, y: cy + Math.sin(rad) * ringRadius, angle };
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: all PASS (depth, pose, water, sonar).

- [ ] **Step 6: Lint + commit**

```bash
npm run lint && npx tsc --noEmit
git add src/constants/dive.ts src/lib/dive
git commit -m "feat(dive): submersible pose, water palette and sonar geometry"
```

---

### Task 4: HUD + scroll engine with placeholder chapters

**Files:**
- Create: `src/hooks/useWibClock.ts`, `src/hooks/useDive.ts`
- Create: `src/components/organisms/DiveShell.tsx`, `src/components/organisms/DiveHud.tsx`, `src/components/organisms/ChapterFrame.tsx`
- Create: `src/lib/dive/timelines.ts` (empty builders for now)
- Create: `src/components/atoms/ChapterHead.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css` (append chapter layout rules)

**Interfaces:**
- Produces:
  - `useWibClock(): string`
  - `useDiveSnapshot(): DiveState`
  - `<DiveShell beats={number[]}>{children}</DiveShell>` — sets up Lenis, global trigger, exposes `scrollToChapter` via `window.__diveScrollTo`? **No.** Exposes it through a module: `src/lib/dive/scroll.ts` → `export const scroller = { to(id: ChapterId): void }` set by DiveShell.
  - `<ChapterFrame id beats className?>{children}</ChapterFrame>` renders `<section id="dive-<id>" data-chapter=… class="chapter" style="--beats"><div data-stage class="stage">…</div></section>` and runs `TIMELINES[id]`.
  - `type TimelineBuilder = (tl: gsap.core.Timeline, q: gsap.utils.SelectorFunc, section: HTMLElement) => void`
  - `<DiveHud mode="dive" | "surface" />`
  - `<ChapterHead index category label />`

- [ ] **Step 1: `src/hooks/useWibClock.ts`**

```ts
"use client";
import { useEffect, useState } from "react";

export function useWibClock() {
  const [clock, setClock] = useState("");
  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("en-GB", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " WIB"
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return clock;
}
```

- [ ] **Step 2: `src/hooks/useDive.ts`**

```ts
"use client";
import { useSyncExternalStore } from "react";
import { dive, type DiveState } from "@/lib/dive/depth";

export const useDiveSnapshot = (): DiveState =>
  useSyncExternalStore(dive.subscribe, dive.get, dive.get);
```

- [ ] **Step 3: `src/lib/dive/scroll.ts`**

```ts
import type { ChapterId } from "@/constants/dive";

type To = (id: ChapterId) => void;
let impl: To = () => {};

/** DiveShell installs the Lenis implementation; everything else just calls scroller.to(). */
export const scroller = {
  install: (fn: To) => {
    impl = fn;
  },
  to: (id: ChapterId) => impl(id),
};
```

- [ ] **Step 4: `src/lib/dive/timelines.ts` (placeholders; filled per chapter in later tasks)**

```ts
import type { gsap } from "gsap";
import type { ChapterId } from "@/constants/dive";

export type TimelineBuilder = (
  tl: gsap.core.Timeline,
  q: gsap.utils.SelectorFunc,
  section: HTMLElement
) => void;

const noop: TimelineBuilder = () => {};

export const TIMELINES: Record<ChapterId, TimelineBuilder> = {
  surface: noop,
  reef: noop,
  twilight: noop,
  descent: noop,
  midnight: noop,
  seafloor: noop,
};
```

- [ ] **Step 5: `src/components/organisms/DiveShell.tsx`**

```tsx
"use client";

import { useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { CHAPTER_IDS, sectionId, type ChapterId } from "@/constants/dive";
import { dive } from "@/lib/dive/depth";
import { scroller } from "@/lib/dive/scroll";

gsap.registerPlugin(ScrollTrigger);

type DiveShellProps = { beats: number[]; children: ReactNode };

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Scroll engine for the journey: Lenis smooth scroll wired into GSAP's ticker,
 * one scrubbed ScrollTrigger over <main> that feeds the depth store, hash →
 * chapter scrolling, and `data-chapter` on <html> for the CSS water fallback.
 */
export const DiveShell = ({ beats, children }: DiveShellProps) => {
  useEffect(() => {
    dive.configure(beats);
  }, [beats]);

  useEffect(() => {
    const root = document.documentElement;
    const unsub = dive.subscribe((s) => {
      if (root.dataset.chapter !== s.chapter) root.dataset.chapter = s.chapter;
    });
    root.dataset.chapter = dive.get().chapter;
    return () => {
      unsub();
      delete root.dataset.chapter;
    };
  }, []);

  useEffect(() => {
    const main = document.getElementById("main-content");
    if (!main) return;

    let lenis: Lenis | null = null;
    let raf: ((t: number) => void) | null = null;

    if (!reduced()) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false });
      lenis.on("scroll", ScrollTrigger.update);
      raf = (t) => lenis?.raf(t * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    const trigger = ScrollTrigger.create({
      trigger: main,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => dive.set(self.progress),
    });

    scroller.install((id: ChapterId) => {
      const target = `#${sectionId(id)}`;
      if (lenis) lenis.scrollTo(target, { duration: 1.2 });
      else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    });

    const hash = window.location.hash.replace("#dive-", "") as ChapterId;
    if (CHAPTER_IDS.includes(hash)) {
      requestAnimationFrame(() => {
        if (lenis) lenis.scrollTo(`#${sectionId(hash)}`, { immediate: true });
        else document.getElementById(sectionId(hash))?.scrollIntoView();
      });
    }

    return () => {
      trigger.kill();
      scroller.install(() => {});
      if (raf) gsap.ticker.remove(raf);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
};
```

- [ ] **Step 6: `src/components/organisms/ChapterFrame.tsx`**

```tsx
"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { sectionId, type ChapterId } from "@/constants/dive";
import { TIMELINES } from "@/lib/dive/timelines";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ChapterFrameProps = {
  id: ChapterId;
  beats: number;
  className?: string;
  children: ReactNode;
};

/**
 * One chapter of the dive. The section is `beats × 100svh` tall (server HTML,
 * so no CLS); the inner stage is pinned for that distance and the chapter's
 * timeline (looked up by id) is scrubbed across it. Reduced motion: no pin,
 * every `[data-reveal]` is simply visible.
 */
export const ChapterFrame = ({ id, beats, className, children }: ChapterFrameProps) => {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = ref.current;
      if (!section) return;
      const stage = section.querySelector<HTMLElement>("[data-stage]");
      const mm = gsap.matchMedia();
      mm.add(
        { full: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          if (ctx.conditions?.reduced) {
            gsap.set(section.querySelectorAll("[data-reveal]"), { opacity: 1, y: 0, x: 0 });
            return;
          }
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
              pin: stage,
              pinSpacing: false,
            },
          });
          TIMELINES[id](tl, gsap.utils.selector(section), section);
        }
      );
      return () => mm.revert();
    },
    { scope: ref, dependencies: [id] }
  );

  return (
    <section
      ref={ref}
      id={sectionId(id)}
      data-chapter={id}
      className={cn("chapter", className)}
      style={{ "--beats": beats } as CSSProperties}
    >
      <div data-stage className="stage">
        {children}
      </div>
    </section>
  );
};
```

- [ ] **Step 7: `src/components/atoms/ChapterHead.tsx`**

```tsx
type ChapterHeadProps = { index: number; category: string; label: string };

/** "02 · WORK   DIVE SITES" — the mono orientation line at the top of a stage. */
export const ChapterHead = ({ index, category, label }: ChapterHeadProps) => (
  <p className="chapter-head" data-reveal>
    <span className="text-accent">{String(index).padStart(2, "0")} · {category}</span>
    <span className="ml-4 text-muted-foreground">{label}</span>
  </p>
);
```

- [ ] **Step 8: `src/components/organisms/DiveHud.tsx`**

```tsx
"use client";

import Link from "next/link";

import { TerminalLogo } from "@/components/atoms/TerminalLogo";
import { CHAPTERS, DIVE_COPY, sectionId } from "@/constants/dive";
import { useDiveSnapshot } from "@/hooks/useDive";
import { useWibClock } from "@/hooks/useWibClock";
import { scroller } from "@/lib/dive/scroll";

type DiveHudProps = { mode?: "dive" | "surface" };

const pad4 = (n: number) => String(n).padStart(4, "0");

/**
 * Fixed HUD. `dive` mode (landing): brand · DIVE 0n · label · depth + clock,
 * plus the numbered rail on md+. `surface` mode (project pages): brand ·
 * BACK TO DIVE · clock, no rail.
 */
export const DiveHud = ({ mode = "dive" }: DiveHudProps) => {
  const clock = useWibClock();
  const snap = useDiveSnapshot();
  const chapter = CHAPTERS.find((c) => c.id === snap.chapter) ?? CHAPTERS[0];

  return (
    <>
      <div className="hud-bar">
        <div className="flex items-center gap-3">
          <TerminalLogo href="/" />
          <span className="hidden text-muted-foreground sm:inline">· {DIVE_COPY.brand}</span>
        </div>

        {mode === "dive" ? (
          <span className="hidden text-subtle md:inline">
            DIVE {String(chapter.index + 1).padStart(2, "0")} · {chapter.name}
          </span>
        ) : (
          <Link href={`/#${sectionId("reef")}`} className="text-subtle hover:text-accent">
            ← BACK TO DIVE
          </Link>
        )}

        <div className="flex items-center gap-4 tabular-nums">
          {mode === "dive" && (
            <span className="text-hud">{pad4(snap.depth)} m</span>
          )}
          <span className="hidden text-muted-foreground sm:inline">{clock}</span>
        </div>
      </div>

      {mode === "dive" && (
        <nav aria-label="Chapters" className="hud-rail">
          {CHAPTERS.map((c) => {
            const active = c.id === snap.chapter;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => scroller.to(c.id)}
                aria-current={active ? "true" : undefined}
                className={`hud-rail-item ${active ? "is-active" : ""}`}
              >
                <span className="hud-rail-name">{c.name}</span>
                <span aria-hidden className="hud-rail-line" />
                <span>{String(c.index + 1).padStart(2, "0")}</span>
              </button>
            );
          })}
        </nav>
      )}
    </>
  );
};
```

- [ ] **Step 9: Append HUD + chapter CSS to `src/app/globals.css`** (at the end of the file)

```css
/* ---- Deep Dive: HUD + chapter layout ---- */
:root {
  --hud: #3ee0c8;
  --hud-h: 40px;
}
.text-hud { color: var(--hud); }

.hud-bar {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 30;
  display: flex;
  height: var(--hud-h);
  align-items: center;
  justify-content: space-between;
  padding-inline: 1.5rem;
  font-family: var(--font-space-mono), "Space Mono", ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border);
  background: color-mix(in oklab, var(--background) 55%, transparent);
  backdrop-filter: blur(10px);
}
@media (min-width: 768px) { .hud-bar { padding-inline: 2.5rem; } }

.hud-rail {
  position: fixed;
  right: 1.5rem;
  top: 50%;
  z-index: 30;
  display: none;
  transform: translateY(-50%);
  flex-direction: column;
  gap: 14px;
  font-family: var(--font-space-mono), "Space Mono", ui-monospace, monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
}
@media (min-width: 768px) { .hud-rail { display: flex; right: 2.5rem; } }
.hud-rail-item {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  color: var(--muted-foreground);
  cursor: pointer;
  transition: color 200ms;
}
.hud-rail-item:hover, .hud-rail-item.is-active { color: var(--accent); }
.hud-rail-name, .hud-rail-line { opacity: 0; transition: opacity 250ms; }
.hud-rail-line { width: 22px; height: 1px; background: currentColor; }
.hud-rail-item.is-active .hud-rail-name,
.hud-rail-item.is-active .hud-rail-line { opacity: 1; }

.chapter {
  position: relative;
  height: calc(var(--beats, 1) * 100svh);
}
.stage {
  position: relative;
  box-sizing: border-box;
  height: 100svh;
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding: calc(var(--hud-h) + 1rem) 1.5rem 1.5rem;
  display: grid;
  align-content: center;
}
@media (min-width: 768px) { .stage { padding-inline: 2.5rem; } }
.chapter-head {
  margin: 0 0 1.25rem;
  font-family: var(--font-space-mono), "Space Mono", ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
```

- [ ] **Step 10: Replace `src/app/page.tsx` with the placeholder composition**

```tsx
// Re-render once per hour at most. Content rarely changes; ISR keeps the
// landing page fully static-cacheable while still picking up DB edits
// without a full redeploy.
export const revalidate = 3600;

import { ChapterHead } from "@/components/atoms/ChapterHead";
import { ChapterFrame } from "@/components/organisms/ChapterFrame";
import { DiveHud } from "@/components/organisms/DiveHud";
import { DiveShell } from "@/components/organisms/DiveShell";
import { GrainOverlay } from "@/components/atoms/GrainOverlay";
import { CHAPTERS } from "@/constants/dive";

export default function Home() {
  const beats = CHAPTERS.map((c) => c.beats);
  return (
    <>
      <GrainOverlay />
      <DiveHud />
      <main id="main-content" className="relative w-full">
        <DiveShell beats={beats}>
          {CHAPTERS.map((c) => (
            <ChapterFrame key={c.id} id={c.id} beats={c.beats}>
              <ChapterHead index={c.index} category={c.category} label={c.label} />
              <h2 className="font-heading text-[clamp(36px,5vw,72px)] uppercase leading-none">
                {c.name}
              </h2>
            </ChapterFrame>
          ))}
        </DiveShell>
      </main>
    </>
  );
}
```

- [ ] **Step 11: Run it and verify in the browser**

Run: `npm run dev`, open http://localhost:3000.
Check: page is ~13 viewports tall; each chapter word stays pinned while scrolling its span; HUD depth counts 0000 → 4000 m; rail highlights the current chapter and clicking a number scrolls there smoothly; `<html data-chapter>` changes (DevTools). Console has no GSAP warnings. `Navigation`/`Footer` are no longer rendered on `/` (they still compile; deleted in Task 5).

- [ ] **Step 12: Lint + type-check + commit**

```bash
npm run lint && npx tsc --noEmit && npm test
git add src/app/page.tsx src/app/globals.css src/hooks src/lib/dive src/components/organisms/DiveShell.tsx src/components/organisms/ChapterFrame.tsx src/components/organisms/DiveHud.tsx src/components/atoms/ChapterHead.tsx
git commit -m "feat(dive): scroll engine, pinned chapter frames and HUD"
```

---

### Task 5: Dark-only palette and removal of the old landing shell

**Files:**
- Modify: `src/app/globals.css` (palette block lines 1–135, `@layer base` html snap, keyframe pruning)
- Modify: `src/app/layout.tsx`
- Modify: `src/constants/config.ts`, `src/types/index.ts`, `src/lib/utils.ts`
- Modify: `.claude/skills/visual-craft/SKILL.md`
- Delete: `src/app/providers/ThemeProvider.tsx`, `src/components/atoms/{AccentPicker,Marquee,BackToTop}.tsx`, `src/components/organisms/{Navigation,Footer,PageWrapper,ProjectsScroll,AboutSection,ExperiencesList,Toolbox,ToolboxStage}.tsx`, `src/components/sections/{hero3d,projects,about,experiences,skills,playground}.tsx`, `src/components/molecules/{HeroParticles,HeroBodyIsland,PlaygroundIsland,ProjectTile,ExperienceCard,MagneticEmailButton,AvailabilityStatus}.tsx`

**Interfaces:**
- Produces: `:root` holds the dark palette; no `.dark` selector anywhere; `Theme` type and `ACCENTS`/`DEFAULT_ACCENT`/`AccentId`/`SECTION_IDS`/`ANIMATION_DELAYS` removed from `constants/config.ts`; `scrollToSection` removed from `lib/utils.ts`.

- [ ] **Step 1: Rewrite the palette in `globals.css`**

Replace everything from the `@property --accent` block through the end of the `.dark { … }` block (currently lines 8–135) with:

```css
/* ============================================================================
   Deep Dive — single dark palette. The site is dark-only; the accent is a
   constant lime that reads as bioluminescence against the water gradient.
   ============================================================================ */
:root {
  color-scheme: dark;
  --background: #0a0a0b;
  --foreground: #f2f0ea;
  --card: #111113;
  --card-foreground: #f2f0ea;
  --popover: #111113;
  --popover-foreground: #f2f0ea;
  --primary: #f2f0ea;
  --primary-foreground: #0a0a0b;
  --secondary: #1e1e21;
  --secondary-foreground: #f2f0ea;
  --muted: #161618;
  --muted-foreground: #8a8a85;
  --accent: #d7ff3e;
  --accent-foreground: #0a0a0b;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: rgba(242, 240, 234, 0.12);
  --input: #161618;
  --ring: #f2f0ea;
  --subtle: #b9b7b0;
  --surface: #161618;
  --chart-1: #f2f0ea;
  --chart-2: #9ca3af;
  --chart-3: #6b7280;
  --chart-4: #ef4444;
  --chart-5: #1e1e21;
  --aurora-1: #d946ef;
  --aurora-2: #8b5cf6;
  --aurora-3: #06b6d4;
  --aurora-4: #f59e0b;
  --radius: 0.5rem;
  --sidebar: #1e293b;
  --sidebar-foreground: #f3f4f6;
  --sidebar-primary: #f9fafb;
  --sidebar-primary-foreground: #111827;
  --sidebar-accent: #475569;
  --sidebar-accent-foreground: #f9fafb;
  --sidebar-border: #334155;
  --sidebar-ring: #9ca3af;

  /* `clip` (not `hidden`) so the root never becomes a scroll container. */
  overflow-x: clip;
}
```

Keep `@import`s and delete the `@custom-variant dark (...)` line (nothing uses `dark:` anymore; if `npm run lint`/build complains about a remaining `dark:` utility, remove that utility, not the variant).

- [ ] **Step 2: Remove the scroll-snap rule and the light scrollbar colours**

In `@layer base`, delete the `html { scroll-snap-type: y proximity; }` rule and its comment (Lenis + pins replace it). Replace the four `::-webkit-scrollbar*` rules with:

```css
::-webkit-scrollbar { width: 0.3em; height: 0.3em; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(242, 240, 234, 0.18); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(242, 240, 234, 0.32); }
```

- [ ] **Step 3: Rewrite `src/app/layout.tsx`**

Remove the `ThemeProvider` import and wrapper, the `themeInitScript` constant and its `<script>`, and make the theme colour single:

```tsx
export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};
```

Body of `RootLayout` becomes:

```tsx
return (
  <html lang="en" className="dark">
    <body className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable} font-body antialiased`}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-accent-foreground focus:rounded-md">
        Skip to main content
      </a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <QueryProvider>
        <TopProgressBar />
        {children}
      </QueryProvider>
      <Analytics />
    </body>
  </html>
);
```

Also update `description` in the same file to: `"A scroll-driven deep dive through my work, career and toolbox — software engineer shipping products end-to-end, from database schema to the last pixel."`

- [ ] **Step 4: Trim `src/constants/config.ts`**

Delete `ANIMATION_DELAYS`, `SECTION_IDS`, `ACCENTS`, `AccentId`, `DEFAULT_ACCENT`. Keep `EXTERNAL_LINKS`, `SITE_CONFIG`, `BREAKPOINTS`, `SKILL_CATEGORIES`, `SkillCategoryFilter`.

- [ ] **Step 5: Trim `src/types/index.ts` and `src/lib/utils.ts`**

Delete `export type Theme = "light" | "dark";` from types. Delete `scrollToSection` from utils (keep `cn`).

- [ ] **Step 6: Delete the old landing shell**

```bash
git rm src/app/providers/ThemeProvider.tsx \
  src/components/atoms/AccentPicker.tsx src/components/atoms/Marquee.tsx src/components/atoms/BackToTop.tsx \
  src/components/organisms/Navigation.tsx src/components/organisms/Footer.tsx src/components/organisms/PageWrapper.tsx \
  src/components/organisms/ProjectsScroll.tsx src/components/organisms/AboutSection.tsx src/components/organisms/ExperiencesList.tsx \
  src/components/organisms/Toolbox.tsx src/components/organisms/ToolboxStage.tsx \
  src/components/sections/hero3d.tsx src/components/sections/projects.tsx src/components/sections/about.tsx \
  src/components/sections/experiences.tsx src/components/sections/skills.tsx src/components/sections/playground.tsx \
  src/components/molecules/HeroParticles.tsx src/components/molecules/HeroBodyIsland.tsx src/components/molecules/PlaygroundIsland.tsx \
  src/components/molecules/ProjectTile.tsx src/components/molecules/ExperienceCard.tsx \
  src/components/molecules/MagneticEmailButton.tsx src/components/molecules/AvailabilityStatus.tsx
```

- [ ] **Step 7: Type-check and fix stragglers**

Run: `npx tsc --noEmit`
Expected: errors only from files that imported the deleted modules. For each: if the file is on the "kept" list (`ProjectPageContent`, `CvDownloadCard`, `ProfilePhoto`, `ToolboxCell`, `TerminalLogo`, `GrainOverlay`, `TopProgressBar`, `useTilt`, `useMagneticHover`), fix the import; otherwise `git rm` it too. `useTypingEffect.tsx` imports `ANIMATION_DELAYS` → `git rm src/hooks/useTypingEffect.tsx`.

Then: `npm run lint && npm run build`. Expected: clean build; `/` renders the placeholder chapters on the dark palette with no theme flash.

- [ ] **Step 8: Update the visual-craft skill**

In `.claude/skills/visual-craft/SKILL.md`, replace the bullet under "2. Aesthetics first" that starts with "**Both themes always:**" with:

```md
- **Dark-only, two backdrops:** the site has one palette, but the water behind a chapter ranges from `#0e4a6e` (surface) to `#000203` (seafloor). Check every surface at both extremes; hairlines use `--border` (alpha) so they read on any water shade.
```

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "refactor(dive): dark-only palette, drop theme toggle and old landing shell"
```

---

### Task 6: DiveScene — canvas, water and submersible

**Files:**
- Create: `src/components/three/dive/Water.tsx`, `src/components/three/dive/Submersible.tsx`
- Create: `src/components/organisms/DiveScene.tsx`
- Modify: `src/app/page.tsx` (mount `<DiveScene />`)
- Modify: `src/app/globals.css` (CSS water fallback per chapter)

**Interfaces:**
- Produces: `<DiveScene />` (client, `next/dynamic`, `ssr:false`). Reads `dive.get()` every frame. Returns `null` on reduced motion or when WebGL is unavailable.
- Consumes: `poseAt`, `waterAt`, `dive`.

- [ ] **Step 1: `src/components/three/dive/Water.tsx`**

```tsx
"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { dive } from "@/lib/dive/depth";
import { waterAt } from "@/lib/dive/water";

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.9999, 1.0); }
`;
const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform vec3 uTop; uniform vec3 uBottom; uniform float uTime;
  void main() {
    float band = sin((vUv.y * 9.0) + uTime * 0.25) * 0.012;
    vec3 c = mix(uBottom, uTop, smoothstep(0.0, 1.0, vUv.y + band));
    gl_FragColor = vec4(c, 1.0);
  }
`;

/** Full-screen gradient behind everything + scene fog, both driven by depth. */
export const Water = () => {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { scene } = useThree();
  const fog = useMemo(() => new THREE.FogExp2("#083352", 0.02), []);
  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color("#0e4a6e") },
      uBottom: { value: new THREE.Color("#083352") },
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((_, dt) => {
    const w = waterAt(dive.get().progress);
    uniforms.uTop.value.setRGB(...w.top);
    uniforms.uBottom.value.setRGB(...w.bottom);
    uniforms.uTime.value += dt;
    fog.color.setRGB(...w.bottom);
    fog.density = w.fog;
    if (scene.fog !== fog) scene.fog = fog;
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} depthWrite={false} depthTest={false} />
    </mesh>
  );
};
```

- [ ] **Step 2: `src/components/three/dive/Submersible.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { dive } from "@/lib/dive/depth";
import { poseAt } from "@/lib/dive/pose";

const ACCENT = "#d7ff3e";
const HULL = "#1c2430";
const TRIM = "#3b4756";

/**
 * Procedural submersible: capsule hull, porthole ring, two accent lamps with
 * spotlights, propeller guard, antenna. Position/scale/lamp come from poseAt
 * every frame, plus an idle bob and a small pointer parallax.
 */
export const Submersible = () => {
  const group = useRef<THREE.Group>(null);
  const lampA = useRef<THREE.SpotLight>(null);
  const lampB = useRef<THREE.SpotLight>(null);
  const glow = useRef<THREE.MeshBasicMaterial>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useFrame(({ clock, pointer: p }, dt) => {
    const g = group.current;
    if (!g) return;
    const s = dive.get();
    const pose = poseAt(s.progress, s.ranges);
    pointer.current.x += (p.x - pointer.current.x) * Math.min(1, dt * 3);
    pointer.current.y += (p.y - pointer.current.y) * Math.min(1, dt * 3);
    const t = clock.elapsedTime;
    g.position.set(pose.x, pose.y + Math.sin(t * 0.8) * 0.08, 0);
    g.rotation.set(pointer.current.y * -0.07, pointer.current.x * 0.07, pose.rotZ + Math.sin(t * 0.5) * 0.02);
    g.scale.setScalar(pose.scale);
    if (lampA.current) lampA.current.intensity = pose.lamp * 6;
    if (lampB.current) lampB.current.intensity = pose.lamp * 6;
    if (glow.current) glow.current.opacity = Math.min(1, 0.15 + pose.lamp * 0.3);
  });

  return (
    <group ref={group}>
      {/* hull */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.42, 1.5, 8, 24]} />
        <meshStandardMaterial color={HULL} metalness={0.6} roughness={0.35} />
      </mesh>
      {/* porthole ring + glass */}
      <mesh position={[0.55, 0.08, 0.36]} rotation={[0, 0.6, 0]}>
        <torusGeometry args={[0.16, 0.035, 12, 32]} />
        <meshStandardMaterial color={TRIM} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.55, 0.08, 0.36]} rotation={[0, 0.6, 0]}>
        <circleGeometry args={[0.14, 24]} />
        <meshBasicMaterial color="#9fe6ff" transparent opacity={0.35} />
      </mesh>
      {/* lamps */}
      {[0.22, -0.22].map((z, i) => (
        <group key={z} position={[1.05, -0.1, z]}>
          <mesh>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshBasicMaterial ref={i === 0 ? glow : undefined} color={ACCENT} transparent />
          </mesh>
          <spotLight ref={i === 0 ? lampA : lampB} color={ACCENT} angle={0.5} penumbra={0.6} distance={9} position={[0, 0, 0]} target-position={[4, -2, z]} />
        </group>
      ))}
      {/* propeller guard */}
      <mesh position={[-1.05, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.28, 0.03, 10, 28]} />
        <meshStandardMaterial color={TRIM} metalness={0.7} roughness={0.4} />
      </mesh>
      {/* antenna */}
      <mesh position={[-0.3, 0.55, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.5, 6]} />
        <meshStandardMaterial color={TRIM} />
      </mesh>
    </group>
  );
};
```

- [ ] **Step 3: `src/components/organisms/DiveScene.tsx`**

```tsx
"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./DiveScene.impl").then((m) => m.DiveSceneImpl), {
  ssr: false,
});

/** Fixed full-viewport ocean behind the chapters. Never in the first-paint bundle. */
export const DiveScene = () => <Scene />;
```

`src/components/organisms/DiveScene.impl.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";

import { Water } from "@/components/three/dive/Water";
import { Submersible } from "@/components/three/dive/Submersible";

const canRender = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
};

export const DiveSceneImpl = () => {
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(canRender()), []);
  if (!ok) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 40 }}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
      >
        <Water />
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 6, 4]} intensity={1.4} />
        <Submersible />
      </Canvas>
    </div>
  );
};
```

- [ ] **Step 4: Mount it and give chapters a stacking context**

In `src/app/page.tsx` add `import { DiveScene } from "@/components/organisms/DiveScene";` and render `<DiveScene />` right after `<DiveHud />`. Give `<main>` the class `relative z-10 w-full`.

- [ ] **Step 5: CSS water fallback per chapter (body background under the canvas + reduced-motion path)**

Append to `globals.css`:

```css
/* Water colour behind the canvas and the full fallback when the canvas is
   absent (reduced motion / no WebGL). Stepped per chapter via <html data-chapter>. */
body { background: #083352; transition: background-color 900ms ease; }
:root[data-chapter="surface"]  body { background: #083352; }
:root[data-chapter="reef"]     body { background: #041a2c; }
:root[data-chapter="twilight"] body { background: #020c14; }
:root[data-chapter="descent"]  body { background: #020a10; }
:root[data-chapter="midnight"] body { background: #010508; }
:root[data-chapter="seafloor"] body { background: #000203; }
```

- [ ] **Step 6: Verify in the browser**

Run `npm run dev`. Check: gradient water darkens as the depth readout climbs; the sub floats top-right on Surface, drifts to the left on Twilight, shrinks on Midnight, sinks on Seafloor; lamps brighten with depth; moving the mouse tilts the sub slightly. With DevTools → Rendering → "prefers-reduced-motion: reduce" and reload: no canvas, body colour still steps per chapter. Frame rate stays ≥ 55 fps on a laptop (Performance panel).

- [ ] **Step 7: Lint + commit**

```bash
npm run lint && npx tsc --noEmit
git add src/components/three src/components/organisms/DiveScene.tsx src/components/organisms/DiveScene.impl.tsx src/app/page.tsx src/app/globals.css
git commit -m "feat(dive): persistent R3F ocean with depth-driven water and submersible"
```

---

### Task 7: Surface chapter (hero) + RecordPanel + ScrollCue

**Files:**
- Create: `src/components/molecules/RecordPanel.tsx`, `src/components/atoms/ScrollCue.tsx`, `src/components/sections/dive/SurfaceChapter.tsx`
- Modify: `src/lib/dive/timelines.ts` (surface builder), `src/app/page.tsx`, `src/app/globals.css`

**Interfaces:**
- Produces:
  - `<RecordPanel title code? rows={{ label: string; value: ReactNode }[]} className? />`
  - `<ScrollCue />` (client button → `scroller.to("reef")`)
  - `<SurfaceChapter projectCount experiences />` (server)
  - `earliestYear(periods: string[]): number | null` in `src/lib/dive/career.ts` (+ test)

- [ ] **Step 1: Failing test for `earliestYear`** — `src/lib/dive/career.test.ts`

```ts
import { expect, test } from "vitest";
import { earliestYear } from "./career";

test("picks the smallest 4-digit year found in any period string", () => {
  expect(earliestYear(["Jan 2024 – Present", "Mar 2021 – Dec 2023", "2022"])).toBe(2021);
});
test("returns null when no year is present", () => {
  expect(earliestYear(["n/a"])).toBeNull();
});
```

Run `npm test` → FAIL (module not found).

- [ ] **Step 2: `src/lib/dive/career.ts`**

```ts
export function earliestYear(periods: string[]): number | null {
  const years = periods.flatMap((p) => (p.match(/\b(19|20)\d{2}\b/g) ?? []).map(Number));
  return years.length ? Math.min(...years) : null;
}
```

Run `npm test` → PASS.

- [ ] **Step 3: `src/components/molecules/RecordPanel.tsx`**

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Row = { label: string; value: ReactNode };
type RecordPanelProps = { title: string; code?: string; rows: Row[]; className?: string };

/** Hairline HUD panel: mono header ("DIVER RECORD ······ REC-01") + label|value rows. */
export const RecordPanel = ({ title, code, rows, className }: RecordPanelProps) => (
  <div className={cn("record-panel", className)} data-reveal>
    <div className="record-head">
      <span>{title}</span>
      <span aria-hidden className="record-rule" />
      {code && <span className="text-accent">{code}</span>}
    </div>
    <dl className="m-0">
      {rows.map((r) => (
        <div key={r.label} className="record-row">
          <dt>{r.label}</dt>
          <dd>{r.value}</dd>
        </div>
      ))}
    </dl>
  </div>
);
```

Append to `globals.css`:

```css
.record-panel {
  border: 1px solid var(--border);
  background: color-mix(in oklab, var(--card) 60%, transparent);
  backdrop-filter: blur(8px);
  font-family: var(--font-space-mono), "Space Mono", ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.record-head { display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-bottom: 1px solid var(--border); color: var(--subtle); }
.record-rule { flex: 1; height: 1px; background: var(--border); }
.record-row { display: flex; justify-content: space-between; gap: 24px; padding: 10px 16px; border-bottom: 1px solid var(--border); }
.record-row:last-child { border-bottom: 0; }
.record-row dt { margin: 0; color: var(--muted-foreground); }
.record-row dd { margin: 0; text-align: right; color: var(--foreground); text-transform: none; letter-spacing: 0.02em; }
```

- [ ] **Step 4: `src/components/atoms/ScrollCue.tsx`**

```tsx
"use client";

import { DIVE_COPY } from "@/constants/dive";
import { scroller } from "@/lib/dive/scroll";

export const ScrollCue = () => (
  <button
    type="button"
    onClick={() => scroller.to("reef")}
    className="mt-10 inline-flex cursor-pointer items-center font-mono text-xs tracking-[0.18em] text-muted-foreground transition-colors hover:text-accent"
    data-reveal
  >
    <span className="animate-blink text-accent">[</span>
    <span className="mx-2">{DIVE_COPY.scrollCue.slice(2, -2)}</span>
    <span className="animate-blink text-accent">]</span>
  </button>
);
```

- [ ] **Step 5: `src/components/sections/dive/SurfaceChapter.tsx`**

```tsx
import { ChapterHead } from "@/components/atoms/ChapterHead";
import { ScrollCue } from "@/components/atoms/ScrollCue";
import { RecordPanel } from "@/components/molecules/RecordPanel";
import { ChapterFrame } from "@/components/organisms/ChapterFrame";
import { CHAPTERS, DIVE_COPY } from "@/constants/dive";
import { earliestYear } from "@/lib/dive/career";
import type { ExperienceDto } from "@/server/queries/experiences";

type SurfaceChapterProps = { projectCount: number; experiences: ExperienceDto[] };

const chapter = CHAPTERS[0];

/** Hero. The H1 is static server HTML (LCP). */
export const SurfaceChapter = ({ projectCount, experiences }: SurfaceChapterProps) => {
  const since = earliestYear(experiences.map((e) => e.period));
  const years = since ? new Date().getFullYear() - since : null;

  return (
    <ChapterFrame id="surface" beats={chapter.beats}>
      <div className="grid items-end gap-10 lg:grid-cols-[7fr_5fr]">
        <div>
          <ChapterHead index={chapter.index + 1} category="PRIMARY TARGET" label={chapter.label} />
          <h1 className="font-heading m-0 text-[clamp(40px,7.8vw,112px)] uppercase leading-[0.92] tracking-[-0.03em]" data-hero-title>
            <span className="block">Software</span>
            <span className="block text-transparent" style={{ WebkitTextStroke: "2px var(--foreground)" }}>
              Engineer<span className="text-accent" style={{ WebkitTextStroke: "0" }}>.</span>
            </span>
          </h1>
          <p className="m-0 mt-8 max-w-[440px] text-[17px] leading-[1.65] text-subtle" data-reveal>
            I&apos;m <b className="text-foreground">Shendy</b> — a software engineer shipping products end-to-end
            for {years ?? "4"}+ years. Enterprise assessment platforms, cross-border banking systems, and
            full-stack apps from database schema to the last pixel.
          </p>
          <ScrollCue />
        </div>

        <RecordPanel
          title="DIVER IDENTIFICATION"
          code="ID-01"
          className="lg:justify-self-end lg:min-w-[320px]"
          rows={[
            { label: "SINCE", value: since ?? "—" },
            { label: "PATH", value: DIVE_COPY.path },
            { label: "DIVE SITES", value: projectCount },
            { label: "EXPERIENCE", value: years ? `${years}+ yrs` : "—" },
            { label: "BASE", value: DIVE_COPY.base },
          ]}
        />
      </div>
    </ChapterFrame>
  );
};
```

- [ ] **Step 6: Surface timeline in `src/lib/dive/timelines.ts`**

Replace `surface: noop,` with:

```ts
surface: (tl, q) => {
  tl.to(q("[data-hero-title]"), { y: -40, opacity: 0, duration: 0.6 }, 0)
    .to(q("[data-reveal]"), { y: -24, opacity: 0, duration: 0.6, stagger: 0.03 }, 0.15);
},
```

- [ ] **Step 7: Wire `page.tsx`** (replace the placeholder map; keep the other placeholders for now)

```tsx
import { SurfaceChapter } from "@/components/sections/dive/SurfaceChapter";
import { getExperiences } from "@/server/queries/experiences";
import { getProjects } from "@/server/queries/projects";
// …
export default async function Home() {
  const [projects, experiences] = await Promise.all([getProjects(), getExperiences()]);
  const beats = CHAPTERS.map((c) =>
    c.id === "reef" ? Math.max(1, projects.length) : c.id === "descent" ? Math.max(1, experiences.length) : c.beats
  );
  return (
    <>
      <GrainOverlay />
      <DiveHud />
      <DiveScene />
      <main id="main-content" className="relative z-10 w-full">
        <DiveShell beats={beats}>
          <SurfaceChapter projectCount={projects.length} experiences={experiences} />
          {CHAPTERS.slice(1).map((c, i) => (
            <ChapterFrame key={c.id} id={c.id} beats={beats[i + 1]}>
              <ChapterHead index={c.index + 1} category={c.category} label={c.label} />
              <h2 className="font-heading text-[clamp(36px,5vw,72px)] uppercase leading-none">{c.name}</h2>
            </ChapterFrame>
          ))}
        </DiveShell>
      </main>
    </>
  );
}
```

- [ ] **Step 8: Verify** — `npm run dev`: H1 paints immediately (View Source shows it), the panel shows real SINCE / DIVE SITES values, the cue scrolls to Reef, the hero lifts and fades while scrolling out. Lighthouse (DevTools, desktop) LCP element = the H1.

- [ ] **Step 9: Lint + test + commit**

```bash
npm run lint && npx tsc --noEmit && npm test
git add src/lib/dive src/components/molecules/RecordPanel.tsx src/components/atoms/ScrollCue.tsx src/components/sections/dive/SurfaceChapter.tsx src/app/page.tsx src/app/globals.css
git commit -m "feat(dive): surface chapter with static hero and diver identification panel"
```

---

### Task 8: Reef chapter — dive sites (projects)

**Files:**
- Create: `src/components/molecules/DiveSiteRecord.tsx`, `src/components/sections/dive/ReefChapter.tsx`
- Modify: `src/lib/dive/timelines.ts` (reef builder), `src/app/page.tsx`, `src/app/globals.css`

**Interfaces:**
- Produces: `<DiveSiteRecord project index />` (`ProjectListItem`), `<ReefChapter projects beats />`.
- Timeline contract: each site wrapper is `[data-beat="i"]`; record text is `[data-site-record]`, image is `[data-site-image]` inside it.

- [ ] **Step 1: `src/components/molecules/DiveSiteRecord.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { ProjectListItem } from "@/server/queries/projects";

type DiveSiteRecordProps = { project: ProjectListItem; index: number };

/** One project as a dive-site record: text column + porthole screenshot. */
export const DiveSiteRecord = ({ project, index }: DiveSiteRecordProps) => (
  <div className="site" data-beat={index - 1}>
    <div className="site-record" data-site-record>
      <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.14em] text-muted-foreground">
        <span className="text-accent">SITE-{String(index).padStart(2, "0")}</span>
        {project.year && <span>{project.year}</span>}
      </div>
      <h3 className="font-heading m-0 mt-5 text-[clamp(28px,3.4vw,48px)] leading-[1.02] tracking-[-0.02em]">{project.title}</h3>
      <p className="mt-5 max-w-[46ch] text-base leading-[1.7] text-subtle">{project.description}</p>
      {project.tags.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2 p-0">
          {project.tags.map((t) => (
            <li key={t} className="list-none rounded-full border border-border px-3 py-1 font-mono text-[10px] tracking-[0.1em] text-muted-foreground">{t}</li>
          ))}
        </ul>
      )}
      <Link href={`/projects/${project.slug}`} className="mt-8 inline-flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-foreground transition-colors hover:text-accent">
        OPEN SITE LOG <ArrowUpRight className="size-4" />
      </Link>
    </div>
    <div className="site-image" data-site-image>
      <Image src={project.image} alt={project.title} fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
    </div>
  </div>
);
```

Append to `globals.css`:

```css
.reef-stack { position: relative; display: grid; }
.site { grid-area: 1 / 1; display: grid; gap: 2rem; align-items: center; opacity: 0; }
.site[data-beat="0"] { opacity: 1; }
@media (min-width: 1024px) { .site { grid-template-columns: 5fr 7fr; gap: 3.5rem; } }
.site-image { position: relative; aspect-ratio: 16 / 10; overflow: hidden; border-radius: 28px; border: 1px solid var(--border); }
@media (min-width: 1024px) { .site-image { aspect-ratio: 4 / 3; } }
```

- [ ] **Step 2: `src/components/sections/dive/ReefChapter.tsx`**

```tsx
import { ChapterHead } from "@/components/atoms/ChapterHead";
import { DiveSiteRecord } from "@/components/molecules/DiveSiteRecord";
import { ChapterFrame } from "@/components/organisms/ChapterFrame";
import { CHAPTERS } from "@/constants/dive";
import type { ProjectListItem } from "@/server/queries/projects";

type ReefChapterProps = { projects: ProjectListItem[]; beats: number };
const chapter = CHAPTERS[1];

export const ReefChapter = ({ projects, beats }: ReefChapterProps) => (
  <ChapterFrame id="reef" beats={beats}>
    <ChapterHead index={chapter.index + 1} category={chapter.category} label={chapter.label} />
    <div className="reef-stack">
      {projects.map((p, i) => (
        <DiveSiteRecord key={p.slug} project={p} index={i + 1} />
      ))}
    </div>
  </ChapterFrame>
);
```

- [ ] **Step 3: Reef timeline** (replace `reef: noop,`)

```ts
reef: (tl, q) => {
  const sites = q("[data-beat]") as HTMLElement[];
  const n = sites.length;
  if (n === 0) return;
  sites.forEach((site, i) => {
    const record = site.querySelector("[data-site-record]");
    const image = site.querySelector("[data-site-image]");
    const at = i; // one timeline unit per beat
    if (i > 0) {
      tl.fromTo(site, { opacity: 0 }, { opacity: 1, duration: 0.3 }, at)
        .fromTo(record, { y: 40 }, { y: 0, duration: 0.3 }, at)
        .fromTo(image, { scale: 1.06 }, { scale: 1, duration: 0.3 }, at);
    }
    if (i < n - 1) {
      tl.to(site, { opacity: 0, duration: 0.2 }, at + 0.8)
        .to(record, { y: -40, duration: 0.2 }, at + 0.8);
    }
  });
  tl.duration(n); // beats map 1:1 to progress units before scrub normalisation
  const st = tl.scrollTrigger;
  if (st) {
    st.vars.snap = { snapTo: 1 / n, duration: 0.3, directional: true };
    st.refresh();
  }
},
```

Note: `snapTo: 1/n` relies on the section being `n × 100svh` tall, which `ReefChapter` guarantees via `beats`.

- [ ] **Step 4: Wire into `page.tsx`** — replace the `reef` placeholder: render `<ReefChapter projects={projects} beats={beats[1]} />` before the remaining placeholders (`CHAPTERS.slice(2)` with `beats[i + 2]`).

- [ ] **Step 5: Verify** — five sites cycle one per viewport of scroll; a lazy scroll snaps to a site; the sub cruises on the right above the screenshot; "OPEN SITE LOG" navigates to the project page and the browser back button returns to the Reef (hash-free, position restored by Lenis/ScrollTrigger). Mobile 390 px: single column, image above text, nothing overflows.

- [ ] **Step 6: Lint + commit**

```bash
npm run lint && npx tsc --noEmit
git add src/components/molecules/DiveSiteRecord.tsx src/components/sections/dive/ReefChapter.tsx src/lib/dive/timelines.ts src/app/page.tsx src/app/globals.css
git commit -m "feat(dive): reef chapter with one dive site per project"
```

---

### Task 9: Twilight chapter — diver record (about)

**Files:**
- Create: `src/components/sections/dive/TwilightChapter.tsx`
- Modify: `src/lib/dive/timelines.ts`, `src/app/page.tsx`

**Interfaces:**
- Produces: `<TwilightChapter about={AboutBundle} />`.

- [ ] **Step 1: `TwilightChapter.tsx`**

```tsx
import Image from "next/image";

import { ChapterHead } from "@/components/atoms/ChapterHead";
import { RecordPanel } from "@/components/molecules/RecordPanel";
import { ChapterFrame } from "@/components/organisms/ChapterFrame";
import { CHAPTERS, DIVE_COPY } from "@/constants/dive";
import { SITE_CONFIG } from "@/constants/config";
import type { AboutBundle } from "@/server/queries/about";

type TwilightChapterProps = { about: AboutBundle };
const chapter = CHAPTERS[2];

const splitLead = (text: string) => {
  const i = text.indexOf(". ");
  return i === -1 ? [text, ""] : [text.slice(0, i + 1), text.slice(i + 2)];
};

export const TwilightChapter = ({ about }: TwilightChapterProps) => {
  const bio = about.aboutSections.find((s) => s.key === "professional_bio")?.content ?? "";
  const learning = about.aboutSections.find((s) => s.key === "current_learning")?.content;
  const [lead, rest] = splitLead(bio);
  const instruments = about.techStacks.slice(0, 6).map((t) => t.name).join(" · ");

  return (
    <ChapterFrame id="twilight" beats={chapter.beats}>
      <ChapterHead index={chapter.index + 1} category={chapter.category} label={chapter.label} />
      <div className="grid items-start gap-10 lg:grid-cols-[7fr_5fr] lg:gap-16">
        <div>
          <p className="font-heading m-0 max-w-[18ch] text-[clamp(28px,3.4vw,48px)] leading-[1.08] tracking-[-0.02em]" data-reveal>{lead}</p>
          {rest && <p className="mt-6 max-w-[56ch] text-base leading-[1.75] text-subtle" data-reveal>{rest}</p>}
          {learning && (
            <p className="mt-6 max-w-[56ch] font-mono text-xs leading-[1.8] tracking-[0.06em] text-muted-foreground" data-reveal>
              <span className="text-accent">CURRENTLY LEARNING</span> — {learning}
            </p>
          )}
        </div>

        <div className="relative lg:justify-self-end">
          <div className="porthole" data-reveal>
            <Image src={SITE_CONFIG.profileImage} alt={SITE_CONFIG.author} width={96} height={96} className="size-full object-cover grayscale transition-all duration-700 hover:grayscale-0" />
          </div>
          <RecordPanel
            title="DIVER RECORD"
            code="REC-02"
            className="mt-6 lg:min-w-[360px]"
            rows={[
              { label: "DIVER", value: SITE_CONFIG.author },
              { label: "ROLE", value: "Software Engineer" },
              { label: "FOCUS", value: "Front-end · Full-stack · 3D web" },
              { label: "INSTRUMENTS", value: instruments },
              { label: "BASE", value: DIVE_COPY.base },
            ]}
          />
        </div>
      </div>
    </ChapterFrame>
  );
};
```

Append to `globals.css`:

```css
.porthole {
  width: 96px; height: 96px; overflow: hidden; border-radius: 9999px;
  border: 1px solid var(--border);
  box-shadow: inset 0 0 24px rgba(62, 224, 200, 0.25), 0 0 0 6px color-mix(in oklab, var(--card) 60%, transparent);
}
```

- [ ] **Step 2: Twilight timeline** (replace `twilight: noop,`)

```ts
twilight: (tl, q) => {
  tl.from(q("[data-reveal]"), { y: 32, opacity: 0, duration: 0.35, stagger: 0.06 }, 0)
    .to(q("[data-reveal]"), { y: -24, opacity: 0, duration: 0.25, stagger: 0.03 }, 0.75);
},
```

- [ ] **Step 3: Wire into `page.tsx`** — add `getAbout` to the `Promise.all`, render `<TwilightChapter about={about} />` after Reef, placeholders now `CHAPTERS.slice(3)` with `beats[i + 3]`.

- [ ] **Step 4: Verify** — bio lead reads as display type, panel shows six real instruments, porthole photo desaturated → colour on hover; sub sits left of the text column, not over it.

- [ ] **Step 5: Lint + commit**

```bash
npm run lint && npx tsc --noEmit
git add src/components/sections/dive/TwilightChapter.tsx src/lib/dive/timelines.ts src/app/page.tsx src/app/globals.css
git commit -m "feat(dive): twilight chapter with diver record"
```

---

### Task 10: Descent chapter — career log

**Files:**
- Create: `src/components/molecules/DescentLogEntry.tsx`, `src/components/sections/dive/DescentChapter.tsx`
- Modify: `src/lib/dive/timelines.ts`, `src/app/page.tsx`, `src/app/globals.css`

**Interfaces:**
- Produces: `<DescentLogEntry experience index side="left"|"right" />`, `<DescentChapter experiences beats />`.
- Timeline contract: entries are `[data-beat="i"]`; the marker is `[data-depth-marker]` inside `.pressure-line`.

- [ ] **Step 1: `DescentLogEntry.tsx`**

```tsx
import type { ExperienceDto } from "@/server/queries/experiences";

type DescentLogEntryProps = { experience: ExperienceDto; index: number; side: "left" | "right" };

export const DescentLogEntry = ({ experience: e, index, side }: DescentLogEntryProps) => (
  <li className={`log-entry log-entry--${side}`} data-beat={index}>
    <p className={`m-0 font-mono text-[11px] tracking-[0.14em] ${e.current ? "text-accent" : "text-muted-foreground"}`}>
      {e.period}
    </p>
    <h3 className="font-heading m-0 mt-2 text-[clamp(22px,2.4vw,32px)] leading-[1.05]">{e.title}</h3>
    <p className="m-0 mt-1 font-mono text-xs tracking-[0.1em] text-hud">{e.company}</p>
    <p className="mt-3 max-w-[44ch] text-sm leading-[1.7] text-subtle">{e.description}</p>
    <span className="mt-3 inline-block rounded-full border border-border px-3 py-1 font-mono text-[10px] tracking-[0.12em] text-muted-foreground">
      {e.employmentType}
    </span>
  </li>
);
```

Append to `globals.css`:

```css
.descent { position: relative; display: grid; grid-template-columns: 1fr; }
.pressure-line { position: absolute; top: 0; bottom: 0; left: 8px; width: 1px; background: var(--border); }
.pressure-line [data-depth-marker] { position: absolute; left: -4px; top: 0; width: 9px; height: 9px; border-radius: 9999px; background: var(--accent); box-shadow: 0 0 12px var(--accent); }
.log { margin: 0; padding: 0 0 0 2rem; list-style: none; display: grid; gap: 2.5rem; }
.log-entry { opacity: 0; }
@media (min-width: 1024px) {
  .pressure-line { left: 50%; }
  .log { padding: 0; }
  .log-entry { width: calc(50% - 3rem); }
  .log-entry--left { justify-self: start; text-align: right; }
  .log-entry--left p, .log-entry--left h3 { margin-left: auto; }
  .log-entry--right { justify-self: end; }
}
```

- [ ] **Step 2: `DescentChapter.tsx`**

```tsx
import { ChapterHead } from "@/components/atoms/ChapterHead";
import { DescentLogEntry } from "@/components/molecules/DescentLogEntry";
import { ChapterFrame } from "@/components/organisms/ChapterFrame";
import { CHAPTERS } from "@/constants/dive";
import type { ExperienceDto } from "@/server/queries/experiences";

type DescentChapterProps = { experiences: ExperienceDto[]; beats: number };
const chapter = CHAPTERS[3];

export const DescentChapter = ({ experiences, beats }: DescentChapterProps) => (
  <ChapterFrame id="descent" beats={beats}>
    <ChapterHead index={chapter.index + 1} category={chapter.category} label={chapter.label} />
    <div className="descent">
      <div className="pressure-line" aria-hidden><span data-depth-marker /></div>
      <ol className="log">
        {experiences.map((e, i) => (
          <DescentLogEntry key={e.id} experience={e} index={i} side={i % 2 === 0 ? "left" : "right"} />
        ))}
      </ol>
    </div>
  </ChapterFrame>
);
```

- [ ] **Step 3: Descent timeline** (replace `descent: noop,`)

```ts
descent: (tl, q, section) => {
  const entries = q("[data-beat]") as HTMLElement[];
  const n = entries.length;
  if (n === 0) return;
  const marker = q("[data-depth-marker]");
  const line = section.querySelector<HTMLElement>(".pressure-line");
  tl.to(marker, { top: line ? line.clientHeight - 9 : 0, duration: n, ease: "none" }, 0);
  entries.forEach((el, i) => {
    tl.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.35 }, i + 0.1);
    if (i < n - 1) tl.to(el, { opacity: 0.55, duration: 0.3 }, i + 1.1);
  });
  tl.duration(n);
},
```

- [ ] **Step 4: Wire into `page.tsx`** — `<DescentChapter experiences={experiences} beats={beats[3]} />`; placeholders now `CHAPTERS.slice(4)` with `beats[i + 4]`.

- [ ] **Step 5: Verify** — marker travels the line while three entries appear alternately left/right (desktop) or stacked (mobile); passed entries dim; the sub rides down the centre behind them.

- [ ] **Step 6: Lint + commit**

```bash
npm run lint && npx tsc --noEmit
git add src/components/molecules/DescentLogEntry.tsx src/components/sections/dive/DescentChapter.tsx src/lib/dive/timelines.ts src/app/page.tsx src/app/globals.css
git commit -m "feat(dive): descent chapter with career pressure line"
```

---

### Task 11: Midnight chapter — sonar toolbox

**Files:**
- Create: `src/components/molecules/SonarReadout.tsx`, `src/components/organisms/SonarChart.tsx`, `src/components/sections/dive/MidnightChapter.tsx`
- Modify: `src/lib/dive/timelines.ts`, `src/app/page.tsx`, `src/app/globals.css`

**Interfaces:**
- Produces: `<SonarChart groups={ToolGroup[]} />` (client) where `type ToolGroup = { category: SkillCategory; label: string; tools: Skill[] }`; `<SonarReadout group={ToolGroup | null} />`; `<MidnightChapter skills />`.

- [ ] **Step 1: `SonarReadout.tsx`**

```tsx
import { RecordPanel } from "@/components/molecules/RecordPanel";
import { DIVE_COPY } from "@/constants/dive";
import type { Skill, SkillCategory } from "@/types";

export type ToolGroup = { category: SkillCategory; label: string; tools: Skill[] };

const Logo = ({ tool }: { tool: Skill }) =>
  tool.logo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={tool.logo} alt="" width={16} height={16} className="size-4 object-contain" />
  ) : null;

export const SonarReadout = ({ group }: { group: ToolGroup | null }) => (
  <div aria-live="polite" className="sonar-readout">
    {group ? (
      <RecordPanel
        title="OBJECT READOUT"
        rows={[
          { label: "OBJECT", value: group.category },
          { label: "CLASS", value: group.label },
          {
            label: "STACK",
            value: (
              <ul className="m-0 flex max-w-[300px] flex-wrap justify-end gap-1.5 p-0">
                {group.tools.map((t) => (
                  <li key={t.name} className="inline-flex list-none items-center gap-1.5 rounded border border-border px-2 py-0.5 text-[10px] tracking-[0.08em]">
                    <Logo tool={t} />{t.name}
                  </li>
                ))}
              </ul>
            ),
          },
        ]}
      />
    ) : (
      <p className="m-0 font-mono text-[11px] tracking-[0.16em] text-muted-foreground">{DIVE_COPY.sonarIdle}</p>
    )}
  </div>
);
```

- [ ] **Step 2: `SonarChart.tsx`**

```tsx
"use client";

import { useId, useState } from "react";

import { SonarReadout, type ToolGroup } from "@/components/molecules/SonarReadout";
import { blipPosition } from "@/lib/dive/sonar";

const SIZE = 640;
const C = SIZE / 2;
const RINGS = [70, 110, 150, 190, 230, 270];

type SonarChartProps = { groups: ToolGroup[] };

/** SVG sonar: rings, crosshair, sweeping wedge, one blip per category. */
export const SonarChart = ({ groups }: SonarChartProps) => {
  const [active, setActive] = useState<ToolGroup | null>(null);
  const gradId = useId();

  return (
    <div className="sonar" data-reveal>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="sonar-svg" role="img" aria-label="Toolbox categories as sonar contacts">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--hud)" stopOpacity="0" />
            <stop offset="1" stopColor="var(--hud)" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        {RINGS.map((r) => (
          <circle key={r} cx={C} cy={C} r={r} className="sonar-ring" data-ring />
        ))}
        <line x1={C} y1={C - 290} x2={C} y2={C + 290} className="sonar-ring" />
        <line x1={C - 290} y1={C} x2={C + 290} y2={C} className="sonar-ring" />
        <g className="sonar-sweep" style={{ transformOrigin: `${C}px ${C}px` }}>
          <path d={`M${C},${C} L${C + 290},${C} A290,290 0 0,1 ${C + 290 * Math.cos(Math.PI / 5)},${C + 290 * Math.sin(Math.PI / 5)} Z`} fill={`url(#${gradId})`} />
        </g>
      </svg>

      <ul className="sonar-blips">
        {groups.map((g, i) => {
          const ring = RINGS[Math.min(i, RINGS.length - 1)];
          const { x, y } = blipPosition(i, groups.length, ring, C, C);
          const isActive = active?.category === g.category;
          return (
            <li key={g.category} style={{ left: `${(x / SIZE) * 100}%`, top: `${(y / SIZE) * 100}%` }}>
              <button
                type="button"
                className={`blip ${isActive ? "is-active" : ""}`}
                aria-pressed={isActive}
                onMouseEnter={() => setActive(g)}
                onFocus={() => setActive(g)}
                onClick={() => setActive(isActive ? null : g)}
              >
                <span className="blip-dot" />
                <span className="blip-label">{g.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <SonarReadout group={active} />
    </div>
  );
};
```

Append to `globals.css`:

```css
.sonar { position: relative; width: min(640px, 92vw); margin-inline: auto; }
.sonar-svg { display: block; width: 100%; height: auto; }
.sonar-ring { fill: none; stroke: var(--border); stroke-width: 1; }
.sonar-sweep { animation: sonar-sweep 6s linear infinite; }
@keyframes sonar-sweep { to { transform: rotate(360deg); } }
.sonar-blips { position: absolute; inset: 0; margin: 0; padding: 0; list-style: none; }
.sonar-blips li { position: absolute; transform: translate(-50%, -50%); }
.blip { display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; color: var(--muted-foreground); background: none; border: 0; padding: 8px; }
.blip-dot { width: 10px; height: 10px; border-radius: 9999px; background: var(--hud); box-shadow: 0 0 10px var(--hud); transition: transform 200ms; }
.blip-label { font-family: var(--font-space-mono), ui-monospace, monospace; font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; white-space: nowrap; }
.blip:hover .blip-dot, .blip.is-active .blip-dot { background: var(--accent); box-shadow: 0 0 14px var(--accent); transform: scale(1.4); }
.blip:hover, .blip.is-active { color: var(--foreground); }
.sonar-readout { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: min(360px, 80%); pointer-events: none; text-align: center; }
@media (prefers-reduced-motion: reduce) { .sonar-sweep { animation: none; } }
```

- [ ] **Step 3: `MidnightChapter.tsx`**

```tsx
import { ChapterHead } from "@/components/atoms/ChapterHead";
import { SonarChart } from "@/components/organisms/SonarChart";
import type { ToolGroup } from "@/components/molecules/SonarReadout";
import { ChapterFrame } from "@/components/organisms/ChapterFrame";
import { CHAPTERS } from "@/constants/dive";
import type { Skill, SkillCategory } from "@/types";

type MidnightChapterProps = { skills: Skill[] };
const chapter = CHAPTERS[4];

const ORDER: SkillCategory[] = ["Frontend", "Backend", "Database", "DevOps", "AI", "Project Management"];
const LABELS: Partial<Record<SkillCategory, string>> = { AI: "AI & Productivity" };

export const MidnightChapter = ({ skills }: MidnightChapterProps) => {
  const groups: ToolGroup[] = ORDER.map((category) => ({
    category,
    label: LABELS[category] ?? category,
    tools: skills.filter((s) => s.category === category),
  })).filter((g) => g.tools.length > 0);

  return (
    <ChapterFrame id="midnight" beats={chapter.beats}>
      <ChapterHead index={chapter.index + 1} category={chapter.category} label={chapter.label} />
      <SonarChart groups={groups} />
    </ChapterFrame>
  );
};
```

- [ ] **Step 4: Midnight timeline** (replace `midnight: noop,`)

```ts
midnight: (tl, q) => {
  tl.from(q("[data-ring]"), { scale: 0.6, opacity: 0, transformOrigin: "50% 50%", duration: 0.3, stagger: 0.04 }, 0)
    .from(q(".sonar-blips li"), { scale: 0, opacity: 0, duration: 0.25, stagger: 0.05 }, 0.2)
    .to(q(".sonar"), { opacity: 0, y: -24, duration: 0.2 }, 0.85);
},
```

- [ ] **Step 5: Wire into `page.tsx`** — add `getSkills` to `Promise.all`, render `<MidnightChapter skills={skills} />`; placeholders now only `CHAPTERS.slice(5)` with `beats[5]`.

- [ ] **Step 6: Verify** — rings and blips draw in; hovering/tabbing a blip fills the readout with the category's tools and logos; the sweep rotates continuously; keyboard: Tab reaches each blip, Enter toggles. Mobile: tap selects, chart fits 92vw.

- [ ] **Step 7: Lint + commit**

```bash
npm run lint && npx tsc --noEmit
git add src/components/molecules/SonarReadout.tsx src/components/organisms/SonarChart.tsx src/components/sections/dive/MidnightChapter.tsx src/lib/dive/timelines.ts src/app/page.tsx src/app/globals.css
git commit -m "feat(dive): midnight chapter with interactive sonar toolbox"
```

---

### Task 12: Seafloor chapter — contact, CV, draggable sub

**Files:**
- Create: `src/components/sections/dive/SeafloorChapter.tsx`
- Modify: `src/components/three/dive/Submersible.tsx` (drag), `src/components/organisms/DiveScene.impl.tsx` (pointer hit area), `src/lib/dive/timelines.ts`, `src/app/page.tsx`, `src/app/globals.css`

**Interfaces:**
- Produces: `<SeafloorChapter cv={CvInfoDto | null} />`. The scene wrapper toggles `pointer-events` via `data-chapter="seafloor"` CSS.

- [ ] **Step 1: `SeafloorChapter.tsx`**

```tsx
import { ChapterHead } from "@/components/atoms/ChapterHead";
import { CvDownloadCard } from "@/components/molecules/CvDownloadCard";
import { ChapterFrame } from "@/components/organisms/ChapterFrame";
import { EXTERNAL_LINKS, SITE_CONFIG } from "@/constants/config";
import { CHAPTERS, DIVE_COPY } from "@/constants/dive";
import type { CvInfoDto } from "@/server/queries/about";

type SeafloorChapterProps = { cv: CvInfoDto | null };
const chapter = CHAPTERS[5];

const CHANNELS = [
  { code: "CH-01", label: "GITHUB", href: EXTERNAL_LINKS.github },
  { code: "CH-02", label: "LINKEDIN", href: EXTERNAL_LINKS.linkedin },
  { code: "CH-03", label: "EMAIL", href: `mailto:${EXTERNAL_LINKS.email}` },
  { code: "CH-04", label: "CALENDLY", href: EXTERNAL_LINKS.calendly },
];

export const SeafloorChapter = ({ cv }: SeafloorChapterProps) => (
  <ChapterFrame id="seafloor" beats={chapter.beats}>
    <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
      <ChapterHead index={chapter.index + 1} category={chapter.category} label={chapter.label} />
      <h2 className="font-heading m-0 text-[clamp(36px,5.6vw,80px)] leading-[1] tracking-[-0.03em]" data-reveal>
        {DIVE_COPY.contactHeadline}
      </h2>
      <p className="mt-6 font-mono text-xs tracking-[0.2em] text-hud" data-reveal>{DIVE_COPY.contactSub}</p>

      <ul className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-6 p-0" data-reveal>
        {CHANNELS.map((c) => (
          <li key={c.code} className="list-none">
            <a href={c.href} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-1.5 font-mono tracking-[0.16em]">
              <span className="text-[10px] text-muted-foreground">{c.code}</span>
              <span className="text-xs text-foreground transition-colors group-hover:text-accent">{c.label}</span>
            </a>
          </li>
        ))}
      </ul>

      {cv && (
        <div className="mt-10 w-full max-w-[420px]" data-reveal>
          <CvDownloadCard cvInfo={cv} />
        </div>
      )}

      <p className="mt-8 hidden font-mono text-[10px] tracking-[0.16em] text-muted-foreground [@media(hover:hover)]:block" data-reveal>
        {DIVE_COPY.dragCue}
      </p>

      <p className="mt-14 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.14em] text-muted-foreground">
        <span>© {new Date().getFullYear()} {SITE_CONFIG.author.toUpperCase()}</span>
        <span>{DIVE_COPY.builtIn}</span>
        <a href="#dive-surface" className="hover:text-accent">{DIVE_COPY.backToSurface}</a>
      </p>
    </div>
  </ChapterFrame>
);
```

`CvDownloadCard` expects `CvInfo` (`title, previewImage, downloadPath`); `CvInfoDto` has the same fields plus `id`, so it is assignable.

- [ ] **Step 2: Drag-to-spin in `Submersible.tsx`**

Add refs and handlers inside the component (above `useFrame`):

```tsx
const spin = useRef({ vx: 0, vy: 0, dragging: false, lastX: 0, lastY: 0, rx: 0, ry: 0 });

const onDown = (e: { clientX: number; clientY: number }) => {
  if (dive.get().chapter !== "seafloor") return;
  spin.current.dragging = true;
  spin.current.lastX = e.clientX;
  spin.current.lastY = e.clientY;
};
const onMove = (e: { clientX: number; clientY: number }) => {
  const s = spin.current;
  if (!s.dragging) return;
  s.vy = (e.clientX - s.lastX) * 0.01;
  s.vx = (e.clientY - s.lastY) * 0.01;
  s.lastX = e.clientX;
  s.lastY = e.clientY;
};
const onUp = () => {
  spin.current.dragging = false;
};
```

Inside `useFrame`, after `g.rotation.set(...)` and before `g.scale.setScalar(...)`, add the inertia (velocity decays only while not dragging; the accumulated spin is added on top of the pose rotation):

```tsx
const s = spin.current;
if (!s.dragging) {
  s.vx *= 0.95;
  s.vy *= 0.95;
}
s.rx += s.vx;
s.ry += s.vy;
g.rotation.x += s.rx;
g.rotation.y += s.ry;
```

And attach the handlers to the group: `<group ref={group} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>`.

- [ ] **Step 3: Pointer hit area in `DiveScene.impl.tsx`**

Change the wrapper to `<div aria-hidden className="dive-canvas fixed inset-0 z-0">` and append to `globals.css`:

```css
.dive-canvas { pointer-events: none; }
:root[data-chapter="seafloor"] .dive-canvas { pointer-events: auto; cursor: grab; }
:root[data-chapter="seafloor"] .dive-canvas:active { cursor: grabbing; }
```

Because the chapter's stage sits at `z-10` above the canvas, links stay clickable; only the empty water around the sub is grabbable.

- [ ] **Step 4: Seafloor timeline** (replace `seafloor: noop,`)

```ts
seafloor: (tl, q) => {
  tl.from(q("[data-reveal]"), { y: 28, opacity: 0, duration: 0.5, stagger: 0.07 }, 0);
},
```

- [ ] **Step 5: Wire into `page.tsx`** — render `<SeafloorChapter cv={about.cvInfo} />` and delete the placeholder map and the now-unused `ChapterHead`/`ChapterFrame` imports from `page.tsx`.

- [ ] **Step 6: Verify** — headline, four channels, CV card and footer meta appear; "BACK TO SURFACE" scrolls to the top via Lenis (hash handled by DiveShell); dragging empty water at the seafloor spins the sub with inertia; dragging anywhere else does nothing; channel links still open.

- [ ] **Step 7: Lint + commit**

```bash
npm run lint && npx tsc --noEmit
git add src/components/sections/dive/SeafloorChapter.tsx src/components/three/dive/Submersible.tsx src/components/organisms/DiveScene.impl.tsx src/lib/dive/timelines.ts src/app/page.tsx src/app/globals.css
git commit -m "feat(dive): seafloor chapter with contact channels and draggable sub"
```

---

### Task 13: Scene atmosphere — sunrays, marine snow, bioluminescence, seafloor mesh

**Files:**
- Create: `src/components/three/dive/{Sunrays,MarineSnow,Bioluminescence,Seafloor}.tsx`
- Modify: `src/components/organisms/DiveScene.impl.tsx`

**Interfaces:**
- Consumes: `dive.get().progress`, `poseAt`.
- Produces: four self-contained R3F components; `DiveSceneImpl` composes them and halves particle counts on `(pointer: coarse)`.

- [ ] **Step 1: `Sunrays.tsx`**

```tsx
"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { dive } from "@/lib/dive/depth";

const COUNT = 5;

export const Sunrays = ({ count = COUNT }: { count?: number }) => {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const p = dive.get().progress;
    const vis = Math.max(0, 1 - p / 0.18); // gone by ~700 m
    g.visible = vis > 0.01;
    g.children.forEach((m, i) => {
      const mesh = m as THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
      mesh.material.opacity = 0.35 * vis * (0.6 + 0.4 * Math.sin(clock.elapsedTime * 0.4 + i));
      mesh.rotation.z = -0.35 + i * 0.12 + Math.sin(clock.elapsedTime * 0.15 + i) * 0.03;
    });
  });
  return (
    <group ref={group} position={[1.5, 5, -3]}>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i} position={[i * 0.9 - 2, 0, 0]}>
          <planeGeometry args={[0.35, 14]} />
          <meshBasicMaterial color="#9fd8ff" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};
```

- [ ] **Step 2: `MarineSnow.tsx`**

```tsx
"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { dive } from "@/lib/dive/depth";

const BOX = { x: 14, y: 10, z: 8 };

export const MarineSnow = ({ count = 1400 }: { count?: number }) => {
  const points = useRef<THREE.Points>(null);
  const last = useRef(0);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * BOX.x;
      arr[i * 3 + 1] = (Math.random() - 0.5) * BOX.y;
      arr[i * 3 + 2] = (Math.random() - 0.5) * BOX.z - 2;
    }
    return arr;
  }, [count]);

  useFrame((_, dt) => {
    const pts = points.current;
    if (!pts) return;
    const p = dive.get().progress;
    const v = (p - last.current) * 60; // scroll velocity → snow streams upward as we descend
    last.current = p;
    const speed = 0.12 + Math.abs(v) * 0.6;
    const arr = pts.geometry.attributes.position.array as Float32Array;
    for (let i = 1; i < arr.length; i += 3) {
      arr[i] += speed * dt;
      if (arr[i] > BOX.y / 2) arr[i] = -BOX.y / 2;
    }
    pts.geometry.attributes.position.needsUpdate = true;
    (pts.material as THREE.PointsMaterial).opacity = 0.35 + p * 0.35;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#dfe9f2" size={0.025} transparent opacity={0.4} depthWrite={false} sizeAttenuation />
    </points>
  );
};
```

- [ ] **Step 3: `Bioluminescence.tsx`**

```tsx
"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { dive } from "@/lib/dive/depth";

export const Bioluminescence = ({ count = 120 }: { count?: number }) => {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    const pts = points.current;
    if (!pts) return;
    const p = dive.get().progress;
    const vis = Math.min(1, Math.max(0, (p - 0.7) / 0.15)); // fades in past ~2800 m
    pts.visible = vis > 0.01;
    (pts.material as THREE.PointsMaterial).opacity = vis * (0.5 + 0.5 * Math.sin(clock.elapsedTime * 1.3));
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#d7ff3e" size={0.06} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
};
```

- [ ] **Step 4: `Seafloor.tsx`**

```tsx
"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { dive } from "@/lib/dive/depth";

export const Seafloor = () => {
  const mesh = useRef<THREE.Mesh>(null);
  const puff = useRef<THREE.Points>(null);
  const landed = useRef(false);
  const puffT = useRef(0);

  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(24, 12, 48, 24);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 0.7) * 0.18 + Math.cos(y * 1.1 + x * 0.3) * 0.12);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  const puffPositions = useMemo(() => {
    const arr = new Float32Array(80 * 3);
    for (let i = 0; i < 80; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 1.6;
      arr[i * 3 + 1] = -2.1 + Math.random() * 0.2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
    }
    return arr;
  }, []);

  useFrame((_, dt) => {
    const p = dive.get().progress;
    const vis = Math.min(1, Math.max(0, (p - 0.9) / 0.06));
    if (mesh.current) {
      mesh.current.visible = vis > 0.01;
      mesh.current.position.y = -3.4 + vis * 1.2; // rises into view as we land
    }
    const nearFloor = p > 0.985;
    if (nearFloor && !landed.current) { landed.current = true; puffT.current = 0; }
    if (p < 0.94) landed.current = false;
    const pf = puff.current;
    if (pf) {
      puffT.current += dt;
      const t = puffT.current;
      pf.visible = landed.current && t < 2.5;
      const arr = pf.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < arr.length; i += 3) arr[i] += dt * 0.25;
      pf.geometry.attributes.position.needsUpdate = true;
      (pf.material as THREE.PointsMaterial).opacity = Math.max(0, 0.5 - t * 0.2);
      if (!pf.visible) for (let i = 1; i < arr.length; i += 3) arr[i] = -2.1 + Math.random() * 0.2;
    }
  });

  return (
    <>
      <mesh ref={mesh} geometry={geo} rotation={[-Math.PI / 2.4, 0, 0]} position={[0, -3.4, -1]}>
        <meshStandardMaterial color="#0b1a22" roughness={1} metalness={0} />
      </mesh>
      <points ref={puff} visible={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[puffPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#8fa3ad" size={0.05} transparent opacity={0.5} depthWrite={false} />
      </points>
    </>
  );
};
```

- [ ] **Step 5: Compose in `DiveScene.impl.tsx`**

```tsx
const coarse = () => window.matchMedia("(pointer: coarse)").matches;
// inside the component, after `ok`:
const lite = coarse();
// inside <Canvas>, in this order:
<Water />
<ambientLight intensity={0.6} />
<directionalLight position={[3, 6, 4]} intensity={1.4} />
<Sunrays count={lite ? 3 : 5} />
<MarineSnow count={lite ? 500 : 1400} />
<Bioluminescence count={lite ? 60 : 120} />
<Seafloor />
<Submersible />
```

and set `dpr={lite ? 1 : [1, 1.5]}`.

- [ ] **Step 6: Verify** — sunrays visible only near the surface; snow streams upward faster while scrolling; lime specks pulse from Midnight on; the floor rises into view at the end and a silt puff appears once when the sub lands (does not replay when nudging the scroll a few px). DevTools Performance: main thread stays under 8 ms/frame during scroll on desktop.

- [ ] **Step 7: Lint + commit**

```bash
npm run lint && npx tsc --noEmit
git add src/components/three/dive src/components/organisms/DiveScene.impl.tsx
git commit -m "feat(dive): sunrays, marine snow, bioluminescence and seafloor"
```

---

### Task 14: Project pages use the surface HUD

**Files:**
- Modify: `src/components/organisms/ProjectPageContent.tsx` (lines 44–67), `src/app/projects/[slug]/page.tsx`

- [ ] **Step 1: Replace the inline nav**

In `ProjectPageContent.tsx` delete the `<nav className="fixed …">…</nav>` block (the topbar with `TerminalLogo`, `← ALL WORK`, `LET'S TALK`) and the now-unused imports `TerminalLogo` and `EXTERNAL_LINKS` (keep `EXTERNAL_LINKS` if it is used further down; check with grep). Render `<DiveHud mode="surface" />` in its place:

```tsx
import { DiveHud } from "@/components/organisms/DiveHud";
// …
<div className="relative min-h-screen">
  <GrainOverlay />
  <DiveHud mode="surface" />
  {/* Hero */}
```

Change the header's `pt-[170px]` to `pt-[120px]` (the HUD is 40 px, not 68 px).

- [ ] **Step 2: Verify** — `/projects/nabunk` shows the HUD with `← BACK TO DIVE`; clicking it lands on the Reef chapter of `/` (hash handled by `DiveShell`); no canvas or rail on the project page; clock ticks.

- [ ] **Step 3: Lint + commit**

```bash
npm run lint && npx tsc --noEmit
git add src/components/organisms/ProjectPageContent.tsx
git commit -m "feat(dive): project pages use the surface HUD"
```

---

### Task 15: Cleanup — dead components, unused deps, keyframes, docs

**Files:**
- Delete: components with zero importers (list below, re-verify with grep), `src/components/ui/splite.tsx`
- Modify: `apps/web/package.json` (remove `@splinetool/react-spline`, `@splinetool/runtime`), `src/app/globals.css` (prune keyframes), `AGENTS.md`, `apps/web/AGENTS.md`, `apps/web/README.md`

- [ ] **Step 1: Find and delete orphans**

Run from `apps/web`:

```bash
for f in $(git ls-files 'src/components/**/*.tsx' 'src/hooks/*.tsx' 'src/hooks/*.ts'); do
  n=$(basename "$f" | sed 's/\.tsx\?$//');
  c=$(grep -rl --include=*.tsx --include=*.ts "$n" src | grep -v "^$f$" | wc -l);
  [ "$c" -eq 0 ] && echo "ORPHAN $f";
done
```

Expected orphans (delete each with `git rm`): `molecules/BioCard.tsx`, `molecules/LearningQuote.tsx`, `molecules/LoveCard.tsx`, `molecules/TechStackCard.tsx`, `molecules/TechStackItem.tsx`, `molecules/TraitBadge.tsx`, `molecules/AboutBackdrop.tsx`, `molecules/HeroSceneIsland.tsx`, `molecules/SocialButton.tsx`, `atoms/SectionContainer.tsx`, `atoms/SectionHeading.tsx`, `ui/container-scroll-animation.tsx`, `ui/shader-background.tsx`, `ui/spotlight.tsx`, `ui/splite.tsx`, `ui/skeleton.tsx`, `hooks/useResponsive.tsx`. Re-run the loop until it prints nothing (deleting one file can orphan another). Keep `ui/button.tsx`, `ui/card.tsx`, `ui/image-modal.tsx`, `atoms/GradientText.tsx`, `atoms/TopProgressBar.tsx`, `hooks/useTilt.tsx`, `hooks/useMagneticHover.tsx` — they have importers.

- [ ] **Step 2: Remove Spline deps**

```bash
npm uninstall @splinetool/react-spline @splinetool/runtime
```

- [ ] **Step 3: Prune `globals.css` keyframes with no remaining class users**

For each of `marquee, scroll-line, rise, fade-up, firework, fadeIn, fade-in-up, move-right, bounce-x, bounce-x-big, float-slow, spin-slow, spotlight, aurora-drift, aurora-breathe, icon-float, fade-out-down, gradient-x` run `grep -rn "animate-<name>" src`; delete the `@keyframes` + `.animate-*` rule (and its entry in the two `prefers-reduced-motion` blocks) for every name with zero hits. `blink`, `pulse-dot` and `gradient-x` (CvDownloadCard) stay; `.aurora-radial` goes if unused. Also delete the `/* Syne Extrabold… */` mobile `.font-heading` block only if `font-heading` is unused (it is used — keep it).

- [ ] **Step 4: Update the docs**

`AGENTS.md`:
- "How to run things": replace the root-proxy paragraph with "All scripts run from `apps/web` (there is no root `package.json`)". Add `npm test  # Vitest unit tests (src/**/*.test.ts)`.
- Tech stack table: Animation row → `GSAP 3 + ScrollTrigger (scroll choreography, Lenis smooth scroll) · Framer Motion (hover/gesture springs only)`; add row `Journey | src/constants/dive.ts + src/lib/dive/* | chapter registry, depth store, pose/water maths — every chapter name lives here`.
- Hard rules: add `9. **Dark-only.** No light palette, no theme toggle. New colours go into :root in globals.css.`
- "Where to look first": `Visual / layout → globals.css + components/sections/dive/*`; `Scroll story → components/organisms/DiveShell.tsx + lib/dive/timelines.ts`; `3D scene → components/organisms/DiveScene.impl.tsx + components/three/dive/*`.

`apps/web/AGENTS.md`:
- Directory map: add `three/dive/` under components and `sections/dive/`; note `lib/dive/`.
- Animation conventions: replace the block with: GSAP timelines live only in `lib/dive/timelines.ts` (one builder per chapter, targets via `data-*` attributes, `[data-reveal]` for anything that must be visible under reduced motion); Framer Motion only for pointer springs; Tailwind keyframes for loops (blink, sonar sweep); reduced motion is handled centrally by `ChapterFrame` and `DiveScene`.
- Theme & color tokens: replace with the dark-only note and the `--hud` token; remove the gradient-identity sentence.
- 3D / Hero scene: replace with the DiveScene description (dynamic import, `useFrame` reads `dive.get()`, never React state per frame).

`apps/web/README.md`: features list → replace "Dark/light theme toggle" and "3D animated hero section" with "Scroll-driven deep-dive journey (GSAP + Lenis) with a persistent R3F ocean scene"; drop "Dark/light theme with persistence".

- [ ] **Step 5: Full verification**

```bash
npm run lint && npx tsc --noEmit && npm test && npm run build
```

Expected: all green; the build output lists `/` and `/projects/[slug]`; first-load JS for `/` is reported — note the number for the PR.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore(dive): remove dead components and spline deps, update agent docs"
```

---

### Task 16: Screenshot script, Lighthouse, PR

**Files:**
- Create: `apps/web/scripts/dive-shots.mjs`
- Modify: `apps/web/package.json` (`"shots": "node scripts/dive-shots.mjs"`)

- [ ] **Step 1: `scripts/dive-shots.mjs`**

Playwright is not a dependency of this app; the script uses the copy installed in the java-exploration e2e workspace (documented pattern, see memory `project_nabunk_screenshots`) via `PLAYWRIGHT_ROOT`.

```js
// Usage: PLAYWRIGHT_ROOT="C:/Project/Shendy/Java Exploration/java-exploration/e2e" npm run shots
// Captures the six chapters at desktop + mobile into docs/superpowers/shots/.
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import path from "node:path";

const root = process.env.PLAYWRIGHT_ROOT;
if (!root) throw new Error("Set PLAYWRIGHT_ROOT to a folder that has playwright installed");
const { chromium } = createRequire(path.join(root, "package.json"))("playwright");

const base = process.env.SHOTS_URL ?? "http://localhost:3000";
const out = path.resolve("../../docs/superpowers/shots");
mkdirSync(out, { recursive: true });

const CHAPTERS = ["surface", "reef", "twilight", "descent", "midnight", "seafloor"];

const browser = await chromium.launch();
for (const [name, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  for (const id of CHAPTERS) {
    await page.evaluate((sel) => {
      const el = document.getElementById(sel);
      window.scrollTo({ top: el.offsetTop + el.offsetHeight * 0.45, behavior: "instant" });
    }, `dive-${id}`);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(out, `${name}-${id}.png`) });
  }
  await page.close();
}
await browser.close();
console.log("shots →", out);
```

Add `docs/superpowers/shots/` to `.gitignore` (screenshots are attached to the PR, not committed).

- [ ] **Step 2: Run the pass**

```bash
npm run build && npm run start &   # production server on :3000
PLAYWRIGHT_ROOT="C:/Project/Shendy/Java Exploration/java-exploration/e2e" npm run shots
```

Open every PNG. Checklist per screenshot: chapter head visible; text never sits on the sub; no clipped panels; mobile has no horizontal overflow (`document.documentElement.scrollWidth === innerWidth` in DevTools).

- [ ] **Step 3: Lighthouse**

Chrome DevTools → Lighthouse on `http://localhost:3000` (production build), Mobile then Desktop. Record Performance, CLS, LCP element. Targets: mobile ≥ 85, desktop ≥ 95, CLS 0, LCP = H1. If mobile misses: lower `MarineSnow` to 300 on coarse pointers and retest before anything else.

- [ ] **Step 4: Ponytail review + push**

Run `/ponytail-review` on the branch diff and apply any simplification it flags that does not change behaviour. Then:

```bash
git add scripts/dive-shots.mjs package.json ../../.gitignore
git commit -m "chore(dive): playwright screenshot pass for the journey"
git push -u origin feat/deep-dive
```

- [ ] **Step 5: Open the PR**

```bash
gh pr create --base development --head feat/deep-dive --title "feat(dive): scroll-driven deep-sea journey landing page" --body "$(cat <<'EOF'
## Summary
- Landing page rebuilt as one scroll-driven dive: persistent R3F ocean, six pinned chapters (Surface · Reef · Twilight · Descent · Midnight · Seafloor), HUD with depth readout and rail.
- GSAP ScrollTrigger + Lenis drive the story; Framer Motion kept for hover springs only.
- Dark-only: theme toggle, accent picker and the old landing shell removed. Project pages get the surface HUD.
- Spec: docs/superpowers/specs/2026-09-11-deep-dive-journey-design.md · Plan: docs/superpowers/plans/2026-09-11-deep-dive-journey.md

## Test plan
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build` green
- [ ] Scroll-through at 1440×900 and 390×844: every chapter reachable from the rail, no overlap, no horizontal scroll
- [ ] Reduced-motion: no canvas, all content visible
- [ ] Lighthouse (prod build): mobile ≥ 85, desktop ≥ 95, CLS 0, LCP = H1 (numbers below)
- [ ] Screenshots from `npm run shots` attached

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_014eSQEHBBZz1W5ejoKk3F32
EOF
)"
```

Attach the twelve screenshots and the Lighthouse numbers as a PR comment. Shenks reviews the Vercel preview before merge.

---

## Self-review notes (done while writing)

- Spec coverage: §4.1–4.4 → Tasks 2, 4, 6; §5 → Tasks 4, 7–12; §6.1–6.6 → Tasks 7–12; §7 HUD/theme → Tasks 4, 5, 14; §8 reduced motion/mobile/perf → Tasks 4 (ChapterFrame matchMedia), 6 (canRender + CSS fallback), 13 (lite counts, dpr), 16 (Lighthouse); §9 data → Tasks 7–12; §10 deps → Tasks 1, 15; §11 file map → the locked structure above; §12 verification → Tasks 1–3 (Vitest), 15, 16; §13 rollout → task order; `Caustics` (stretch) intentionally not planned.
- Deviation from spec, recorded in Global Constraints: chapter progress ranges derive from beats; `pinSpacing: false` chosen up front.
- Type consistency checked: `ChapterId`, `Range`, `DiveState`, `Pose`, `TimelineBuilder`, `ToolGroup`, `scroller.to`, `dive.configure/set/get/subscribe` are used with the same names and shapes in every task.
