"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { GradientText } from "@/components/atoms/GradientText";
import { useTilt } from "@/hooks/useTilt";
import type { Club, Love } from "@/types";

type LoveCardProps = {
  loves: Love[];
};

type LoveTheme = {
  /** Soft tinted bg (gradient) for the row. */
  rowBg: string;
  /** Border + accent color for the row. */
  border: string;
  /** Glow halo color behind the main icon. */
  glow: string;
};

const FALLBACK_THEME: LoveTheme = {
  rowBg: "bg-muted/40",
  border: "border-border/40",
  glow: "bg-foreground/20",
};

const LOVE_THEMES: Record<string, LoveTheme> = {
  "DOTA 2": {
    rowBg:
      "bg-gradient-to-r from-red-500/15 via-red-500/[0.04] to-transparent",
    border: "border-red-500/30",
    glow: "bg-red-500/30",
  },
  Football: {
    rowBg:
      "bg-gradient-to-r from-emerald-500/15 via-emerald-500/[0.04] to-transparent",
    border: "border-emerald-500/30",
    glow: "bg-emerald-500/30",
  },
  Basketball: {
    rowBg:
      "bg-gradient-to-r from-orange-500/15 via-orange-500/[0.04] to-transparent",
    border: "border-orange-500/30",
    glow: "bg-orange-500/30",
  },
};

const rowVariants = {
  rest: { x: 0 },
  hover: {
    x: 4,
    transition: { type: "spring" as const, stiffness: 300, damping: 22 },
  },
};

const iconVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.12,
    rotate: -4,
    transition: { type: "spring" as const, stiffness: 280, damping: 15 },
  },
};

const ringVariants = {
  rest: { scale: 1, opacity: 0 },
  hover: {
    scale: 1.6,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const clubContainerVariants = {
  rest: {},
  hover: {
    transition: { staggerChildren: 0.05, delayChildren: 0.08 },
  },
};

const clubVariants = {
  rest: {
    opacity: 0.6,
    y: 4,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
  hover: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 350, damping: 18 },
  },
};

type ClubChipProps = {
  club: Club;
  reduceMotion: boolean;
};

const ClubChip = ({ club, reduceMotion }: ClubChipProps) => {
  const hoverProps = reduceMotion
    ? {}
    : {
        whileHover: {
          scale: 1.15,
          y: -3,
          transition: { type: "spring" as const, stiffness: 400, damping: 15 },
        },
        whileTap: { scale: 0.95 },
      };

  const inner = (
    <>
      <div
        className="relative rounded-md bg-background/80 backdrop-blur-sm p-1 md:p-1.5 border border-border/50 group-hover/club:border-foreground/40 transition-colors shadow-sm"
      >
        <Image
          src={club.src}
          width={80}
          height={80}
          alt={club.name}
          className="size-6 sm:size-7 md:size-8 object-contain"
        />

        {/* Clickable affordance — pulsing dot resting state, arrow badge on hover */}
        {club.url ? (
          <>
            {/* Resting pulse — subtle attention-getter */}
            <span
              aria-hidden
              className="absolute -top-0.5 -right-0.5 flex size-2 group-hover/club:opacity-0 transition-opacity duration-200"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            {/* Hover arrow badge */}
            <span
              aria-hidden
              className="absolute -top-1 -right-1 size-4 rounded-full bg-foreground text-background flex items-center justify-center shadow-md scale-0 opacity-0 group-hover/club:scale-100 group-hover/club:opacity-100 transition-all duration-200"
            >
              <ArrowUpRight className="size-2.5" strokeWidth={3} />
            </span>
          </>
        ) : null}
      </div>
      <span className="text-[9px] md:text-[10px] font-medium text-muted-foreground w-full text-center leading-tight line-clamp-2 group-hover/club:text-foreground transition-colors">
        {club.name}
      </span>
    </>
  );

  if (club.url) {
    return (
      <motion.a
        href={club.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${club.name} (opens in a new tab)`}
        className="group/club flex flex-col items-center gap-1 w-16 sm:w-[68px] cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        variants={reduceMotion ? {} : clubVariants}
        {...hoverProps}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.div
      className="group/club flex flex-col items-center gap-1 w-16 sm:w-[68px]"
      variants={reduceMotion ? {} : clubVariants}
      {...hoverProps}
    >
      {inner}
    </motion.div>
  );
};

export const LoveCard = ({ loves }: LoveCardProps) => {
  const reduceMotion = useReducedMotion();
  const { ref: tiltRef, rotateX, rotateY } = useTilt<HTMLDivElement>({ max: 4 });

  return (
    <motion.div
      ref={tiltRef}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1400,
        transformStyle: "preserve-3d",
      }}
      className="col-span-1 lg:col-span-2"
    >
      <Card className="relative overflow-hidden p-4 md:p-6 transition-shadow duration-300 hover:shadow-2xl">
        <h4
          className="text-right font-heading text-base md:text-lg lg:text-xl font-bold text-foreground mb-4 md:mb-5"
          style={{ transform: "translateZ(25px)" }}
        >
          <GradientText>What I Love</GradientText>
        </h4>

        <div
          className="relative flex flex-col gap-2.5 md:gap-3"
          style={{ transform: "translateZ(15px)" }}
        >
          {loves.map((love, idx) => {
            const theme = LOVE_THEMES[love.main.name] ?? FALLBACK_THEME;

            return (
              <motion.div
                key={idx}
                className={`group/row relative flex flex-row items-center justify-between sm:justify-start gap-3 sm:gap-4 rounded-xl px-3 py-3 md:px-4 md:py-3 border ${theme.rowBg} ${theme.border}`}
                initial="rest"
                whileHover="hover"
                whileFocus="hover"
                animate="rest"
                variants={reduceMotion ? {} : rowVariants}
                tabIndex={0}
                role="group"
                aria-label={love.main.name}
              >
                {/* Header: badge + label (always horizontal — stacks above clubs on mobile, beside on sm+) */}
                <div className="flex items-center gap-3 shrink-0">
                  <motion.div
                    className="relative shrink-0"
                    variants={reduceMotion ? {} : iconVariants}
                  >
                    <motion.div
                      className={`absolute inset-0 rounded-full ${theme.glow} blur-md`}
                      variants={reduceMotion ? {} : ringVariants}
                    />
                    <div
                      className={`relative rounded-full bg-background p-1.5 md:p-2 border-2 ${theme.border} shadow-sm`}
                    >
                      <Image
                        src={love.main.src}
                        width={120}
                        height={120}
                        alt={love.main.name}
                        className="size-9 sm:size-10 md:size-11 object-contain"
                      />
                    </div>
                  </motion.div>

                  <div className="flex flex-col min-w-[58px] md:min-w-[72px]">
                    <span className="text-[11px] md:text-xs font-bold uppercase tracking-wide text-foreground whitespace-nowrap leading-tight">
                      {love.main.name}
                    </span>
                    <span className="text-[9px] md:text-[10px] text-muted-foreground">
                      {love.clubs.length} favs
                    </span>
                  </div>
                </div>

                {/* Vertical divider on sm+ only */}
                <div className="hidden sm:block shrink-0 self-stretch w-px bg-border/60" />

                {/* Clubs — on mobile stack vertically to the right (paired
                    with row's justify-between so DOTA 2 etc. sit at the
                    left edge and the clubs hug the right). On sm+ the
                    existing wrapping row layout is preserved. */}
                <motion.div
                  className="flex flex-col items-end gap-2 sm:flex-row sm:flex-wrap sm:items-stretch sm:justify-start sm:flex-1"
                  variants={reduceMotion ? {} : clubContainerVariants}
                >
                  {love.clubs.map((club, i) => (
                    <ClubChip
                      key={i}
                      club={club}
                      reduceMotion={!!reduceMotion}
                    />
                  ))}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
};
