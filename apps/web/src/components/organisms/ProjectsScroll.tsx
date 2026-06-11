"use client";

import { motion, useReducedMotion } from "framer-motion";

import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { ProjectTile } from "@/components/molecules/ProjectTile";
import { GradientText } from "@/components/atoms/GradientText";
import { projectTileGradients } from "@/constants/colors";
import type { ProjectListItem } from "@/server/queries/projects";

type ProjectsScrollProps = {
  projects: ProjectListItem[];
};

const Heading = () => (
  <div className="mb-6 md:mb-10">
    <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
      Selected work
    </span>
    <h2 className="font-heading mt-2 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
      <GradientText>Projects</GradientText>
    </h2>
  </div>
);

/**
 * Projects with a responsive treatment:
 * - Desktop (md+): the Aceternity ContainerScroll device-frame — the framed
 *   card rotates from tilted to flat. A 3-col / 2-row grid fits all tiles
 *   inside the frame so none get clipped.
 * - Mobile: the scroll-driven 3D rotate is janky on phones, so we drop it for a
 *   native-scrolling grid whose tiles reveal with a smooth stagger. Pure CSS
 *   switch (hidden/md:block) keeps it SSR-safe — no hydration flash.
 */
export const ProjectsScroll = ({ projects }: ProjectsScrollProps) => {
  const reduceMotion = useReducedMotion();

  const gradientFor = (i: number) =>
    projectTileGradients[i % projectTileGradients.length];

  return (
    <section id="projects" className="relative w-full">
      {/* Mobile — native-scrolling grid with a staggered reveal. */}
      <div className="mx-auto max-w-6xl px-6 py-16 md:hidden">
        <div className="text-center">
          <Heading />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {projects.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <ProjectTile project={project} gradient={gradientFor(i)} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Desktop — scroll-driven device frame (3×2 grid, no clipping). */}
      <div className="hidden md:block">
        <ContainerScroll titleComponent={<Heading />}>
          <div className="grid h-full grid-cols-3 gap-4 p-1">
            {projects.map((project, i) => (
              <ProjectTile
                key={project.slug}
                project={project}
                gradient={gradientFor(i)}
                className="h-full"
              />
            ))}
          </div>
        </ContainerScroll>
      </div>
    </section>
  );
};
