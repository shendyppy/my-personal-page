"use client";

import { useState, useEffect, useRef } from "react";
import { useThemeContext } from "@/app/providers/ThemeProvider";
import { ExperienceCard } from "@/components/molecules/ExperienceCard";
import { Experience } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

type ExperienceResponse = {
  id: string;
  company: string;
  companyLogo: string;
  title: string;
  location: string;
  period: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  projects: string[];
  techStack: string;
  employmentType: string;
  isPublished: boolean;
  order: number;
};

export const Experiences = () => {
  const { theme } = useThemeContext();
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(sectionRef, {
    threshold: 0.1,
    rootMargin: "100px",
  });

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasStartedFetching, setHasStartedFetching] = useState(false);

  const [expandedExperiences, setExpandedExperiences] = useState<number[]>([
    1, 2, 3,
  ]);

  useEffect(() => {
    // Only fetch when section becomes visible and hasn't fetched yet
    if (!isVisible || hasStartedFetching) return;

    setHasStartedFetching(true);

    async function fetchExperiences() {
      try {
        const response = await fetch("/api/experiences");
        const data: ExperienceResponse[] = await response.json();

        // Map API response to match local data structure
        const mappedData: Experience[] = data.map((exp, idx: number) => ({
          id: idx + 1,
          title: exp.title,
          company: exp.company,
          logo: exp.companyLogo,
          location: exp.location,
          period: exp.period,
          current: exp.current,
          description: exp.description,
          responsibilities: exp.responsibilities,
          projects: exp.projects,
          techStack: exp.techStack,
          employmentType: exp.employmentType as
            | "Full Time"
            | "Part Time"
            | "Contract"
            | "Internship",
        }));

        setExperiences(mappedData);
      } catch (error) {
        console.error("Failed to fetch experiences:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchExperiences();
  }, [isVisible, hasStartedFetching]);

  const toggleExperience = (id: number) => {
    setExpandedExperiences((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <section
        ref={sectionRef}
        id="experiences"
        className={`relative max-w-6xl flex flex-col justify-center items-center py-16 px-6 mx-auto transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex flex-col items-center space-y-8 w-full md:w-screen relative z-20">
          <div className="flex flex-col items-center text-center">
            <Skeleton className="h-12 w-48" />
          </div>
          <div className="space-y-4 px-1 w-full md:w-4/5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-border/50 rounded-lg overflow-hidden"
              >
                <div className="w-full p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <Skeleton className="h-6 w-full max-w-[200px]" />
                      <Skeleton className="h-4 w-full max-w-[250px]" />
                      <Skeleton className="h-4 w-full max-w-[150px]" />
                    </div>
                  </div>
                  <Skeleton className="w-6 h-6 self-end md:self-center flex-shrink-0" />
                </div>
                {/* Expanded content skeleton */}
                <div className="p-4 border-t border-border/50 bg-background/40 space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-11/12" />
                      <Skeleton className="h-4 w-10/12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-11/12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="experiences"
      className={`relative max-w-6xl flex flex-col justify-center items-center py-16 px-6 mx-auto transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="flex flex-col items-center space-y-8 w-full relative z-20">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Experiences
            </span>
          </h2>
        </div>

        <div className="space-y-4 px-1 w-full md:w-4/5">
          {experiences.map((exp) => {
            const isExpanded = expandedExperiences.includes(exp.id);
            return (
              <ExperienceCard
                key={exp.id}
                experience={exp}
                isExpanded={isExpanded}
                onToggle={() => toggleExperience(exp.id)}
                theme={theme}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
