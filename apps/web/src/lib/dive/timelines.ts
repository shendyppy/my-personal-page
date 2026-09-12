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
