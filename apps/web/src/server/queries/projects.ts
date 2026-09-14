import "server-only";
import { prisma } from "@/lib/prisma";

export type ProjectListItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  year: string | null;
  tags: string[];
};

export type ProjectImage = { link: string; isScrollable: boolean };

export type ProjectHighlight = {
  id: string;
  title: string;
  description: string;
  impact: string[];
  images: ProjectImage[];
  link?: string;
};

export type StoryBlock = { title: string; body: string };

export type ProjectDetail = {
  slug: string;
  company: string;
  title: string;
  description: string;
  overview: string;
  scope: string;
  industry: string;
  image: string;
  year: string;
  timeline: string;
  status: string;
  stack: string[];
  storyBlocks: StoryBlock[];
  highlights: ProjectHighlight[];
};

export const getProjects = (): Promise<ProjectListItem[]> =>
  prisma.project.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      image: true,
      year: true,
      tags: true,
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

/** `storyBlocks` is a Json column, so keep only well-formed `{ title, body }` entries. */
const parseStoryBlocks = (value: unknown): StoryBlock[] => {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (b): b is StoryBlock =>
      !!b &&
      typeof b === "object" &&
      typeof (b as StoryBlock).title === "string" &&
      typeof (b as StoryBlock).body === "string"
  );
};

export const getProjectBySlug = async (slug: string): Promise<ProjectDetail | null> => {
  const data = await prisma.project.findUnique({
    where: { slug },
    include: {
      highlights: {
        orderBy: { order: "asc" },
        include: {
          images: { orderBy: { order: "asc" } },
        },
      },
    },
  });
  if (!data) return null;

  return {
    slug: data.slug,
    company: data.company ?? "",
    title: data.title,
    description: data.description,
    overview: data.overview ?? "",
    scope: data.scope ?? "",
    industry: data.industry ?? "",
    image: data.image,
    year: data.year ?? "",
    timeline: data.timeline ?? "",
    status: data.status ?? "",
    stack: data.stack,
    storyBlocks: parseStoryBlocks(data.storyBlocks),
    highlights: data.highlights.map((h) => ({
      id: h.highlightId,
      title: h.title,
      description: h.description,
      impact: h.impact,
      images: h.images.map((img) => ({ link: img.link, isScrollable: img.isScrollable })),
      link: h.link ?? undefined,
    })),
  };
};
