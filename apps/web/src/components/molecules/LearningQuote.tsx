"use client";

import { Quote } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { useThemeContext } from "@/app/providers/ThemeProvider";

type LearningQuoteProps = {
  text: string;
};

export const LearningQuote = ({ text }: LearningQuoteProps) => {
  const { theme } = useThemeContext();
  const reduceMotion = useReducedMotion();

  const accent =
    theme === "dark" ? "text-yellow-300" : "text-amber-900";
  const bg =
    theme === "dark"
      ? "bg-gradient-to-r from-yellow-500/[0.12] via-yellow-500/[0.04] to-transparent border-yellow-400/60"
      : "bg-gradient-to-r from-amber-500/25 via-amber-500/10 to-transparent border-amber-700/70";

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative flex items-start gap-3 rounded-xl border-l-4 px-4 py-3 md:px-5 md:py-4 shadow-sm ${bg}`}
    >
      <Quote
        aria-hidden
        className={`size-5 md:size-6 shrink-0 mt-0.5 ${accent} fill-current opacity-80`}
      />
      <p
        className={`flex-1 text-sm md:text-base font-semibold italic leading-relaxed ${accent}`}
      >
        {text}
      </p>
    </motion.div>
  );
};
