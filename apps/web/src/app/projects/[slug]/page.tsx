import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProjectPageContent } from "@/components/organisms/ProjectPageContent";
import type { ProjectDetail, ProjectHighlight } from "@/types";

type ProjectWithHighlights = {
  slug: string;
  title: string;
  description: string;
  image: string;
  company: string | null;
  overview: string | null;
  scope: string | null;
  industry: string | null;
  highlights: Array<{
    highlightId: string;
    title: string;
    description: string;
    impact: string[];
    link: string | null;
    images: Array<{
      link: string;
      isScrollable: boolean;
    }>;
  }>;
};

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.company} | Shendy's Portfolio`,
    description: project.title,
    openGraph: {
      title: `${project.company} | Shendy's Portfolio`,
      description: project.title,
      type: "website",
    },
  };
}

const mapProjectToDetail = (data: ProjectWithHighlights): ProjectDetail => ({
  slug: data.slug,
  company: data.company || "",
  title: data.title,
  overview: data.overview || "",
  scope: data.scope || "",
  industry: data.industry || "",
  highlights: data.highlights.map((h): ProjectHighlight => ({
    id: h.highlightId,
    title: h.title,
    description: h.description,
    impact: h.impact,
    images: h.images.map((img) => ({
      link: img.link,
      isScrollable: img.isScrollable,
    })),
    link: h.link || undefined,
  })),
});

const ProjectPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      highlights: {
        include: {
          images: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!project) return notFound();

  const projectDetail = mapProjectToDetail(project as ProjectWithHighlights);

  return <ProjectPageContent project={projectDetail} />;
};

export default ProjectPage;
