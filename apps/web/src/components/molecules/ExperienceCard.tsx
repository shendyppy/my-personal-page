"use client";

import { motion, useReducedMotion } from "framer-motion";

interface ExperienceCardProps {
  period: string;
  title: string;
  company: string;
  summary: string;
  /** Employment type badge — e.g. "Full Time", "Freelance", "Contract". */
  employmentType: string;
  /** Current roles get the accent treatment on the period + badge. */
  current: boolean;
}

/**
 * One Career row in the editorial timeline: period · role+company · summary ·
 * an employment-type badge. Current roles glow in the brand accent; the row
 * eases in on scroll and nudges right on hover.
 */
export const ExperienceCard = ({
  period,
  title,
  company,
  summary,
  employmentType,
  current,
}: ExperienceCardProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 items-start gap-4 border-b border-border px-2 py-9 transition-[background,padding] duration-300 hover:bg-card hover:pl-6 md:grid-cols-4 md:gap-8"
    >
      <span
        className={`font-mono text-xs leading-relaxed tracking-[0.08em] md:pt-1 ${
          current ? "text-accent" : "text-muted-foreground"
        }`}
      >
        {period}
      </span>

      <div>
        <h3 className="font-heading text-2xl font-bold tracking-[-0.01em]">
          {title}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{company}</p>
      </div>

      <p className="text-sm leading-[1.6] text-subtle md:pt-0.5">{summary}</p>

      <span
        className={`w-fit whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] md:mt-1 ${
          current
            ? "border-accent/40 text-accent"
            : "border-border text-muted-foreground"
        }`}
      >
        {employmentType}
        {current ? " · Current" : ""}
      </span>
    </motion.div>
  );
};
