"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ImageModal } from "@/components/ui/image-modal";
import { GradientText } from "@/components/atoms/GradientText";
import type { ProjectDetail } from "@/types";

interface ProjectPageContentProps {
  project: ProjectDetail;
}

export const ProjectPageContent = ({ project }: ProjectPageContentProps) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedImageAlt, setSelectedImageAlt] = useState("");

  const handleImageClick = (imageUrl: string, alt: string) => {
    setSelectedImageUrl(imageUrl);
    setSelectedImageAlt(alt);
    setIsImageModalOpen(true);
  };

  return (
    <>
      {/* No overflow-hidden here — it would break the `lg:sticky` highlight
          columns. The aurora backdrop stays contained via absolute inset-0. */}
      <div className="relative h-screen">
        {/* Aurora glow header band — fades out down the page. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[480px]">
          <div className="aurora-radial absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-start justify-start">
            <Link href="/">
              <Button
                className="mt-4 cursor-pointer !p-0 transition-transform duration-200 hover:translate-x-1 md:mt-6"
                variant="link"
              >
                <ArrowBigLeft />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-10 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div className="sm:w-4/5">
              <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                Case study
              </span>
              <h1 className="font-heading mt-2 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                <GradientText>{project.title}</GradientText>
              </h1>
            </div>
            <h2 className="text-lg font-bold text-muted-foreground sm:text-right sm:text-xl">
              {project.company}
            </h2>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur lg:col-span-2">
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Overview
              </h2>
              <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                {project.overview}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:flex lg:flex-col">
              <div className="rounded-2xl border border-border/60 bg-card/50 p-4 backdrop-blur transition-colors duration-200 hover:bg-muted/60">
                <h3 className="font-semibold text-muted-foreground">Scope</h3>
                <p className="mt-1 text-sm text-foreground/80">{project.scope}</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/50 p-4 backdrop-blur transition-colors duration-200 hover:bg-muted/60">
                <h3 className="font-semibold text-muted-foreground">Industry</h3>
                <p className="mt-1 text-sm text-foreground/80">
                  {project.industry}
                </p>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-24">
            {project.highlights.map((highlight, index) => (
              <div
                key={highlight.id}
                className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16"
              >
                {/* Left — sticky content */}
                <div className="self-start h-fit lg:sticky lg:top-20">
                  <div className="transform transition-all duration-700 ease-out lg:py-8">
                    <div className="mb-3 font-mono text-sm tracking-wider text-muted-foreground transition-transform duration-300 hover:scale-110">
                      {String(index + 1).padStart(2, "0")} /{" "}
                      {String(project.highlights.length).padStart(2, "0")}
                    </div>
                    <h2 className="font-heading mb-6 text-2xl font-bold sm:text-3xl">
                      <GradientText>{highlight.title}</GradientText>
                    </h2>
                    <p className="mb-8 whitespace-pre-line text-base leading-relaxed text-muted-foreground transition-transform duration-300 hover:translate-x-2">
                      {highlight.description}
                    </p>

                    {highlight.impact?.length > 0 && (
                      <div className="mb-8 flex flex-wrap gap-3">
                        {highlight.impact.map((item, i) => (
                          <div
                            key={i}
                            className="cursor-default rounded-full border border-aurora-2/30 bg-aurora-2/10 px-4 py-2 text-sm font-medium text-foreground/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:border-aurora-2/50 hover:bg-aurora-2/20 hover:shadow-md"
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
                      >
                        <Button
                          variant="outline"
                          className="group relative overflow-hidden rounded-2xl border-2 px-6 py-3 font-semibold transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-aurora-2 hover:bg-aurora-2/10 hover:text-aurora-2 hover:shadow-lg"
                        >
                          <span className="relative flex items-center gap-2">
                            Visit Project
                            <ArrowBigRight className="transition-transform duration-300 group-hover:-rotate-45 group-hover:translate-x-1" />
                          </span>
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Right — scrollable images */}
                <div className="space-y-8">
                  {highlight.images.map((img, i) => (
                    <div
                      key={i}
                      className="group relative transform-gpu cursor-pointer rounded-3xl border border-border/60 bg-card/60 p-4 backdrop-blur transition-all duration-700 hover:-translate-y-3 hover:rotate-1 hover:border-aurora-2/40 hover:shadow-2xl"
                      onClick={() =>
                        handleImageClick(
                          img.link,
                          `${highlight.title} - Screenshot ${i + 1}`
                        )
                      }
                    >
                      <div className="relative h-[160px] w-full overflow-hidden rounded-2xl bg-muted shadow-inner md:h-[220px] lg:h-[280px]">
                        <div
                          className={`absolute inset-0 transform-gpu transition-all duration-[4000ms] ease-in-out ${
                            img.isScrollable && "group-hover:-translate-y-[75%]"
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
                            priority={i === 0}
                          />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background/40 via-background/10 to-transparent opacity-70 transition-all duration-700 group-hover:opacity-0" />
                      </div>

                      <div className="absolute right-6 top-6 translate-y-2 rounded-full bg-foreground/70 px-3 py-1.5 text-sm font-medium text-background opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        {i + 1} / {highlight.images.length}
                      </div>

                      {img.isScrollable && (
                        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 text-sm text-muted-foreground opacity-60 transition-all duration-500 group-hover:opacity-0">
                          <div className="size-1 animate-bounce rounded-full bg-muted-foreground motion-reduce:animate-none" />
                          Hover to explore
                          <div
                            className="size-1 animate-bounce rounded-full bg-muted-foreground motion-reduce:animate-none"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ImageModal
        isOpen={isImageModalOpen}
        imageUrl={selectedImageUrl}
        imageAlt={selectedImageAlt}
        onClose={() => setIsImageModalOpen(false)}
      />
    </>
  );
};
