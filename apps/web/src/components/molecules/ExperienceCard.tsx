"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useTilt } from "@/hooks/useTilt";
import type { Experience, EmploymentType } from "@/types";

interface ExperienceCardProps {
  experience: Experience;
  isExpanded: boolean;
  onToggle: () => void;
}

type EmploymentTheme = {
  /** Solid color for the timeline dot. */
  dot: string;
  /** Pill background + text + border. */
  pill: string;
  /** Aurora gradient tint for the card body. */
  wash: string;
  /** Optional subtle ring on the whole card. */
  ring: string;
};

const employmentThemes: Record<EmploymentType, EmploymentTheme> = {
  "Full Time": {
    dot: "bg-emerald-500",
    pill: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    wash: "from-emerald-500/[0.07]",
    ring: "ring-emerald-500/20",
  },
  "Part Time": {
    dot: "bg-blue-500",
    pill: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
    wash: "from-blue-500/[0.07]",
    ring: "ring-blue-500/20",
  },
  Contract: {
    dot: "bg-orange-500",
    pill: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30",
    wash: "from-orange-500/[0.07]",
    ring: "ring-orange-500/20",
  },
  Internship: {
    dot: "bg-purple-500",
    pill: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
    wash: "from-purple-500/[0.07]",
    ring: "ring-purple-500/20",
  },
};

export const ExperienceCard = ({
  experience,
  isExpanded,
  onToggle,
}: ExperienceCardProps) => {
  const reduceMotion = useReducedMotion();
  const { ref: tiltRef, rotateX, rotateY } = useTilt<HTMLDivElement>({ max: 3 });
  const theme =
    employmentThemes[experience.employmentType] ?? employmentThemes["Full Time"];

  return (
    <div className="relative pl-9 sm:pl-12">
      {/* Timeline dot — sits on the rail rendered by the parent list.
          Aligned so dot center = rail center: left-1.5 + size-3.5/2 = 13px. */}
      <span
        aria-hidden
        className={`absolute left-0.5 sm:left-1.5 top-7 z-10 size-3.5 rounded-full ring-4 ring-background ${theme.dot} ${
          experience.current ? "animate-pulse" : ""
        }`}
      />

      <motion.div
        ref={tiltRef}
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1600,
          transformStyle: "preserve-3d",
        }}
        className={`relative border border-border/50 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow ${
          experience.current ? `ring-1 ${theme.ring}` : ""
        }`}
      >
        {/* Aurora wash */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${theme.wash} via-transparent to-transparent`}
        />

        <button
          onClick={onToggle}
          aria-expanded={isExpanded}
          className="relative w-full p-4 text-left transition-colors duration-200 hover:bg-accent/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background/40"
          style={{ transform: "translateZ(20px)" }}
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Image
              src={experience.logo}
              width={48}
              height={48}
              alt={`${experience.company} logo`}
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-contain bg-white p-1 flex-shrink-0 shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <h5 className="font-semibold text-base md:text-lg text-foreground">
                  {experience.title}
                </h5>
                <div className="flex items-center gap-2 flex-wrap">
                  {experience.current && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full whitespace-nowrap">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Current
                    </span>
                  )}
                  <span
                    className={`text-xs font-medium border px-2 py-0.5 rounded-full whitespace-nowrap ${theme.pill}`}
                  >
                    {experience.employmentType}
                  </span>
                </div>
              </div>
              <p className="text-sm md:text-base font-medium text-foreground/80">
                {experience.company}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                {experience.period}
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="self-end md:self-center flex-shrink-0"
          >
            <ChevronDown className="size-5 md:size-6" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="content"
              initial={reduceMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.3 },
              }}
              className="overflow-hidden"
              style={{ transform: "translateZ(15px)" }}
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

                  {experience.projects && experience.projects.length > 0 && (
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
