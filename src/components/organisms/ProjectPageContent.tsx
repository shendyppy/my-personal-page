"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ImageModal } from "@/components/ui/image-modal";
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
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 h-screen">
        <div className="flex justify-start items-start mb-6">
          <Link href="/">
            <Button
              className="!p-0 mt-4 md:mt-6 cursor-pointer hover:translate-x-1 transition-transform duration-200"
              variant="link"
            >
              <ArrowBigLeft />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-stretch gap-4">
          <h1 className="w-full sm:w-4/5 text-xl sm:text-2xl lg:text-3xl font-bold mb-4 leading-tight">
            {project.title}
          </h1>
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-400 sm:text-right">
            {project.company}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-2">Overview</h2>
            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
              {project.overview}
            </p>
          </div>
          <div className="grid lg:flex grid-cols-1 sm:grid-cols-2 lg:flex-col gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border hover:bg-gray-100 transition-colors duration-200">
              <h3 className="text-muted-foreground font-semibold">Scope</h3>
              <p className="text-sm text-gray-600">{project.scope}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border hover:bg-gray-100 transition-colors duration-200">
              <h3 className="text-muted-foreground font-semibold">Industry</h3>
              <p className="text-sm text-gray-600">{project.industry}</p>
            </div>
          </div>
        </div>

        {/* Enhanced highlights with improved animations and single scrollbar */}
        <div className="lg:max-h-screen space-y-24">
          {project.highlights.map((highlight, index) => (
            <div
              key={highlight.id}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16"
            >
              {/* Left side - Enhanced sticky content with smooth animations */}
              <div className="lg:sticky lg:top-20 self-start h-fit">
                <div
                  className="lg:py-8 transform transition-all duration-700 ease-out"
                  style={{
                    animationDelay: `${index * 200}ms`,
                  }}
                >
                  <div className="text-sm text-gray-400 mb-3 font-mono tracking-wider transform hover:scale-110 transition-transform duration-300">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(project.highlights.length).padStart(2, "0")}
                  </div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent hover:from-blue-400 hover:to-purple-800 transition-all duration-500">
                    {highlight.title}
                  </h2>
                  <p className="text-muted-foreground mb-8 whitespace-pre-line leading-relaxed text-base transform hover:translate-x-2 transition-transform duration-300">
                    {highlight.description}
                  </p>

                  {/* Enhanced Impacts with stagger animation */}
                  {highlight.impact?.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-8">
                      {highlight.impact.map((item, i) => (
                        <div
                          key={i}
                          className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 text-sm font-medium hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-300 hover:scale-110 hover:-translate-y-1 cursor-default shadow-sm hover:shadow-md"
                          style={{
                            animationDelay: `${index * 200 + i * 100}ms`,
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Enhanced external link button */}
                  {highlight.link && (
                    <Link
                      href={highlight.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        className="group relative overflow-hidden rounded-2xl border-2 px-6 py-3 font-semibold transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-lg hover:border-yellow-400 hover:text-yellow-600 hover:bg-yellow-100"
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

              {/* Right side - Enhanced scrollable images with single container */}
              <div className="space-y-8">
                {highlight.images.map((img, i) => (
                  <div
                    key={i}
                    className="group relative bg-gradient-to-br from-white via-gray-50 to-gray-100 p-4 rounded-3xl transition-all duration-700 hover:-translate-y-3 hover:rotate-1 transform-gpu cursor-pointer"
                    style={{
                      animationDelay: `${index * 300 + i * 150}ms`,
                    }}
                    onClick={() =>
                      handleImageClick(
                        img.link,
                        `${highlight.title} - Screenshot ${i + 1}`
                      )
                    }
                  >
                    <div className="relative w-full h-[160px] md:h-[220px] lg:h-[280px] overflow-hidden rounded-2xl shadow-inner bg-white">
                      <div
                        className={`absolute inset-0 transition-all duration-[4000ms] ease-in-out ${
                          img.isScrollable && "group-hover:-translate-y-[75%]"
                        } transform-gpu`}
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

                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 via-black/10 to-transparent opacity-70 group-hover:opacity-0 transition-all duration-700"></div>

                      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-all duration-500"></div>
                    </div>

                    <div className="absolute top-6 right-6 bg-black/30 backdrop-blur-md text-white text-sm px-3 py-1.5 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                      {i + 1} / {highlight.images.length}
                    </div>

                    {img.isScrollable && (
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm opacity-60 group-hover:opacity-0 transition-all duration-500 flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                        Hover to explore
                        <div
                          className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    )}

                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      {[...Array(3)].map((_, particleIndex) => (
                        <div
                          key={particleIndex}
                          className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping"
                          style={{
                            top: `${20 + particleIndex * 30}%`,
                            left: `${10 + particleIndex * 35}%`,
                            animationDelay: `${particleIndex * 0.5}s`,
                            animationDuration: "2s",
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
