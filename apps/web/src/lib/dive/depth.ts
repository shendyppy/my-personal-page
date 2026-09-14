import { CHAPTERS, chapterById, type ChapterId } from "@/constants/dive";

export type Range = { id: ChapterId; start: number; end: number; beats: number };

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
    const b = beats[i] ?? c.beats;
    acc += b;
    return { id: c.id, start, end: i === CHAPTERS.length - 1 ? 1 : acc / total, beats: b };
  });
}

/** Metres at progress `p`: linear inside each chapter's `depthM` band, continuous across chapters. */
export function depthForProgress(p: number, ranges: Range[]) {
  const { id, t } = localProgress(p, ranges);
  const [from, to] = chapterById(id).depthM;
  return Math.round(from + (to - from) * t);
}

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
    state = { ...state, ranges, depth: depthForProgress(state.progress, ranges), chapter: chapterAt(state.progress, ranges) };
    listeners.forEach((l) => l(state));
  },
  set(progress: number) {
    const p = clamp01(progress);
    if (p === state.progress) return;
    state = { progress: p, depth: depthForProgress(p, ranges), chapter: chapterAt(p, ranges), ranges };
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
