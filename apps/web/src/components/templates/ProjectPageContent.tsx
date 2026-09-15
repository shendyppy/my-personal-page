import Image from "next/image";

import { GrainOverlay } from "@/components/effects/GrainOverlay";
import { DiveHud } from "@/components/organisms/DiveHud";
import { ProjectHighlights } from "@/components/organisms/ProjectHighlights";
import { SubEscort } from "@/components/organisms/SubEscort";
import { ProjectPagination } from "@/components/organisms/ProjectPagination";
import type { ProjectDetail, ProjectListItem } from "@/server/queries/projects";

interface ProjectPageContentProps {
  project: ProjectDetail;
  prev?: ProjectListItem | null;
  next?: ProjectListItem | null;
}

/** Case-study page layout. A server component; only the highlight galleries hydrate. */
export const ProjectPageContent = ({
  project,
  prev,
  next,
}: ProjectPageContentProps) => {
  const meta = [
    { k: "ROLE", v: project.scope },
    { k: "CLIENT", v: project.company },
    { k: "TIMELINE", v: project.timeline || project.year },
    { k: "STATUS", v: project.status || project.industry },
  ].filter((m) => m.v);

  return (
    <div className="relative min-h-screen">
      <GrainOverlay />

      <DiveHud mode="surface" />
      {/* The sub followed you up from the reef: it hovers in a fixed corner and
          turns slowly while you read (drag it to spin), never scrolling away. */}
      <SubEscort className="project-sub" />

      {/* Hero */}
      <header className="mx-auto box-border max-w-[1400px] px-6 pt-[120px] md:px-10">
        <div className="flex items-center gap-3.5 overflow-hidden font-mono text-xs tracking-[0.12em] text-muted-foreground">
          <span className="animate-rise text-accent [animation-delay:0.1s]">
            CASE STUDY
          </span>
          {project.year && (
            <span className="animate-rise [animation-delay:0.2s]">
              {project.year}
            </span>
          )}
        </div>

        <h1 className="font-heading m-0 mt-5 overflow-hidden text-balance break-words text-[clamp(22px,4.6vw,64px)] font-extrabold uppercase leading-[1] tracking-[-0.03em]">
          <span className="block animate-rise [animation-delay:0.25s]">
            {project.title}
            <span className="text-accent">.</span>
          </span>
        </h1>

        {project.overview && (
          <p className="mt-6 max-w-[640px] animate-fade-up text-[19px] leading-[1.65] text-subtle [animation-delay:0.5s]">
            {project.overview}
          </p>
        )}

        {meta.length > 0 && (
          <div className="mt-14 grid grid-cols-2 overflow-hidden rounded-2xl border border-border md:grid-cols-4">
            {meta.map((m, i) => (
              <div
                key={m.k}
                className={`bg-card px-6 py-5 ${
                  i > 0 ? "border-l border-border" : ""
                } ${i >= 2 ? "border-t md:border-t-0" : ""}`}
              >
                <div className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground">
                  {m.k}
                </div>
                <div className="mt-2.5 text-[15px] font-medium leading-[1.5]">
                  {m.v}
                </div>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* Hero image. Never wider than its own pixels or taller than most of
          the screen: some banners are 614px wide and one is a 860x1864
          portrait, and stretched to the 1320px column they went soft and
          ran several screens tall. */}
      <div className="mx-auto mt-16 box-border max-w-[1400px] px-6 md:px-10">
        <Image
          src={project.image}
          alt={project.title}
          width={1400}
          height={800}
          className="mx-auto block h-auto max-h-[min(64svh,640px)] w-auto max-w-full rounded-3xl border border-border"
          priority
        />
      </div>

      {/* Story */}
      {(project.storyBlocks.length > 0 || project.stack.length > 0) && (
        <section className="mx-auto box-border grid max-w-[1400px] grid-cols-1 items-start gap-14 px-6 py-32 md:px-10 lg:grid-cols-[4fr_8fr] lg:gap-20">
          <div className="lg:sticky lg:top-[120px]">
            <p className="m-0 font-mono text-xs tracking-[0.14em] text-accent">
              THE STORY
            </p>
            <h2 className="font-heading mt-4.5 text-[clamp(28px,3vw,42px)] font-bold leading-[1.15] tracking-[-0.02em]">
              How it came together.
            </h2>
          </div>

          <div className="flex flex-col gap-14">
            {project.storyBlocks.map((b, i) => (
              <div key={b.title}>
                <h3 className="font-heading m-0 flex items-baseline gap-4 text-[22px] font-bold tracking-[-0.01em]">
                  <span className="font-mono text-[13px] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {b.title}
                </h3>
                <p className="ml-[42px] mt-3.5 text-base leading-[1.75] text-subtle">
                  {b.body}
                </p>
              </div>
            ))}

            {project.stack.length > 0 && (
              <div className="rounded-2xl border border-border bg-card px-9 py-8">
                <p className="m-0 hud-label text-muted-foreground">
                  FULL STACK
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.08em] text-subtle"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {project.highlights.length > 0 && <ProjectHighlights highlights={project.highlights} />}

      {/* Prev/next case studies */}
      <ProjectPagination prev={prev ?? null} next={next ?? null} />
    </div>
  );
};
