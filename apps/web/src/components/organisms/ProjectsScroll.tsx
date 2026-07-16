"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { ProjectTile } from "@/components/molecules/ProjectTile";
import type { ProjectListItem } from "@/server/queries/projects";

type ProjectsScrollProps = {
  projects: ProjectListItem[];
};

/**
 * "Selected Work" — a horizontal snap carousel of large editorial case-study
 * cards. Each slide shows a peek of the next; drag/swipe on touch, prev/next
 * buttons on desktop. Keeps the whole set on one screen instead of a long
 * vertical run. The header eases in on scroll.
 */
export const ProjectsScroll = ({ projects }: ProjectsScrollProps) => {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // Toggle the arrow buttons at the ends of the track. 4px of slack absorbs
  // sub-pixel scroll rounding so the last card still flips `canNext` off.
  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, scrollWidth, clientWidth } = track;
    setCanPrev(scrollLeft > 4);
    setCanNext(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      track.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    // gap-7 = 28px; fall back to ~70% of the viewport when no card is measured.
    const amount = card ? card.offsetWidth + 28 : track.clientWidth * 0.7;
    track.scrollBy({
      left: direction * amount,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <section
      id="projects"
      className="relative mx-auto box-border max-w-[1400px] px-6 pb-16 pt-36 md:px-10"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap items-baseline justify-between gap-6"
      >
        <h2 className="font-heading m-0 text-[clamp(34px,5vw,78px)] font-extrabold uppercase leading-none tracking-[-0.03em]">
          Selected
          <br />
          Work<span className="text-accent">*</span>
        </h2>
        <p className="m-0 max-w-[260px] text-right font-mono text-xs tracking-[0.1em] text-muted-foreground">
          *THE ONES I&apos;M ALLOWED TO SHOW — MOST OF MY WORK LIVES BEHIND
          ENTERPRISE LOGINS
        </p>
      </motion.div>

      {/* Controls — hidden when everything fits without scrolling anyway on the
          smallest sets, but always keyboard-reachable. */}
      <div className="mt-10 flex items-center justify-between gap-4">
        <span className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground">
          {String(projects.length).padStart(2, "0")} PROJECTS — DRAG OR USE →
        </span>
        <div className="flex gap-2.5">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => scrollByCard(dir)}
              disabled={dir === -1 ? !canPrev : !canNext}
              aria-label={dir === -1 ? "Previous project" : "Next project"}
              className="flex size-11 items-center justify-center rounded-full border border-border text-subtle transition-colors duration-300 enabled:cursor-pointer enabled:hover:border-accent enabled:hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
            >
              {dir === -1 ? (
                <ArrowLeft className="size-4" />
              ) : (
                <ArrowRight className="size-4" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={trackRef}
        role="region"
        aria-label="Selected work carousel"
        className="mt-6 flex snap-x snap-mandatory gap-7 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project, i) => (
          <div
            key={project.slug}
            data-card
            className="w-full shrink-0 snap-start"
          >
            <ProjectTile project={project} index={i + 1} className="h-full" />
          </div>
        ))}
      </div>
    </section>
  );
};
