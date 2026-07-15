import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ProjectListItem } from "@/server/queries/projects";

type ProjectTileProps = {
  project: ProjectListItem;
  /** 1-based position, rendered as the `01` index label. */
  index: number;
  className?: string;
};

/**
 * Large editorial "Selected Work" card — text column (index / year / title /
 * description / tags / CTA) beside a masked, hover-zooming project image. On
 * mobile it collapses to a single column with the image stacked below.
 */
export const ProjectTile = ({ project, index, className }: ProjectTileProps) => (
  <Link
    href={`/projects/${project.slug}`}
    className={cn(
      "group relative grid min-h-[420px] grid-cols-1 overflow-hidden rounded-3xl border border-border bg-card text-foreground transition-colors duration-500 hover:border-muted-foreground/50 md:grid-cols-2",
      className
    )}
  >
    <div className="flex flex-col justify-between gap-8 p-8 md:p-11">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[13px] text-accent">
          {String(index).padStart(2, "0")}
        </span>
        {project.year && (
          <span className="rounded-full border border-border px-3 py-1.5 font-mono text-[11px] tracking-[0.1em] text-muted-foreground">
            {project.year}
          </span>
        )}
      </div>

      <div>
        <h3 className="font-heading text-[clamp(28px,3vw,44px)] font-bold leading-[1.05] tracking-[-0.02em]">
          {project.title}
        </h3>
        <p className="mt-4 max-w-[400px] text-[15px] leading-[1.6] text-subtle">
          {project.description}
        </p>
        {project.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <span className="inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.12em] text-accent">
        READ CASE STUDY
        <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </div>

    <div className="relative min-h-[240px] overflow-hidden md:min-h-full">
      <Image
        src={project.image}
        alt={project.title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover object-top saturate-[0.85] transition-all duration-700 [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.06] group-hover:saturate-110"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, var(--card) 0%, transparent 30%)",
        }}
      />
    </div>
  </Link>
);
