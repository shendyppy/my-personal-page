import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { ProjectListItem } from "@/server/queries/projects";

type DiveSiteRecordProps = { project: ProjectListItem; index: number };

/** One project as a dive-site record: text column + porthole screenshot. */
export const DiveSiteRecord = ({ project, index }: DiveSiteRecordProps) => (
  <div className="site" data-beat={index - 1}>
    <div className="site-record" data-site-record>
      <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.14em] text-muted-foreground">
        <span className="text-accent">SITE-{String(index).padStart(2, "0")}</span>
        {project.year && <span>{project.year}</span>}
      </div>
      <h3 className="font-heading m-0 mt-5 text-[clamp(28px,3.4vw,48px)] leading-[1.02] tracking-[-0.02em]">
        {project.title}
      </h3>
      <p className="mt-5 max-w-[46ch] text-base leading-[1.7] text-subtle">{project.description}</p>
      {project.tags.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2 p-0">
          {project.tags.map((t) => (
            <li
              key={t}
              className="list-none rounded-full border border-border px-3 py-1 font-mono text-[10px] tracking-[0.1em] text-muted-foreground"
            >
              {t}
            </li>
          ))}
        </ul>
      )}
      <Link
        href={`/projects/${project.slug}`}
        className="mt-8 inline-flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-foreground transition-colors hover:text-accent"
      >
        OPEN SITE LOG <ArrowUpRight className="size-4" />
      </Link>
    </div>
    <div className="site-image" data-site-image>
      <Image
        src={project.image}
        alt={project.title}
        fill
        sizes="(max-width: 1024px) 100vw, 55vw"
        className="object-cover"
      />
    </div>
  </div>
);
