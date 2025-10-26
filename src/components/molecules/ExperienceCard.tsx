import Image from "next/image";
import { ChevronDown } from "lucide-react";

import { Experience } from "@/types";

interface ExperienceCardProps {
  experience: Experience;
  isExpanded: boolean;
  onToggle: () => void;
  theme: string;
}

export const ExperienceCard = ({
  experience,
  isExpanded,
  onToggle,
  theme,
}: ExperienceCardProps) => {
  return (
    <div className="border border-border/50 rounded-lg overflow-hidden shadow-sm transition hover:shadow-md">
      <button
        onClick={onToggle}
        className={`w-full p-4 text-left transition-all duration-300 hover:bg-accent/10 flex items-center justify-between ${
          experience.current ? "bg-primary/10" : "bg-background"
        }`}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Image
            src={experience.logo}
            width={48}
            height={48}
            alt={`${experience.company} logo`}
            className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-contain bg-white p-1"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h5 className="font-semibold text-base md:text-lg text-foreground truncate">
                {experience.title}
              </h5>
              {experience.current && (
                <span
                  className={`text-xs ${
                    theme === "light"
                      ? "bg-green-500/20 text-green-700"
                      : "bg-green-400 text-green-700"
                  } px-2 py-1 rounded-full whitespace-nowrap`}
                >
                  Current
                </span>
              )}
            </div>
            <p className="text-sm md:text-base text-muted-foreground truncate">
              {experience.company}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
              {experience.period}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`size-5 md:size-6 transition-transform duration-300 ${
            isExpanded ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 border-t border-border/50 bg-background/40">
          <p className="text-sm md:text-base text-muted-foreground mb-4 leading-relaxed">
            {experience.description}
          </p>

          <div className="space-y-4">
            <div>
              <h6 className="font-medium text-sm md:text-base text-foreground mb-2">
                Key Responsibilities:
              </h6>
              <ul className="space-y-2 text-sm md:text-base text-muted-foreground">
                {experience.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="leading-relaxed">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {experience.projects && (
              <div>
                <h6 className="font-medium text-sm md:text-base text-foreground mb-2">
                  Key Projects:
                </h6>
                <ul className="space-y-2 text-sm md:text-base text-muted-foreground">
                  {experience.projects.map((project, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span className="leading-relaxed">{project}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h6 className="font-medium text-sm md:text-base text-foreground mb-2">
                Tech Stack:
              </h6>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {experience.techStack}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
