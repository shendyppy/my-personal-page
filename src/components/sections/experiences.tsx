"use client";

import { useState } from "react";
import { useThemeContext } from "@/app/providers/ThemeProvider";
import { experiences } from "@/data/experiences";
import { ExperienceCard } from "@/components/molecules/ExperienceCard";

export const Experiences = () => {
  const { theme } = useThemeContext();

  const [expandedExperiences, setExpandedExperiences] = useState<number[]>([
    1, 2,
  ]);

  const toggleExperience = (id: number) => {
    setExpandedExperiences((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  return (
    <section
      id="experiences"
      className="relative max-w-6xl flex flex-col justify-center items-center py-16 px-6 mx-auto"
    >
      <div className="flex flex-col items-center space-y-8 w-full relative z-20">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Experiences
            </span>
          </h2>
        </div>

        <div className="space-y-4 px-1 w-4/5">
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
