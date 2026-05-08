"use client";

import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import TypingText from "@/hooks/useTypingEffect";
import { useThemeContext } from "@/app/providers/ThemeProvider";
import { useMediaQuery } from "@/hooks/useResponsive";
import { scrollToSection } from "@/lib/utils";
import { heroTraits, heroBio } from "@/data/hero";
import { traitColors } from "@/constants/colors";
import { SECTION_IDS } from "@/constants/config";
import { TraitBadge } from "@/components/molecules/TraitBadge";
import type { Trait } from "@/types";

const groupByType = (items: Trait[]) =>
  items.reduce<Record<string, Trait[]>>((acc, trait) => {
    if (!acc[trait.type]) acc[trait.type] = [];
    acc[trait.type].push(trait);
    return acc;
  }, {});

/**
 * Client island for the interactive parts of the hero — typing bio,
 * trait shuffle, and the scroll-to-projects CTA. The static H1 is
 * rendered by the server component shell.
 */
export const HeroBodyIsland = () => {
  const { theme } = useThemeContext();
  const mobileToSm = useMediaQuery({ min: 0, max: 512 });

  const [traits, setTraits] = useState(heroTraits);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [displayedTraits, setDisplayedTraits] = useState(heroTraits);

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
        className="flex flex-wrap gap-2 justify-center transition-all duration-500 px-2 sm:px-4"
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

      <div className="flex justify-center space-x-6 mt-12 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => scrollToSection(SECTION_IDS.projects)}
          className={`animate-bounce cursor-pointer rounded-lg transition-all duration-300 transform ${
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
