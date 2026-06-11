"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useThemeContext } from "@/app/providers/ThemeProvider";
import { skillCategoryColors } from "@/constants/colors";
import { SKILL_CATEGORIES, type SkillCategoryFilter } from "@/constants/config";
import { Skill } from "@/types";
import { Rotate3d } from "lucide-react";
import { SkillCard } from "@/components/molecules/SkillCard";
import { SkillInfo } from "@/components/molecules/SkillInfo";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { GradientText } from "@/components/atoms/GradientText";

// Lazy-load the R3F + drei + three bundle (~600 KB) — only fetched when
// the Skills section actually renders. ssr:false because Three.js needs
// `window` and would crash the server.
const SkillCanvas = dynamic(
  () => import("@/components/molecules/SkillCanvas"),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-full" />,
  }
);

type SkillsListProps = {
  initialData: Skill[];
};

export const SkillsList = ({ initialData }: SkillsListProps) => {
  const { theme } = useThemeContext();
  const skills = initialData;

  const [filter, setFilter] = useState<SkillCategoryFilter>("All");
  const [animatingKey, setAnimatingKey] = useState(0);
  const [explicitSelected, setExplicitSelected] = useState<Skill | null>(null);

  const filteredSkills = useMemo(
    () => (filter === "All" ? skills : skills.filter((s) => s.category === filter)),
    [filter, skills]
  );

  const selectedSkill: Skill | null = explicitSelected ?? filteredSkills[0] ?? null;

  const handleFilterChange = (newFilter: SkillCategoryFilter) => {
    setFilter(newFilter);
    setExplicitSelected(null);
    setAnimatingKey((prev) => prev + 1);
  };

  if (!selectedSkill) return null;

  return (
    <SectionContainer
      id="skills"
      className="max-w-6xl px-6 py-16 relative overflow-hidden space-y-8 !mx-auto"
    >
      <div className="text-right">
        <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Toolbelt
        </span>
        <h2 className="font-heading mt-2 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          <GradientText>Experiments</GradientText>
        </h2>
        <p className="mt-2 text-muted-foreground md:text-lg">
          Explore the{" "}
          <span className="font-semibold text-foreground">3D orbit</span> of
          skills and browse the categorized cards.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
        <div className="relative w-full">
          {/* 3D stage */}
          <div className="relative flex h-[50vh] items-center justify-center rounded-xl lg:h-[calc(100dvh-12rem)]">
            {/* Aurora glow stage so the 3D model reads with depth on both themes. */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 size-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-aurora-1/15 via-aurora-2/10 to-aurora-3/15 blur-3xl"
            />
            {/* Discoverability hint — the canvas is drag-to-rotate. */}
            <span className="pointer-events-none absolute top-3 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border/50 bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <Rotate3d className="size-3.5" />
              Drag to rotate
            </span>

            <div className="relative z-10 w-full h-[300px] lg:h-full animate-fadeIn">
              <SkillCanvas skill={selectedSkill} theme={theme} />
            </div>
          </div>

          {/* Selected-skill stats — below the stage on mobile (no overlap with
              the model), overlaid on the stage on desktop. */}
          <div className="relative z-20 mt-3 lg:absolute lg:inset-x-3 lg:bottom-3 lg:mt-0">
            <SkillInfo skill={selectedSkill} />
          </div>
        </div>

        <div className="w-full flex flex-col gap-4">
          <div className="flex gap-2 mb-2 flex-wrap justify-start">
            {SKILL_CATEGORIES.map((cat) => (
              <Button
                key={cat}
                onClick={() => handleFilterChange(cat)}
                className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-all duration-300
                  ${
                    filter === cat
                      ? "scale-105 border-0 bg-gradient-to-r from-aurora-1 to-aurora-2 text-white shadow-md shadow-aurora-2/30 hover:shadow-lg"
                      : theme === "dark"
                      ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                  }`}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div
            key={animatingKey}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 items-start"
          >
            {filteredSkills.map((skill, index) => {
              const isActive = selectedSkill.name === skill.name;
              const colorClasses =
                skillCategoryColors[skill.category][theme as "light" | "dark"];

              return (
                <div
                  key={skill.name}
                  className="animate-fadeIn"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <SkillCard
                    skill={skill}
                    isActive={isActive}
                    colorClasses={colorClasses}
                    onClick={() => setExplicitSelected(skill)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
