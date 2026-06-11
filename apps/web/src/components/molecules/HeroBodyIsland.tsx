"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Monitor, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import TypingText from "@/hooks/useTypingEffect";
import { useThemeContext } from "@/app/providers/ThemeProvider";
import { useMediaQuery } from "@/hooks/useResponsive";
import { scrollToSection } from "@/lib/utils";
import { heroTraits, heroBio } from "@/data/hero";
import { traitColors } from "@/constants/colors";
import { SECTION_IDS } from "@/constants/config";
import { TraitBadge } from "@/components/molecules/TraitBadge";
import { useTilt } from "@/hooks/useTilt";
import type { Trait } from "@/types";

const groupByType = (items: Trait[]) =>
  items.reduce<Record<string, Trait[]>>((acc, trait) => {
    if (!acc[trait.type]) acc[trait.type] = [];
    acc[trait.type].push(trait);
    return acc;
  }, {});

/**
 * Client island for the interactive parts of the hero — typing bio,
 * trait shuffle, and the scroll-to-projects cue. The static H1 is
 * rendered by the server component shell.
 */
export const HeroBodyIsland = () => {
  const { theme } = useThemeContext();
  const mobileToSm = useMediaQuery({ min: 0, max: 512 });

  const [traits, setTraits] = useState(heroTraits);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [displayedTraits, setDisplayedTraits] = useState(heroTraits);
  const [nudgePhase, setNudgePhase] = useState<
    "visible" | "dismissing" | "gone"
  >("visible");
  const {
    ref: tiltRef,
    rotateX,
    rotateY,
  } = useTilt<HTMLDivElement>({ max: 8 });

  const handleNudgeDismiss = useCallback(() => {
    setNudgePhase("dismissing");
  }, []);

  const handleShuffle = () => {
    setTraits((prev) => [...prev].sort(() => Math.random() - 0.5));
    setShuffleKey((k) => k + 1);
  };

  /* eslint-disable react-hooks/set-state-in-effect -- impure random selection must live in effect */
  useEffect(() => {
    if (!mobileToSm) {
      setDisplayedTraits(traits);
      return;
    }

    const grouped = groupByType(traits);
    const picks: Trait[] = [];

    Object.values(grouped).forEach((list) => {
      const idx = Math.floor(Math.random() * list.length);
      if (list[idx]) picks.push(list[idx]);
    });

    const pickedLabels = new Set(picks.map((t) => t.label));
    const leftovers = traits.filter((t) => !pickedLabels.has(t.label));
    const shuffledLeftovers = [...leftovers].sort(() => Math.random() - 0.5);
    const slotsLeft = 7 - picks.length;
    picks.push(...shuffledLeftovers.slice(0, slotsLeft));

    setDisplayedTraits(picks);
  }, [traits, mobileToSm, shuffleKey]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <>
      <TypingText text={heroBio} />

      <div
        key={shuffleKey}
        className="pointer-events-auto flex flex-wrap gap-2 justify-center transition-all duration-500 px-2 sm:px-4"
      >
        {displayedTraits.map((trait) => {
          const colorClasses =
            traitColors[trait.type][theme === "dark" ? "dark" : "light"];
          return (
            <TraitBadge
              key={trait.label}
              trait={trait}
              colorClasses={colorClasses}
              onClick={trait.type === "shuffle" ? handleShuffle : undefined}
            />
          );
        })}
      </div>

      {/* Mobile-only nudge — wider screen has more to see */}
      {nudgePhase !== "gone" && (
        <div
          className={`pointer-events-auto sm:hidden mx-auto mt-8 max-w-xs ${
            nudgePhase === "dismissing"
              ? "animate-fade-out-down"
              : "animate-fade-in-up"
          }`}
          style={
            nudgePhase === "visible"
              ? { animationDelay: "1.2s", animationFillMode: "both" }
              : undefined
          }
          onAnimationEnd={() => {
            if (nudgePhase === "dismissing") setNudgePhase("gone");
          }}
        >
          <motion.div
            ref={tiltRef}
            style={{
              rotateX,
              rotateY,
              transformPerspective: 1000,
              transformStyle: "preserve-3d",
            }}
          >
            <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-aurora-1/60 via-aurora-2/40 to-aurora-3/60">
              <div className="relative rounded-2xl bg-background/70 backdrop-blur-xl px-5 py-4">
                {/* Dismiss button */}
                <button
                  onClick={handleNudgeDismiss}
                  className="absolute top-2.5 right-2.5 text-muted-foreground/60 hover:text-foreground transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="size-4" />
                </button>

                <div className="flex items-start gap-3.5 pr-4">
                  {/* Floating monitor icon */}
                  <div className="shrink-0 mt-0.5">
                    <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-aurora-1/20 to-aurora-2/20">
                      <Monitor className="size-5 text-aurora-2 animate-icon-float" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground leading-tight inline-block animate-bounce-x">
                      More to see on a wider screen{" "}
                    </p>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Try opening this on a tablet or desktop for the full
                      experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="pointer-events-auto flex justify-center space-x-6 mt-12 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => scrollToSection(SECTION_IDS.projects)}
          className={`animate-bounce cursor-pointer rounded-lg transition-all duration-300 transform motion-reduce:animate-none ${
            theme === "dark"
              ? "border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-muted-foreground hover:scale-110"
              : "border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-110"
          }`}
        >
          <ArrowDown className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
};
