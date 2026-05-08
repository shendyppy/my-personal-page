"use client";

import { useQuery } from "@tanstack/react-query";

import { ProjectCard } from "@/components/molecules/ProjectCard";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { queryKeys } from "@/lib/query-keys";
import type { ProjectListItem } from "@/server/queries/projects";

const fetchProjects = async (): Promise<ProjectListItem[]> => {
  const res = await fetch("/api/projects");
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
};

export const Projects = () => {
  const { data: projects = [] } = useQuery({
    queryKey: queryKeys.projects,
    queryFn: fetchProjects,
  });

  return (
    <SectionContainer
      id="projects"
      duration="duration-[800ms]"
      className="relative max-w-6xl flex flex-col justify-center items-center py-16 px-6 mx-auto will-change-transform"
    >
      {/* Floating Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute top-1/8 left-1/10 w-10 h-10 rounded-full bg-[#6366f1]/40 animate-firework" />
        <div className="absolute top-1/3 right-1/8 w-12 h-12 rounded-full bg-[#f472b6]/70 animate-firework delay-300" />
        <div className="absolute bottom-1/10 left-1/8 w-12 h-12 rounded-full bg-[#f97316]/70 animate-firework delay-500" />
      </div>

      <div className="flex flex-col items-center space-y-8 w-full relative z-20">
        <SectionHeading>Projects </SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-2/3 relative z-10 items-stretch">
          {projects.map((project, index) => (
            <div
              key={project.slug}
              className="animate-fadeIn"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "both",
              }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};
