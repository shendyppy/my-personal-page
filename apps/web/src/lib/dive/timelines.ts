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
    // Beats must map 1:1 to timeline units so beat i sits at progress i/n,
    // exactly where ChapterFrame's `snapTo: 1 / beats` lands. `tl.duration(n)`
    // cannot do that: on a timeline it only sets timeScale, and ScrollTrigger
    // scrubs totalProgress (local time / duration), which timeScale never
    // touches. An empty-target spacer stretches the timeline itself instead.
    tl.to({}, { duration: n }, 0);
  },
  twilight: noop,
  descent: noop,
  midnight: noop,
  seafloor: noop,
};
