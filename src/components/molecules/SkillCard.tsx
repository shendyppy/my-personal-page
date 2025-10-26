import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Skill } from "@/types";
import { getLevelLabel } from "@/data/skills";

interface SkillCardProps {
  skill: Skill;
  isActive: boolean;
  colorClasses: string;
  onClick: () => void;
}

export const SkillCard = ({
  skill,
  isActive,
  colorClasses,
  onClick,
}: SkillCardProps) => {
  return (
    <Card
      onClick={onClick}
      className={`
        ${colorClasses}
        cursor-pointer transition-all duration-300
        ${
          isActive
            ? "ring-2 ring-offset-2 ring-secondary scale-[1.05] shadow-xl"
            : "hover:scale-[1.02] hover:shadow-lg"
        }
      `}
    >
      <CardContent className="flex items-start gap-2 p-3 md:p-4 !py-2">
        <Image
          src={skill.logo}
          alt={skill.name}
          width={32}
          height={32}
          className="w-8 h-8 md:w-10 md:h-10 object-contain"
        />
        <div>
          <h4
            className={`font-semibold text-sm xl:text-base ${
              isActive ? "text-accent" : "text-foreground"
            }`}
          >
            {skill.name}
          </h4>
          <p
            className={`text-xs lg:text-sm ${
              isActive ? "text-accent/80" : "text-muted-foreground"
            }`}
          >
            {getLevelLabel(skill.level)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
