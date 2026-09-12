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
export const ChapterFrame = ({ id, beats, className, snap, children }: ChapterFrameProps) => {
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
              // ScrollTrigger only reads `snap` at creation time; assigning
              // trigger.vars.snap afterwards is silently ignored.
              ...(snap ? { snap: { snapTo: 1 / beats, duration: 0.3, directional: true } } : {}),
            },
          });
          TIMELINES[id](tl, gsap.utils.selector(section), section);
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
      className={cn("chapter", className)}
      style={{ "--beats": beats } as CSSProperties}
    >
      <div data-stage className="stage">
        {children}
      </div>
    </section>
  );
};
