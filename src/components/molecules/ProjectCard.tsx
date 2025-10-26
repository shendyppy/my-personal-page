import Image from "next/image";
import Link from "next/link";

import { ProjectCard as ProjectCardType } from "@/types";

interface ProjectCardProps {
  project: ProjectCardType;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group bg-card rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-transform hover:scale-[1.02]"
    >
      <div className="relative w-full h-48">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-card-foreground mb-2">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm">{project.description}</p>
      </div>
    </Link>
  );
};
