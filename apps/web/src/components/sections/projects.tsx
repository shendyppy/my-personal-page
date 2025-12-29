"use client";

import { useState, useEffect, useRef } from "react";
import { ProjectCard } from "@/components/molecules/ProjectCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(sectionRef, {
    threshold: 0.1,
    rootMargin: "100px",
  });

  const [projects, setProjects] = useState<
    Array<{
      slug: string;
      title: string;
      description: string;
      image: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [hasStartedFetching, setHasStartedFetching] = useState(false);

  useEffect(() => {
    // Only fetch when section becomes visible and hasn't fetched yet
    if (!isVisible || hasStartedFetching) return;

    setHasStartedFetching(true);

    // Show skeleton only after 150ms delay to avoid flash for fast loads
    const skeletonTimer = setTimeout(() => {
      if (loading) {
        setShowSkeleton(true);
      }
    }, 150);

    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        clearTimeout(skeletonTimer);
        setLoading(false);
      }
    }

    fetchProjects();

    return () => {
      clearTimeout(skeletonTimer);
    };
  }, [isVisible, hasStartedFetching, loading]);

  // Only show skeleton if loading takes longer than 150ms
  if (loading && showSkeleton) {
    return (
      <section
        ref={sectionRef}
        id="projects"
        className={`relative max-w-6xl flex flex-col justify-center items-center py-16 px-6 mx-auto transition-all duration-[800ms] ease-out will-change-transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Floating Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div className="absolute top-1/8 left-1/10 w-10 h-10 rounded-full bg-[#6366f1]/40 animate-firework" />
          <div className="absolute top-1/3 right-1/8 w-12 h-12 rounded-full bg-[#f472b6]/70 animate-firework delay-300" />
          <div className="absolute bottom-1/10 left-1/8 w-12 h-12 rounded-full bg-[#f97316]/70 animate-firework delay-500" />
        </div>

        <div className="flex flex-col items-center space-y-8 w-full relative z-20">
          {/* Title skeleton */}
          <Skeleton className="h-12 w-40" />

          {/* Project Grid skeletons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-2/3 relative z-10 items-stretch">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border border-border/50 rounded-lg overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If loading but skeleton not shown yet, show minimal placeholder
  if (loading) {
    return (
      <section
        ref={sectionRef}
        id="projects"
        className="relative max-w-6xl flex flex-col justify-center items-center py-16 px-6 mx-auto min-h-[400px]"
      />
    );
  }

  return (
    <section
      ref={sectionRef}
      id="projects"
      className={`relative max-w-6xl flex flex-col justify-center items-center py-16 px-6 mx-auto transition-all duration-[800ms] ease-out will-change-transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Floating Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute top-1/8 left-1/10 w-10 h-10 rounded-full bg-[#6366f1]/40 animate-firework" />
        <div className="absolute top-1/3 right-1/8 w-12 h-12 rounded-full bg-[#f472b6]/70 animate-firework delay-300" />
        <div className="absolute bottom-1/10 left-1/8 w-12 h-12 rounded-full bg-[#f97316]/70 animate-firework delay-500" />
      </div>

      <div className="flex flex-col items-center space-y-8 w-full relative z-20">
        {/* Title */}
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
          <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Projects{" "}
          </span>
        </h2>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-2/3 relative z-10 items-stretch">
          {projects.map((project, index) => (
            <div
              key={project.slug}
              className="animate-fadeIn"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "both",
              }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
