import type { gsap } from "gsap";
import type { ChapterId } from "@/constants/dive";

export type TimelineBuilder = (
  tl: gsap.core.Timeline,
  q: gsap.utils.SelectorFunc,
  section: HTMLElement
) => void;

const noop: TimelineBuilder = () => {};

export const TIMELINES: Record<ChapterId, TimelineBuilder> = {
  surface: (tl, q) => {
    tl.to(q("[data-hero-title]"), { y: -40, opacity: 0, duration: 0.6 }, 0)
      .to(q("[data-reveal]"), { y: -24, opacity: 0, duration: 0.6, stagger: 0.03 }, 0.15);
  },
  reef: noop,
  twilight: noop,
  descent: noop,
  midnight: noop,
  seafloor: noop,
};
