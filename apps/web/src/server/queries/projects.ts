import "server-only";
import { prisma } from "@/lib/prisma";

export type ProjectListItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
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
    },
    orderBy: { createdAt: "desc" },
  });

export const getProjectBySlug = (slug: string) =>
  prisma.project.findUnique({
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
