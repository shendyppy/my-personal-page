import { ProjectCard } from "@/components/molecules/ProjectCard";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { getProjects } from "@/server/queries/projects";

export const Projects = async () => {
  const projects = await getProjects();

  return (
    <SectionContainer
      id="projects"
      duration={0.8}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 items-stretch">
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
