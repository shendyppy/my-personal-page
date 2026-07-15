import type { Skill, SkillCategory } from "@/types";
import { ToolboxStage, type ToolGroup } from "@/components/organisms/ToolboxStage";

type ToolboxProps = {
  skills: Skill[];
};

// Display order for the grouped toolbox — from what people first see (frontend)
// down through the stack, then how the work is accelerated (AI) and run
// (project management). Any category with no seeded tools is skipped, so this
// can list more than exist.
const CATEGORY_ORDER: SkillCategory[] = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "AI",
  "Project Management",
];

// Friendlier headings than the terse DB category keys. Falls back to the key.
const CATEGORY_LABELS: Partial<Record<SkillCategory, string>> = {
  AI: "AI & Productivity",
};

/**
 * "Toolbox" — tools grouped by category. On desktop the {@link ToolboxStage}
 * pins and scrolls the categories sideways; on mobile it falls back to a
 * vertical run of grids. The heading stays in the normal max-width column; the
 * stage manages its own (full-bleed) width so the pinned panels can be
 * viewport-wide.
 */
export const Toolbox = ({ skills }: ToolboxProps) => {
  const groups: ToolGroup[] = CATEGORY_ORDER.map((category) => ({
    category,
    tools: skills.filter((skill) => skill.category === category),
  })).filter((group) => group.tools.length > 0);

  return (
    <section id="skills" className="relative pb-36">
      <div className="mx-auto box-border max-w-[1400px] px-6 md:px-10">
        <div className="mb-13 flex flex-wrap items-baseline justify-between gap-6">
          <h2 className="font-heading m-0 text-[clamp(36px,4vw,62px)] font-extrabold uppercase leading-none tracking-[-0.03em]">
            Toolbox
          </h2>
          <p className="m-0 font-mono text-xs tracking-[0.1em] text-muted-foreground">
            <span className="[@media(hover:none)]:hidden">
              HOVER — THEY TILT &amp; LIGHT UP
            </span>
            <span className="hidden [@media(hover:none)]:inline">
              MY EVERYDAY STACK
            </span>
          </p>
        </div>
      </div>

      <ToolboxStage groups={groups} labels={CATEGORY_LABELS} />
    </section>
  );
};
