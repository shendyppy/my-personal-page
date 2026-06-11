import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ProjectCard as ProjectCardType } from "@/types";

type ProjectTileProps = {
  project: ProjectCardType;
  /** Aurora gradient class pair, assigned per index by the parent. */
  gradient: string;
  className?: string;
};

/**
 * Compact, vivid project tile (Lovable-style) for the ContainerScroll frame.
 * The project image sits as a faint textured backdrop under the gradient + a
 * dark scrim, so white text stays readable regardless of the active theme.
 */
export const ProjectTile = ({
  project,
  gradient,
  className,
}: ProjectTileProps) => (
  <Link
    href={`/projects/${project.slug}`}
    className={cn(
      `group relative flex min-h-[9.5rem] flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 md:min-h-[13rem] md:p-7`,
      className
    )}
  >
    <Image
      src={project.image}
      alt=""
      fill
      sizes="(max-width: 768px) 50vw, 33vw"
      className="object-cover opacity-25 transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/25" />

    <div className="relative">
      <h3 className="line-clamp-2 text-lg font-bold text-white md:text-2xl">
        {project.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-white/85 md:text-base">
        {project.description}
      </p>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-white md:mt-4">
        View Project
        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </div>
  </Link>
);
