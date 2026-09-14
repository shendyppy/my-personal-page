import { ChapterHead } from "@/components/atoms/ChapterHead";
import type { ToolGroup } from "@/components/molecules/SonarReadout";
import { ChapterFrame } from "@/components/organisms/ChapterFrame";
import { SonarChart } from "@/components/organisms/SonarChart";
import { chapterById } from "@/constants/dive";
import { SKILL_CATEGORY_LABEL } from "@/constants/labels";
import type { Skill, SkillCategory } from "@/server/queries/skills";

type MidnightChapterProps = { skills: Skill[] };

const chapter = chapterById("midnight");

/** Toolbox order: a category missing here is dropped from the sonar. */
const ORDER: SkillCategory[] = ["Frontend", "Backend", "Database", "DevOps", "AI", "ProjectManagement"];
const LABELS: Partial<Record<SkillCategory, string>> = { AI: "AI & Productivity" };

/** Toolbox. One sonar contact per skill category; hover/focus/tap reads it out. */
export const MidnightChapter = ({ skills }: MidnightChapterProps) => {
  const groups: ToolGroup[] = ORDER.map((category) => ({
    category,
    label: LABELS[category] ?? SKILL_CATEGORY_LABEL[category],
    tools: skills.filter((s) => s.category === category),
  })).filter((g) => g.tools.length > 0);

  return (
    <ChapterFrame id={chapter.id} beats={chapter.beats}>
      <ChapterHead index={chapter.index + 1} category={chapter.category} label={chapter.label} />
      <SonarChart groups={groups} />
    </ChapterFrame>
  );
};
