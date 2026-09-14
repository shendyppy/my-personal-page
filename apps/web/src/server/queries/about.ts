import "server-only";
import { prisma } from "@/lib/prisma";

export type AboutSectionDto = {
  id: string;
  key: string;
  title: string | null;
  content: string;
};

export type CvInfoDto = {
  id: string;
  title: string;
  previewImage: string;
  downloadPath: string;
};

export type TechStackDto = {
  id: string;
  name: string;
  src: string;
  order: number;
};

export type AboutBundle = {
  aboutSections: AboutSectionDto[];
  cvInfo: CvInfoDto | null;
  techStacks: TechStackDto[];
};

export const getAbout = async (): Promise<AboutBundle> => {
  // Only what the twilight and seafloor chapters render.
  const [aboutSections, cvInfo, techStacks] = await Promise.all([
    prisma.aboutSection.findMany(),
    prisma.cvInfo.findFirst(),
    prisma.techStack.findMany({ orderBy: { order: "asc" } }),
  ]);
  return { aboutSections, cvInfo, techStacks };
};
