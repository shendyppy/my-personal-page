"use client";

import Image from "next/image";
import { ArrowBigRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { GradientText } from "@/components/atoms/GradientText";
import type { Love } from "@/types";

type LoveCardProps = {
  loves: Love[];
};

/**
 * "What I Love" card. A flat horizontal layout per row — main category
 * on the left, arrow, then each club in a stagger-revealed cluster.
 *
 * Design notes:
 * - No absolute positioning anywhere → no overlap / "nabrak" issues that
 *   the previous implementation had when the desktop hover translate
 *   collided with the absolutely-positioned clubs container.
 * - On idle: clubs are visible but dimmed + scaled down (subtle hint
 *   that there's more on hover). Stays readable on mobile where there
 *   is no hover.
 * - On hover (desktop pointer): main icon glows + scales; clubs cascade
 *   in with stagger via Framer Motion variants. Clean, predictable.
 * - Reduced motion: skips the cascade, just brightens.
 */
export const LoveCard = ({ loves }: LoveCardProps) => {
  const reduceMotion = useReducedMotion();

  const containerVariants = {
    rest: {
      transition: reduceMotion
        ? {}
        : { staggerChildren: 0.04, staggerDirection: -1 },
    },
    hover: {
      transition: reduceMotion
        ? {}
        : { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const clubVariants = {
    rest: {
      opacity: 0.55,
      scale: 0.88,
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
    hover: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const mainVariants = {
    rest: {
      scale: 1,
      boxShadow: "0 0 0 0 rgba(99, 102, 241, 0)",
    },
    hover: {
      scale: 1.08,
      boxShadow: "0 8px 24px -8px rgba(99, 102, 241, 0.55)",
      transition: { type: "spring" as const, stiffness: 260, damping: 22 },
    },
  };

  const arrowVariants = {
    rest: { x: 0, opacity: 0.6 },
    hover: { x: 4, opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <Card className="col-span-1 lg:col-span-2 p-4 md:p-6 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl">
      <h4 className="text-right font-heading text-base md:text-lg lg:text-xl font-bold text-foreground mb-4 md:mb-5">
        <GradientText>What I Love</GradientText>
      </h4>

      <div className="flex flex-col gap-6">
        {loves.map((love, idx) => (
          <motion.div
            key={idx}
            className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap"
            initial="rest"
            whileHover="hover"
            whileFocus="hover"
            animate="rest"
            variants={containerVariants}
            tabIndex={0}
          >
            {/* Main category — always visible, glows on hover */}
            <motion.div
              className="relative shrink-0 rounded-full bg-background/60 backdrop-blur-sm p-2 border border-border/60"
              variants={mainVariants}
              aria-label={love.main.name}
            >
              <Image
                src={love.main.src}
                width={120}
                height={120}
                alt={love.main.name}
                className="size-9 sm:size-11 lg:size-12"
              />
              <motion.span
                className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 bg-foreground text-background text-[11px] px-2 py-0.5 rounded-md whitespace-nowrap shadow-md"
                variants={{
                  rest: { opacity: 0, y: -4 },
                  hover: { opacity: 1, y: 0, transition: { duration: 0.25 } },
                }}
              >
                {love.main.name}
              </motion.span>
            </motion.div>

            {/* Arrow */}
            <motion.div
              className="shrink-0 text-muted-foreground"
              variants={arrowVariants}
              aria-hidden
            >
              <ArrowBigRight className="size-5 sm:size-6" />
            </motion.div>

            {/* Clubs — stagger reveal */}
            <div className="flex items-center gap-2 sm:gap-3">
              {love.clubs.map((club, i) => (
                <motion.div
                  key={i}
                  className="relative shrink-0 rounded-full bg-background/60 backdrop-blur-sm p-1.5 sm:p-2 border border-border/60 hover:border-accent/60 transition-colors"
                  variants={clubVariants}
                  whileHover={
                    reduceMotion
                      ? undefined
                      : { scale: 1.12, transition: { type: "spring", stiffness: 300, damping: 18 } }
                  }
                  aria-label={club.name}
                >
                  <Image
                    src={club.src}
                    width={80}
                    height={80}
                    alt={club.name}
                    className="size-7 sm:size-8 md:size-9"
                  />
                  <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-2 py-0.5 rounded-md whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-200 shadow-md">
                    {club.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};
