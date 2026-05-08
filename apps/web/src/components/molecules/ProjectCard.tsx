"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { ProjectCard as ProjectCardType } from "@/types";

interface ProjectCardProps {
  project: ProjectCardType;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block h-full"
    >
      {/* Glow on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-30 rounded-2xl blur-lg transition-all duration-500 animate-gradient-x" />

      {/* Main card — spring lift on hover */}
      <motion.div
        whileHover={
          reduceMotion
            ? undefined
            : {
                y: -6,
                rotate: -0.4,
                transition: { type: "spring", stiffness: 280, damping: 22 },
              }
        }
        whileTap={reduceMotion ? undefined : { scale: 0.985 }}
        className="relative h-full bg-card rounded-2xl border border-border/30 overflow-hidden hover:shadow-2xl flex flex-col"
      >
        <div className="relative w-full h-52 overflow-hidden flex-shrink-0">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80" />
        </div>

        <div className="p-5 relative flex flex-col flex-1">
          <div className="absolute top-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
            {project.title}
          </h3>

          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
            {project.description}
          </p>

          <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:text-accent transition-colors">
            <span>View Project</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
