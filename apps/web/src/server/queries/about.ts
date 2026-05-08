import "server-only";
import { prisma } from "@/lib/prisma";
import type { Club } from "@/types";

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

export type SocialLinkDto = {
  id: string;
  platform: string;
  url: string;
  label: string;
  iconName: string;
  order: number;
};

export type LoveDto = {
  id: string;
  mainName: string;
  mainSrc: string;
  clubs: Club[];
  order: number;
};

export type AboutBundle = {
  aboutSections: AboutSectionDto[];
  cvInfo: CvInfoDto | null;
  techStacks: TechStackDto[];
  socialLinks: SocialLinkDto[];
  loves: LoveDto[];
};

export const getAbout = async (): Promise<AboutBundle> => {
  const [aboutSections, cvInfo, techStacks, socialLinks, loves] =
    await Promise.all([
      prisma.aboutSection.findMany(),
      prisma.cvInfo.findFirst(),
      prisma.techStack.findMany({ orderBy: { order: "asc" } }),
      prisma.socialLink.findMany({ orderBy: { order: "asc" } }),
      prisma.love.findMany({ orderBy: { order: "asc" } }),
    ]);

  // Prisma 6 returns Json columns as parsed objects; the string fallback is for legacy rows.
  const lovesNormalized: LoveDto[] = loves.map((love) => ({
    id: love.id,
    mainName: love.mainName,
    mainSrc: love.mainSrc,
    order: love.order,
    clubs:
      typeof love.clubs === "string"
        ? (JSON.parse(love.clubs) as Club[])
        : (love.clubs as unknown as Club[]),
  }));

  return {
    aboutSections,
    cvInfo,
    techStacks,
    socialLinks,
    loves: lovesNormalized,
  };
};
