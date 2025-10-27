import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { projectDetails, getAllProjectSlugs, getProjectBySlug } from "@/data/projects";
import { ProjectPageContent } from "@/components/organisms/ProjectPageContent";

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

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

const ProjectPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const project = projectDetails.find((p) => p.slug === slug);

  if (!project) return notFound();

  return <ProjectPageContent project={project} />;
};

export default ProjectPage;
