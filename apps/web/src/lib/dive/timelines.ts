import type { gsap } from "gsap";
import type { ChapterId } from "@/constants/dive";

export type TimelineBuilder = (tl: gsap.core.Timeline, q: gsap.utils.SelectorFunc) => void;

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
        // Site i must be fully in AT time i, not starting to arrive there:
        // time i is exactly where `snapTo: 1 / beats` settles. Entering over
        // [i - 0.3, i] also overlaps the previous site's exit at [i - 0.2, i],
        // which is what makes it a cross-fade rather than a cut.
        const enter = at - 0.3;
        tl.fromTo(site, { opacity: 0 }, { opacity: 1, duration: 0.3 }, enter)
          .fromTo(record, { y: 40 }, { y: 0, duration: 0.3 }, enter)
          .fromTo(image, { scale: 1.06 }, { scale: 1, duration: 0.3 }, enter);
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
  twilight: (tl, q) => {
    const reveal = q("[data-reveal]");
    if (reveal.length === 0) return;
    // The spacer pins the total at 1, so every number below reads directly as
    // a fraction of the chapter's scroll (see the reef note: `tl.duration()`
    // only sets timeScale, which ScrollTrigger's totalProgress never sees).
    // Fully legible from 30% on, and it stays: the pin is only half a viewport,
    // and fading out at 80% left the stage blank for the whole viewport it
    // then scrolls away over. The copy leaves with its stage instead.
    tl.from(reveal, { y: 32, opacity: 0, duration: 0.2, stagger: 0.02 }, 0).to({}, { duration: 1 }, 0);
  },
  descent: (tl, q) => {
    const entries = q("[data-beat]") as HTMLElement[];
    const n = entries.length;
    if (n === 0) return;
    // Percent, not a measured px height: the line's height changes on resize
    // and this timeline is only built once.
    tl.fromTo(q("[data-depth-marker]"), { top: "0%" }, { top: "100%", duration: n }, 0);
    entries.forEach((el, i) => {
      tl.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.35 }, i + 0.1);
      if (i < n - 1) tl.to(el, { opacity: 0.55, duration: 0.3 }, i + 1.1);
    });
    // One unit per entry, via a spacer for the reason given under reef.
    tl.to({}, { duration: n }, 0);
  },
  midnight: (tl, q) => {
    // Blips animate on the button, not the <li>: CSS centres each <li> on its
    // point with translate(-50%, -50%), which a GSAP scale there would replace.
    // Spacer pins the total at 1 (see reef): drawn in by 45%, then it stays up
    // and scrolls away with its stage, for the reason given under twilight.
    tl.from(q("[data-ring]"), { scale: 0.6, opacity: 0, transformOrigin: "50% 50%", duration: 0.2, stagger: 0.03 }, 0)
      .from(q(".blip"), { scale: 0, opacity: 0, duration: 0.15, stagger: 0.03 }, 0.15)
      .to({}, { duration: 1 }, 0);
  },
  seafloor: (tl, q) => {
    const reveal = q("[data-reveal]");
    if (reveal.length === 0) return;
    // This is the chapter's entrance (see scrubRange), which ends at the page
    // bottom. Everything lands by ~80% so nothing is still moving where the
    // reader stops.
    tl.from(reveal, { y: 28, opacity: 0, duration: 0.4, stagger: 0.05 }, 0.1).to({}, { duration: 1 }, 0);
  },
};
