"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { ImageModal } from "@/components/ui/image-modal";
import { GrainOverlay } from "@/components/atoms/GrainOverlay";
import { TerminalLogo } from "@/components/atoms/TerminalLogo";
import { ProjectPagination } from "@/components/organisms/ProjectPagination";
import { EXTERNAL_LINKS } from "@/constants/config";
import type { ProjectDetail } from "@/types";
import type { ProjectListItem } from "@/server/queries/projects";

interface ProjectPageContentProps {
  project: ProjectDetail;
  prev?: ProjectListItem | null;
  next?: ProjectListItem | null;
}

export const ProjectPageContent = ({
  project,
  prev,
  next,
}: ProjectPageContentProps) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedImageAlt, setSelectedImageAlt] = useState("");

  const handleImageClick = (imageUrl: string, alt: string) => {
    setSelectedImageUrl(imageUrl);
    setSelectedImageAlt(alt);
    setIsImageModalOpen(true);
  };

  const meta = [
    { k: "ROLE", v: project.scope },
    { k: "CLIENT", v: project.company },
    { k: "TIMELINE", v: project.timeline || project.year },
    { k: "STATUS", v: project.status || project.industry },
  ].filter((m) => m.v);

  return (
    <div className="relative min-h-screen">
      <GrainOverlay />

      {/* Topbar — terminal logo kept identical to the landing nav. */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between px-6 md:px-10">
          <TerminalLogo href="/" />
          <div className="flex items-center gap-7 font-mono text-xs tracking-[0.08em]">
            <Link
              href="/#projects"
              className="text-foreground transition-colors hover:text-accent"
            >
              ← ALL WORK
            </Link>
            <a
              href={`mailto:${EXTERNAL_LINKS.email}`}
              className="rounded-full bg-foreground px-4 py-2 font-bold text-background transition-all duration-200 hover:scale-105 hover:bg-accent hover:text-accent-foreground"
            >
              LET&apos;S TALK
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="mx-auto box-border max-w-[1400px] px-6 pt-[170px] md:px-10">
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

      {/* Hero image */}
      <div className="mx-auto mt-16 box-border max-w-[1400px] px-6 md:px-10">
        <div className="overflow-hidden rounded-3xl border border-border">
          <Image
            src={project.image}
            alt={project.title}
            width={1400}
            height={800}
            className="block h-auto w-full"
            priority
          />
        </div>
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
                <p className="m-0 font-mono text-[11px] tracking-[0.14em] text-muted-foreground">
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

      {/* Highlights + galleries (preserved) */}
      {project.highlights.length > 0 && (
        <section className="mx-auto box-border max-w-[1400px] px-6 pb-32 md:px-10">
          <div className="mb-16 flex flex-col items-start gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <h2 className="font-heading text-[clamp(28px,3.6vw,52px)] font-extrabold uppercase leading-none tracking-[-0.03em]">
              Highlights
            </h2>
            <span className="font-mono text-xs tracking-[0.1em] text-muted-foreground">
              CLICK ANY SHOT TO ENLARGE
            </span>
          </div>

          <div className="space-y-28">
            {project.highlights.map((highlight, index) => (
              <div
                key={highlight.id}
                className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16"
              >
                {/* Sticky content */}
                <div className="h-fit self-start lg:sticky lg:top-[120px]">
                  <div className="mb-3 font-mono text-sm tracking-wider text-muted-foreground">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(project.highlights.length).padStart(2, "0")}
                  </div>
                  <h3 className="font-heading mb-5 text-2xl font-bold tracking-[-0.01em] sm:text-3xl">
                    {highlight.title}
                  </h3>
                  <p className="mb-7 whitespace-pre-line text-base leading-relaxed text-subtle">
                    {highlight.description}
                  </p>

                  {highlight.impact?.length > 0 && (
                    <div className="mb-7 flex flex-wrap gap-2.5">
                      {highlight.impact.map((item, i) => (
                        <div
                          key={i}
                          className="rounded-full border border-border bg-card px-4 py-2 font-mono text-[11px] tracking-[0.06em] text-subtle transition-colors duration-300 hover:border-accent hover:text-accent"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}

                  {highlight.link && (
                    <Link
                      href={highlight.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.12em] text-accent transition-transform duration-300 hover:translate-x-1"
                    >
                      VISIT PROJECT →
                    </Link>
                  )}
                </div>

                {/* Scrollable images */}
                <div className="space-y-8">
                  {highlight.images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      className="group relative block w-full transform-gpu cursor-pointer overflow-hidden rounded-3xl border border-border bg-card p-4 text-left transition-all duration-500 hover:-translate-y-2 hover:border-muted-foreground/50"
                      onClick={() =>
                        handleImageClick(
                          img.link,
                          `${highlight.title} - Screenshot ${i + 1}`
                        )
                      }
                    >
                      <div className="relative h-[160px] w-full overflow-hidden rounded-2xl bg-muted md:h-[220px] lg:h-[280px]">
                        <div
                          className={`absolute inset-0 transform-gpu transition-all duration-[4000ms] ease-in-out ${
                            img.isScrollable ? "group-hover:-translate-y-[75%]" : ""
                          }`}
                        >
                          <Image
                            src={img.link}
                            alt={`${highlight.title} - Screenshot ${i + 1}`}
                            width={600}
                            height={1200}
                            className={`w-full ${
                              img.isScrollable ? "h-auto" : "h-full"
                            } object-contain transition-transform duration-700 group-hover:scale-105`}
                          />
                        </div>
                      </div>

                      <div className="absolute right-6 top-6 translate-y-2 rounded-full bg-foreground/80 px-3 py-1.5 font-mono text-xs text-background opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        {i + 1} / {highlight.images.length}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Prev/next case studies */}
      <ProjectPagination prev={prev ?? null} next={next ?? null} />

      <ImageModal
        isOpen={isImageModalOpen}
        imageUrl={selectedImageUrl}
        imageAlt={selectedImageAlt}
        onClose={() => setIsImageModalOpen(false)}
      />
    </div>
  );
};
