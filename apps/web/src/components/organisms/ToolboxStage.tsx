"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { ToolboxCell } from "@/components/molecules/ToolboxCell";
import { useMediaQuery } from "@/hooks/useResponsive";
import { BREAKPOINTS } from "@/constants/config";
import type { Skill, SkillCategory } from "@/types";

export type ToolGroup = { category: SkillCategory; tools: Skill[] };

type ToolboxStageProps = {
  groups: ToolGroup[];
  labels: Partial<Record<SkillCategory, string>>;
};

const gridClass =
  "grid grid-cols-3 gap-px overflow-hidden rounded-[16px] border border-border bg-border sm:grid-cols-4 md:grid-cols-6";

function CategoryHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="mb-4 flex items-baseline gap-3">
      <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
        {label}
      </h3>
      <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground">
        {String(count).padStart(2, "0")}
      </span>
      <span aria-hidden className="h-px flex-1 bg-border" />
    </div>
  );
}

function ToolGrid({ tools }: { tools: Skill[] }) {
  return (
    <div className={gridClass}>
      {tools.map((tool) => (
        <ToolboxCell key={tool.name} name={tool.name} logo={tool.logo} />
      ))}
    </div>
  );
}

/**
 * Pinned horizontal stage — only mounted on desktop with motion enabled, so its
 * scroll ref is always hydrated (keeping `useScroll` happy). The section is
 * tall; its inner panel sticks to the viewport and vertical scroll progress
 * drives the category panels sideways, one screen per category.
 */
function PinnedGroups({
  groups,
  label,
}: {
  groups: ToolGroup[];
  label: (category: SkillCategory) => string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `-${(groups.length - 1) * 100}vw`]
  );

  return (
    <div
      ref={sectionRef}
      style={{ height: `${groups.length * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex">
          {groups.map(({ category, tools }, i) => (
            <div
              key={category}
              className="flex h-screen w-screen shrink-0 items-center justify-center px-6 md:px-10"
            >
              {/* Label on top, grid below — and the pair flips top↔bottom every
                  other panel so scrolling sideways has an alternating rhythm. */}
              <div
                className={`mx-auto flex w-full max-w-[1040px] flex-col items-center justify-center gap-10 text-center ${
                  i % 2 === 1 ? "flex-col-reverse" : ""
                }`}
              >
                <div>
                  <span className="font-mono text-xs tracking-[0.14em] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")} /{" "}
                    {String(groups.length).padStart(2, "0")}
                  </span>
                  <h3 className="font-heading mt-4 text-[clamp(40px,5vw,80px)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]">
                    {label(category)}
                    <span className="text-accent">.</span>
                  </h3>
                  <p className="mt-3 font-mono text-xs tracking-[0.12em] text-muted-foreground">
                    {String(tools.length).padStart(2, "0")} TOOLS — KEEP
                    SCROLLING
                  </p>
                </div>
                <div className="w-full max-w-[760px]">
                  <ToolGrid tools={tools} />
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function VerticalGroups({
  groups,
  label,
}: {
  groups: ToolGroup[];
  label: (category: SkillCategory) => string;
}) {
  return (
    <div className="mx-auto box-border flex max-w-[1400px] flex-col gap-12 px-6 md:px-10">
      {groups.map(({ category, tools }) => (
        <div key={category}>
          <CategoryHeader label={label(category)} count={tools.length} />
          <ToolGrid tools={tools} />
        </div>
      ))}
    </div>
  );
}

/**
 * Chooses how to render the grouped Toolbox:
 *
 * - **Desktop** (≥ lg, motion allowed): the pinned "scroll sideways through the
 *   stack" stage ({@link PinnedGroups}).
 * - **Mobile / reduced-motion**: a plain vertical run of grouped grids, so no
 *   scroll is hijacked and the content stays linear.
 *
 * SSR renders the vertical version (media query resolves to false first), then
 * upgrades to the pinned stage on desktop after mount. `useScroll` lives inside
 * `PinnedGroups` so its ref is only wired when that branch is actually mounted.
 */
export const ToolboxStage = ({ groups, labels }: ToolboxStageProps) => {
  const isDesktop = useMediaQuery({ min: BREAKPOINTS.lg });
  const reduceMotion = useReducedMotion();
  const label = (category: SkillCategory) => labels[category] ?? category;

  return isDesktop && !reduceMotion ? (
    <PinnedGroups groups={groups} label={label} />
  ) : (
    <VerticalGroups groups={groups} label={label} />
  );
};
