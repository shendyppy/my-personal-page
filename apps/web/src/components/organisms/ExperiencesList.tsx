"use client";

import { useMemo, useState } from "react";

import { ExperienceCard } from "@/components/molecules/ExperienceCard";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import type { ExperienceDto } from "@/server/queries/experiences";
import type { Experience, EmploymentType } from "@/types";

const mapToExperience = (raw: ExperienceDto[]): Experience[] =>
  raw.map((exp, idx) => ({
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
    employmentType: exp.employmentType as EmploymentType,
  }));

type ExperiencesListProps = {
  initialData: ExperienceDto[];
};

export const ExperiencesList = ({ initialData }: ExperiencesListProps) => {
  const experiences = useMemo(() => mapToExperience(initialData), [initialData]);
  const [expandedExperiences, setExpandedExperiences] = useState<number[]>([1, 2, 3]);

  const toggleExperience = (id: number) => {
    setExpandedExperiences((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  return (
    <SectionContainer
      id="experiences"
      className="relative max-w-6xl flex flex-col justify-center items-center py-16 px-6 mx-auto"
    >
      <div className="flex flex-col items-center space-y-8 w-full relative z-20">
        <SectionHeading>Experiences</SectionHeading>

        <div className="relative w-full md:w-4/5 px-1">
          {/* Timeline rail — gradient line behind all cards */}
          <div
            aria-hidden
            className="absolute left-3 sm:left-4 top-2 bottom-2 w-0.5 bg-linear-to-b from-transparent via-border to-transparent"
          />

          <div className="relative space-y-4">
            {experiences.map((exp) => (
              <ExperienceCard
                key={exp.id}
                experience={exp}
                isExpanded={expandedExperiences.includes(exp.id)}
                onToggle={() => toggleExperience(exp.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
