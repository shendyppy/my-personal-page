import "server-only";
import type { SkillCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type { SkillCategory };

export type Skill = {
  name: string;
  level: number;
  category: SkillCategory;
  logo: string;
};

export const getSkills = (): Promise<Skill[]> =>
  prisma.skill.findMany({
    select: { name: true, level: true, category: true, logo: true },
    orderBy: { order: "asc" },
  });
