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
    // ScrollTrigger normalises the whole timeline across the section, so these
    // units only mean anything relative to the total. Keeping the total at ~1
    // makes them read as the fractions of the scroll that spec 6.1 states: the
    // headline clears in the first 60%, the panel drifts slower behind it.
    tl.to(q("[data-hero-title]"), { y: -40, opacity: 0, duration: 0.6 }, 0)
      .to(q("[data-reveal]"), { y: -24, opacity: 0, duration: 0.67, stagger: 0.03 }, 0.3);
  },
  reef: noop,
  twilight: noop,
  descent: noop,
  midnight: noop,
  seafloor: noop,
};
