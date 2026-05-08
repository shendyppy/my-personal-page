import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ProjectPageContent } from "@/components/organisms/ProjectPageContent";
import { getProjectBySlug, getProjects } from "@/server/queries/projects";
import { SITE_CONFIG } from "@/constants/config";
import type { ProjectDetail, ProjectHighlight } from "@/types";

// Re-render once per hour at most. Content rarely changes; ISR gives us
// near-static performance while still picking up DB edits.
export const revalidate = 3600;
export const dynamicParams = true;

type ProjectWithHighlights = NonNullable<Awaited<ReturnType<typeof getProjectBySlug>>>;

export const generateStaticParams = async () => {
  // If the DB is unreachable at build time (Neon cold start, network blip,
  // missing DATABASE_URL on a preview), fall back to an empty list. With
  // `dynamicParams: true` above, pages will be generated + ISR-cached on
  // first request instead of failing the entire build.
  try {
    const projects = await getProjects();
    return projects.map((project) => ({ slug: project.slug }));
  } catch (error) {
    console.warn(
      "[generateStaticParams] DB unreachable; pages will generate on-demand.",
      error
    );
    return [];
  }
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  const title = `${project.company} — ${project.title}`;
  const description = project.overview ?? project.description;
  const url = `/projects/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: SITE_CONFIG.title,
      images: project.image ? [{ url: project.image, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: project.image ? [project.image] : undefined,
    },
  };
};

const mapProjectToDetail = (data: ProjectWithHighlights): ProjectDetail => ({
  slug: data.slug,
  company: data.company ?? "",
  title: data.title,
  overview: data.overview ?? "",
  scope: data.scope ?? "",
  industry: data.industry ?? "",
  highlights: data.highlights.map(
    (h): ProjectHighlight => ({
      id: h.highlightId,
      title: h.title,
      description: h.description,
      impact: h.impact,
      images: h.images.map((img) => ({
        link: img.link,
        isScrollable: img.isScrollable,
      })),
      link: h.link ?? undefined,
    })
  ),
});

const ProjectPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return notFound();

  return <ProjectPageContent project={mapProjectToDetail(project)} />;
};

export default ProjectPage;
