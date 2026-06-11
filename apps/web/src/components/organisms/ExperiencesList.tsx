"use client";

import { useMemo } from "react";

import { ExperienceCard } from "@/components/molecules/ExperienceCard";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { GradientText } from "@/components/atoms/GradientText";
import { projectTileGradients } from "@/constants/colors";
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

  return (
    <SectionContainer
      id="experiences"
      className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6"
    >
      <div className="mb-14">
        <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Career
        </span>
        <h2 className="font-heading mt-2 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          <GradientText>Experiences</GradientText>
        </h2>
      </div>

      <div className="relative">
        {/* Centre rail — gradient line behind all rows. */}
        <div
          aria-hidden
          className="absolute left-4 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-aurora-1/70 via-aurora-2/60 to-aurora-3/70 lg:left-1/2"
        />

        <div className="space-y-12 lg:space-y-16">
          {experiences.map((exp, i) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              index={i}
              gradient={projectTileGradients[i % projectTileGradients.length]}
            />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};
