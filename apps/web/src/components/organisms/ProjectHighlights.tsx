"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { ImageModal } from "@/components/ui/image-modal";
import type { ProjectHighlight } from "@/server/queries/projects";

type Shot = { url: string; alt: string };

/**
 * Highlights + galleries: the only interactive part of a case study (a click
 * enlarges a shot), so it is the page's client island.
 */
export const ProjectHighlights = ({ highlights }: { highlights: ProjectHighlight[] }) => {
  const [shot, setShot] = useState<Shot | null>(null);

  const handleImageClick = (url: string, alt: string) => setShot({ url, alt });

  return (
    <>
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
          {highlights.map((highlight, index) => (
            <div
              key={highlight.id}
              className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16"
            >
              {/* Sticky content */}
              <div className="h-fit self-start lg:sticky lg:top-[120px]">
                <div className="mb-3 font-mono text-sm tracking-wider text-muted-foreground">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(highlights.length).padStart(2, "0")}
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

      <ImageModal
        isOpen={shot !== null}
        imageUrl={shot?.url ?? ""}
        imageAlt={shot?.alt ?? ""}
        onClose={() => setShot(null)}
      />
    </>
  );
};
