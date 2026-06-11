"use client";

import { Calendar, Briefcase } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { Experience } from "@/types";

interface ExperienceCardProps {
  experience: Experience;
  /** Row position — drives the left/right alternation on desktop. */
  index: number;
  /** Aurora gradient pair (from-via-to) for this row's node + company name. */
  gradient: string;
}

/**
 * One row of the alternating experience timeline. On desktop the meta column
 * (period/role/company) hugs the centre rail and the detail card sits on the
 * opposite side, flipping each row — even rows put the meta on the RIGHT and
 * the card on the LEFT. On mobile everything collapses to a single left-railed
 * column. The detail card keeps its content left-aligned (tidy) while only the
 * column position alternates. Vivid accents come from the per-row aurora
 * `gradient`; everything else is token-based so it reads on both themes.
 */
export const ExperienceCard = ({
  experience,
  index,
  gradient,
}: ExperienceCardProps) => {
  const reduceMotion = useReducedMotion();
  // Even rows: meta on the right, descriptive card on the left.
  const metaOnRight = index % 2 === 0;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative lg:grid lg:grid-cols-2 lg:items-center gap-8 lg:gap-16 ${
        metaOnRight ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      {/* Node on the rail (with a soft aurora glow). */}
      <span
        aria-hidden
        className="absolute left-4 top-7 z-10 -translate-x-1/2 lg:left-1/2"
      >
        <span
          className={`absolute -inset-1 rounded-full bg-gradient-to-br ${gradient} opacity-60 blur-md ${
            experience.current ? "animate-pulse motion-reduce:animate-none" : ""
          }`}
        />
        <span
          className={`relative block size-4 rounded-full bg-gradient-to-br ${gradient} ring-4 ring-background`}
        />
      </span>

      {/* Meta — hugs the rail. */}
      <div
        className={`min-w-0 pl-12 lg:pl-0 ${
          metaOnRight ? "lg:pl-4 lg:text-left" : "lg:pr-4 lg:text-right"
        }`}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-foreground/5 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
          <Calendar className="size-3" />
          {experience.period}
        </span>
        <h3 className="mt-3 text-xl font-bold text-foreground md:text-2xl">
          {experience.title}
        </h3>
        <p
          className={`mt-1 bg-gradient-to-r font-semibold ${gradient} bg-clip-text text-transparent`}
        >
          {experience.company}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {experience.employmentType}
          {experience.current ? " · Current" : ""}
        </p>
      </div>

      {/* Detail card — always left-aligned content. */}
      <div
        className={`min-w-0 mt-4 pl-12 text-left lg:mt-0 lg:pl-0 ${
          metaOnRight ? "lg:pr-4" : "lg:pl-4"
        }`}
      >
        <div className="group/card relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 p-4 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-5 lg:p-6">
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.06] transition-opacity duration-300 group-hover/card:opacity-[0.12]`}
          />

          <div className="relative">
            <p className="text-sm text-muted-foreground md:text-base">
              {experience.description}
            </p>

            {experience.projects.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                  <Briefcase className="size-3" /> Key Projects
                </p>
                <ul className="space-y-1.5">
                  {experience.projects.map((project) => (
                    <li
                      key={project}
                      className="flex items-start gap-2 text-sm text-foreground/80"
                    >
                      <span
                        className={`mt-1.5 size-1.5 shrink-0 rounded-full bg-gradient-to-br ${gradient}`}
                      />
                      {project}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-4 border-t border-border/50 pt-3 text-xs leading-relaxed text-muted-foreground">
              {experience.techStack}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
