"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type LearningLineProps = { text: string };

/** The smallest teleprompter window, in lines, once the line has to crawl. */
const MIN_LINES = 2;

/**
 * The "currently learning" line. It reads in full wherever the pinned stage
 * has the height for it; only when the chapter would overflow the stage does
 * it turn into a teleprompter window exactly as tall as the room left, its
 * copy crawling up and looping (the echo makes the loop seamless). Phones
 * always run it as a one-line ticker under a fixed label. See globals.css.
 *
 * Measured rather than keyed to breakpoints: the copy comes from the database,
 * and a height breakpoint tuned for one length crawled on a 1280x800 display
 * that had room for all of it.
 */
export const LearningLine = ({ text }: LearningLineProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = ref.current;
    const stage = box?.closest<HTMLElement>("[data-stage]");
    if (!box || !stage) return;
    const phone = window.matchMedia("(max-width: 639px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const fit = () => {
      delete box.dataset.crawl;
      box.style.removeProperty("--learn-h");
      if (reduced.matches) return;
      if (phone.matches) {
        box.dataset.crawl = "";
        return;
      }
      // offsetTop/offsetHeight ignore the reveal transforms; the stage is the
      // offsetParent, and its absolute lane markers are not in the flow.
      const flow = [...stage.children].filter(
        (el): el is HTMLElement => el instanceof HTMLElement && getComputedStyle(el).position !== "absolute"
      );
      const first = flow[0];
      const last = flow[flow.length - 1];
      const pad = getComputedStyle(stage);
      const room = stage.clientHeight - parseFloat(pad.paddingTop) - parseFloat(pad.paddingBottom);
      const over = last.offsetTop + last.offsetHeight - first.offsetTop - room;
      if (over <= 0) return;
      const line = parseFloat(getComputedStyle(box).lineHeight);
      box.style.setProperty("--learn-h", `${Math.max(MIN_LINES * line, box.offsetHeight - over)}px`);
      box.dataset.crawl = "";
    };

    fit();
    // The stage resizes with the viewport; its content also grows when the
    // display font lands. fit() restores the size it found, so no loop.
    const observer = new ResizeObserver(fit);
    for (const el of [stage, ...stage.children]) observer.observe(el);
    phone.addEventListener("change", fit);
    reduced.addEventListener("change", fit);
    return () => {
      observer.disconnect();
      phone.removeEventListener("change", fit);
      reduced.removeEventListener("change", fit);
    };
  }, []);

  const lead = (
    <span className="learning-lead">
      <span className="text-accent">CURRENTLY LEARNING</span> —{" "}
    </span>
  );

  return (
    <div className="mt-6" data-reveal>
      <p className="learning-tag">CURRENTLY LEARNING</p>
      <div
        ref={ref}
        className="twilight-learning font-mono text-xs leading-[1.8] tracking-[0.06em] text-muted-foreground"
        style={{ "--crawl-dur": `${Math.max(18, Math.round(text.length / 6))}s` } as CSSProperties}
      >
        <div className="learning-crawl">
          <p className="m-0">
            {lead}
            {text}
          </p>
          <p className="learning-echo m-0" aria-hidden>
            {lead}
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};
