import Link from "next/link";
import Image from "next/image";

import type { ProjectListItem } from "@/server/queries/projects";

type Direction = "prev" | "next";

interface ProjectPaginationProps {
  prev: ProjectListItem | null;
  next: ProjectListItem | null;
}

/**
 * Blog-style prev/next navigation for the bottom of a case study. The project
 * list is ordered (`getProjects` → `order asc, createdAt desc`), so:
 *   - first project → next only (prev slot falls back to "all work")
 *   - middle        → both prev + next
 *   - last          → prev only (next slot falls back to "all work")
 * Cards mirror each other: prev image sits on the outer-left, next image on
 * the outer-right, so the two thumbnails frame the composition.
 */
export const ProjectPagination = ({ prev, next }: ProjectPaginationProps) => (
  <footer className="border-t border-border">
    <div className="mx-auto box-border max-w-[1400px] px-6 py-20 md:px-10 md:py-24">
      <p className="mb-10 font-mono text-xs tracking-[0.14em] text-muted-foreground">
        MORE CASE STUDIES
      </p>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2">
        {prev ? <ProjectNavCard project={prev} direction="prev" /> : <AllWorkCard />}
        {next ? <ProjectNavCard project={next} direction="next" /> : <AllWorkCard />}
      </div>
    </div>
  </footer>
);

const ProjectNavCard = ({
  project,
  direction,
}: {
  project: ProjectListItem;
  direction: Direction;
}) => {
  const isPrev = direction === "prev";
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group relative flex flex-col overflow-hidden bg-card transition-colors duration-500 hover:bg-surface md:flex-row ${
        isPrev ? "" : "md:flex-row-reverse"
      }`}
    >
      <div className="relative h-[200px] overflow-hidden md:h-auto md:w-[44%]">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover object-top saturate-[0.85] transition-all duration-700 [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.05] group-hover:saturate-110"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: isPrev
              ? "linear-gradient(to right, transparent 60%, var(--card) 100%)"
              : "linear-gradient(to left, transparent 60%, var(--card) 100%)",
          }}
        />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-8 p-7 md:p-9">
        <span className="font-mono text-[11px] tracking-[0.14em] text-accent">
          {isPrev ? "← PREVIOUS" : "NEXT UP →"}
        </span>
        <div>
          {project.year && (
            <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground">
              {project.year}
            </span>
          )}
          <h3 className="font-heading mt-2 text-[clamp(22px,2.4vw,34px)] font-bold leading-[1.1] tracking-[-0.02em]">
            {project.title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

const AllWorkCard = () => (
  <Link
    href="/#projects"
    className="group flex flex-col items-start justify-between gap-8 bg-card p-7 transition-colors duration-500 hover:bg-surface md:p-9"
  >
    <span className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground">
      ALL WORK
    </span>
    <span className="font-heading text-[clamp(22px,2.4vw,34px)] font-bold leading-[1.1] tracking-[-0.02em] text-subtle transition-colors duration-300 group-hover:text-accent">
      Back to all work →
    </span>
  </Link>
);
