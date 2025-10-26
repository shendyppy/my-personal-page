"use client";

import { projectCards } from "@/data/projects";
import { ProjectCard } from "@/components/molecules/ProjectCard";

export const Projects = () => {
  return (
    <section
      id="projects"
      className="relative max-w-6xl flex flex-col justify-center items-center py-16 px-6 mx-auto"
    >
      {/* Floating Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute top-1/8 left-1/10 w-10 h-10 rounded-full bg-[#6366f1]/40 animate-firework" />
        <div className="absolute top-1/3 right-1/8 w-12 h-12 rounded-full bg-[#f472b6]/70 animate-firework delay-300" />
        <div className="absolute bottom-1/10 left-1/8 w-12 h-12 rounded-full bg-[#f97316]/70 animate-firework delay-500" />
      </div>

      <div className="flex flex-col items-center space-y-8 w-full relative z-20">
        {/* Title */}
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
          <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Projects{" "}
          </span>
        </h2>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-2/3 relative z-10">
          {projectCards.map((project, idx) => (
            <ProjectCard key={idx} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};
