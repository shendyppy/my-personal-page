import "server-only";
import { prisma } from "@/lib/prisma";

export type ExperienceDto = {
  id: string;
  company: string;
  companyLogo: string;
  title: string;
  location: string;
  period: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  projects: string[];
  techStack: string;
  employmentType: string;
  isPublished: boolean;
  order: number;
};

export const getExperiences = (): Promise<ExperienceDto[]> =>
  prisma.experience.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });
