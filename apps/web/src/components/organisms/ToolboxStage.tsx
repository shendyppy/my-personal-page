"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { ToolboxCell } from "@/components/molecules/ToolboxCell";
import type { Skill, SkillCategory } from "@/types";

export type ToolGroup = { category: SkillCategory; tools: Skill[] };

type ToolboxStageProps = {
  groups: ToolGroup[];
  labels: Partial<Record<SkillCategory, string>>;
};

const gridClass =
  "grid grid-cols-3 gap-px overflow-hidden rounded-[16px] border border-border bg-border sm:grid-cols-4 md:grid-cols-6";

// Vertical scroll (in vh) that advances the pinned stage by one category. Less
// than a full screen on purpose: at 100vh each panel needed half a viewport of
// scrolling to flip, so proximity-snap kept dragging you back and the stage felt
// "stuck". The section height and the snap anchors are both derived from this so
// they always stay in sync — tune this one number to make paging feel lighter.
const SCROLL_PER_PANEL_VH = 62;

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
 * Pinned horizontal stage — the signature Toolbox interaction on every width
 * (only reduced-motion falls back to {@link VerticalGroups}). The section is
 * tall; its inner panel sticks to the viewport and vertical scroll progress
 * drives the category panels sideways, one screen per category. Panel content
 * scales down on mobile so nothing spills off the narrow viewport.
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

  // Sticky panel is one viewport (100vh); every extra category adds
  // SCROLL_PER_PANEL_VH of scroll room to page it into view.
  const sectionHeight = 100 + (groups.length - 1) * SCROLL_PER_PANEL_VH;

  return (
    <div
      ref={sectionRef}
      style={{ height: `${sectionHeight}vh` }}
      className="relative"
    >
      {/* Snap anchors — one marker per category, each SCROLL_PER_PANEL_VH tall,
          stacked from the top. Their `start` edges land exactly on the scroll
          offsets where a category sits fully centered (scroll drives the
          horizontal transform 1:1), so the stage settles one panel at a time. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex flex-col"
      >
        {groups.map(({ category }) => (
          <div
            key={category}
            style={{ height: `${SCROLL_PER_PANEL_VH}vh` }}
            className="w-full snap-start"
          />
        ))}
      </div>

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
                className={`mx-auto flex w-full max-w-[1040px] flex-col items-center justify-center gap-7 text-center md:gap-10 ${
                  i % 2 === 1 ? "flex-col-reverse" : ""
                }`}
              >
                <div>
                  <span className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground md:text-xs">
                    {String(i + 1).padStart(2, "0")} /{" "}
                    {String(groups.length).padStart(2, "0")}
                  </span>
                  <h3 className="font-heading mt-3 text-balance text-[clamp(26px,7vw,42px)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em] md:mt-4 md:text-[clamp(40px,5vw,80px)]">
                    {label(category)}
                    <span className="text-accent">.</span>
                  </h3>
                  <p className="mt-2.5 font-mono text-[11px] tracking-[0.12em] text-muted-foreground md:mt-3 md:text-xs">
                    {String(tools.length).padStart(2, "0")} TOOLS — KEEP
                    SCROLLING
                  </p>
                </div>
                <div className="w-full max-w-[320px] md:max-w-[760px]">
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
    <div className="flex flex-col">
      {groups.map(({ category, tools }, i) => (
        // Each category is its own viewport-tall panel (`min-h-svh`) with the
        // content centered, mirroring the desktop pinned stage — so `snap-start`
        // settles one whole category per screen instead of landing mid-list.
        // `svh` keeps the panel stable against mobile browser-chrome resize;
        // `py-24` keeps the label clear of the fixed 68px nav.
        <section
          key={category}
          className="flex min-h-svh snap-start flex-col items-center justify-center gap-9 px-6 py-24"
        >
          <div className="text-center">
            <span className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground">
              {String(i + 1).padStart(2, "0")} /{" "}
              {String(groups.length).padStart(2, "0")}
            </span>
            <h3 className="font-heading mt-3 text-[clamp(34px,10vw,56px)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]">
              {label(category)}
              <span className="text-accent">.</span>
            </h3>
            <p className="mt-2.5 font-mono text-[11px] tracking-[0.12em] text-muted-foreground">
              {String(tools.length).padStart(2, "0")} TOOLS
            </p>
          </div>
          <div className="w-full max-w-[360px]">
            <ToolGrid tools={tools} />
          </div>
        </section>
      ))}
    </div>
  );
}

/**
 * Chooses how to render the grouped Toolbox:
 *
 * - **Default (all widths, motion allowed)**: the pinned "scroll sideways
 *   through the stack" stage ({@link PinnedGroups}) — the same horizontal slide
 *   on mobile and desktop, just with mobile-scaled panels.
 * - **Reduced-motion**: a static vertical run of full-screen category panels
 *   ({@link VerticalGroups}), so no scroll is hijacked.
 *
 * SSR renders the pinned stage (reduced-motion resolves to false first);
 * `useScroll` lives inside `PinnedGroups` so its ref is wired once mounted.
 */
export const ToolboxStage = ({ groups, labels }: ToolboxStageProps) => {
  const reduceMotion = useReducedMotion();
  const label = (category: SkillCategory) => labels[category] ?? category;

  return reduceMotion ? (
    <VerticalGroups groups={groups} label={label} />
  ) : (
    <PinnedGroups groups={groups} label={label} />
  );
};
