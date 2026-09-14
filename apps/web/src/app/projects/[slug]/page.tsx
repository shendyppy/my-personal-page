import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ProjectPageContent } from "@/components/templates/ProjectPageContent";
import { getProjectBySlug, getProjects } from "@/server/queries/projects";
import { SITE_CONFIG } from "@/constants/config";

// Re-render once per hour at most. Content rarely changes; ISR gives us
// near-static performance while still picking up DB edits.
export const revalidate = 3600;
export const dynamicParams = true;

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

  const title = project.company ? `${project.company} — ${project.title}` : project.title;
  const description = project.overview || project.description;
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

const ProjectPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
  ]);
  if (!project) return notFound();

  // Ordered neighbours for the prev/next pagination at the bottom of the page.
  // `getProjects` orders by `order asc, createdAt desc` — index 0 is "first",
  // last index is "latest", matching the Selected Work grid.
  const index = allProjects.findIndex((p) => p.slug === slug);
  const prev = index > 0 ? (allProjects[index - 1] ?? null) : null;
  const next =
    index >= 0 && index < allProjects.length - 1
      ? (allProjects[index + 1] ?? null)
      : null;

  return <ProjectPageContent project={project} prev={prev} next={next} />;
};

export default ProjectPage;
