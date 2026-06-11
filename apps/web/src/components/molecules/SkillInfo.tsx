import { GradientText } from "@/components/atoms/GradientText";
import { getLevelLabel } from "@/data/skills";
import type { Skill } from "@/types";

type SkillInfoProps = {
  skill: Skill;
};

/**
 * Descriptive stat panel for the currently-selected skill, overlaid on the 3D
 * stage. Turns the otherwise-silent canvas into something readable: name,
 * category, proficiency label + an aurora level bar. Glassy + token-based so
 * it stays legible on top of the model on both themes.
 */
export const SkillInfo = ({ skill }: SkillInfoProps) => (
  <div className="rounded-xl border border-border/50 bg-background/70 p-4 shadow-lg backdrop-blur">
    <div className="flex items-center justify-between gap-2">
      <h4 className="font-heading text-lg font-bold">
        <GradientText>{skill.name}</GradientText>
      </h4>
      <span className="rounded-full border border-border/60 bg-foreground/5 px-2 py-0.5 text-xs font-medium text-muted-foreground">
        {skill.category}
      </span>
    </div>

    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
      <span>{getLevelLabel(skill.level)}</span>
      <span>{skill.level}%</span>
    </div>
    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
      <div
        className="h-full rounded-full bg-gradient-to-r from-aurora-1 to-aurora-2 transition-[width] duration-500 ease-out"
        style={{ width: `${skill.level}%` }}
      />
    </div>
  </div>
);
