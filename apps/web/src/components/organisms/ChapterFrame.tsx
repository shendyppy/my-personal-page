"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { CHAPTER_IDS, sectionId, type ChapterId } from "@/constants/dive";
import { scrubRange } from "@/lib/dive/scrub";
import { TIMELINES } from "@/lib/dive/timelines";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ChapterFrameProps = {
  id: ChapterId;
  beats: number;
  /** Snap the scrub to each beat boundary (Reef's dive-site cards need this). */
  snap?: boolean;
  children: ReactNode;
};

/**
 * One chapter of the dive. The section is `beats × 100svh` tall (server HTML,
 * so no CLS); the inner stage is pinned for that distance and the chapter's
 * timeline (looked up by id) is scrubbed across it. Reduced motion: no pin,
 * every `[data-reveal]` is simply visible.
 */
export const ChapterFrame = ({ id, beats, snap, children }: ChapterFrameProps) => {
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
          const { start, end, pin } = scrubRange(CHAPTER_IDS.indexOf(id), beats);
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start,
              end,
              scrub: true,
              pin: pin && stage,
              pinSpacing: false,
              // ScrollTrigger only reads `snap` at creation time; assigning
              // trigger.vars.snap afterwards is silently ignored.
              ...(snap ? { snap: { snapTo: 1 / beats, duration: 0.3, directional: true } } : {}),
            },
          });
          TIMELINES[id](tl, gsap.utils.selector(section));
        }
      );
      return () => mm.revert();
    },
    { scope: ref, dependencies: [id, beats, snap] }
  );

  return (
    <section
      ref={ref}
      id={sectionId(id)}
      data-chapter={id}
      className="chapter"
      style={{ "--beats": beats } as CSSProperties}
    >
      <div data-stage className="stage">
        {/* The sub's fallback parking spot: top-right of the stage, beside the
            chapter head. A chapter's own [data-sub-anchor="lane"] wins where
            its layout has one (lib/dive/lanes). */}
        <span data-sub-anchor="head" aria-hidden className="stage-lane" />
        {children}
      </div>
    </section>
  );
};
