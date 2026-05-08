"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useThemeContext } from "@/app/providers/ThemeProvider";
import { ExperienceCard } from "@/components/molecules/ExperienceCard";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { queryKeys } from "@/lib/query-keys";
import type { ExperienceDto } from "@/server/queries/experiences";
import type { Experience, EmploymentType } from "@/types";

const fetchExperiences = async (): Promise<ExperienceDto[]> => {
  const res = await fetch("/api/experiences");
  if (!res.ok) throw new Error("Failed to fetch experiences");
  return res.json();
};

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

export const Experiences = () => {
  const { theme } = useThemeContext();

  const { data: rawExperiences = [] } = useQuery({
    queryKey: queryKeys.experiences,
    queryFn: fetchExperiences,
  });

  const experiences = useMemo(() => mapToExperience(rawExperiences), [rawExperiences]);

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

        <div className="space-y-4 px-1 w-full md:w-4/5">
          {experiences.map((exp) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              isExpanded={expandedExperiences.includes(exp.id)}
              onToggle={() => toggleExperience(exp.id)}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};
