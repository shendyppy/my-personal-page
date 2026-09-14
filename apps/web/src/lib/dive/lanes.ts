import { CHAPTER_IDS, sectionId, type ChapterId, type Lane } from "@/constants/dive";

type Rect = { left: number; top: number; width: number; height: number };

/**
 * An anchor's box as a lane. Vertical position is taken relative to the
 * chapter's stage, which is exactly one viewport tall and sits at the top of
 * the viewport whenever the chapter is on screen — so the lane is where the
 * anchor will be then, wherever the page happens to be scrolled while
 * measuring. A travel lane runs from the anchor's top edge to its bottom.
 */
export const laneFromRect = (r: Rect, stageTop: number, vw: number, vh: number, travel: boolean): Lane => {
  const top = r.top - stageTop;
  const ndcY = (px: number) => 1 - (px / vh) * 2;
  const lane: Lane = {
    x: ((r.left + r.width / 2) / vw) * 2 - 1,
    y: ndcY(travel ? top : top + r.height / 2),
    w: r.width / vw,
    h: r.height / vh,
  };
  if (travel) lane.y2 = ndcY(top + r.height);
  return lane;
};

/** Measured lanes, read by the scene every frame. Mutated in place by measureLanes. */
export const lanes: Partial<Record<ChapterId, Lane>> = {};

/**
 * Measure every chapter's lane: its first visible `[data-sub-anchor="lane"]`,
 * else its visible `"head"` anchor (the phone fallback beside the chapter
 * head). A visible `"lane-alt"` anchor beside a lane becomes its `alt` box,
 * the side the sub swaps to on alternate beats. Call after layout changes — DiveShell does on load, fonts and every
 * ScrollTrigger refresh.
 */
export const measureLanes = () => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  for (const id of CHAPTER_IDS) {
    const section = document.getElementById(sectionId(id));
    const stage = section?.querySelector<HTMLElement>("[data-stage]");
    const pick = (kind: string) =>
      [...(section?.querySelectorAll<HTMLElement>(`[data-sub-anchor="${kind}"]`) ?? [])]
        .map((el) => ({ el, r: el.getBoundingClientRect() }))
        .find(({ r }) => r.width > 0 && r.height > 0);
    const found = pick("lane") ?? pick("head");
    if (!stage || !found) {
      delete lanes[id];
      continue;
    }
    const stageTop = stage.getBoundingClientRect().top;
    const lane = laneFromRect(found.r, stageTop, vw, vh, found.el.hasAttribute("data-sub-travel"));
    const alt = found.el.dataset.subAnchor === "lane" && pick("lane-alt");
    if (alt) lane.alt = laneFromRect(alt.r, stageTop, vw, vh, false);
    lanes[id] = lane;
  }
};
