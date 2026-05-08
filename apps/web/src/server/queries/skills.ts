import "server-only";
import { prisma } from "@/lib/prisma";
import type { Skill } from "@/types";

export const getSkills = (): Promise<Skill[]> =>
  prisma.skill.findMany({ orderBy: { order: "asc" } }) as unknown as Promise<Skill[]>;
