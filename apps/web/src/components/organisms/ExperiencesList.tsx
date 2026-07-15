import { ExperienceCard } from "@/components/molecules/ExperienceCard";
import type { ExperienceDto } from "@/server/queries/experiences";

type ExperiencesListProps = {
  initialData: ExperienceDto[];
};

/**
 * Career — an editorial timeline. Each role is a full-width row; the
 * employment-type badge (Full-Time / Freelance / Contract) surfaces how the
 * engagement worked, with current roles highlighted in the accent.
 */
export const ExperiencesList = ({ initialData }: ExperiencesListProps) => {
  return (
    <section
      id="experiences"
      className="relative mx-auto box-border max-w-[1400px] px-6 pb-36 pt-16 md:px-10"
    >
      <h2 className="font-heading mb-14 text-[clamp(48px,5.4vw,84px)] font-extrabold uppercase leading-none tracking-[-0.03em]">
        Career<span className="text-accent">.</span>
      </h2>

      <div className="border-t border-border">
        {initialData.map((exp) => (
          <ExperienceCard
            key={exp.id}
            period={exp.period}
            title={exp.title}
            company={exp.company}
            summary={exp.description}
            employmentType={exp.employmentType}
            current={exp.current}
          />
        ))}
      </div>
    </section>
  );
};
