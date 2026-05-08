"use client";

import { ArrowBigRight, Layers } from "lucide-react";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/atoms/GradientText";
import { TechStackItem } from "@/components/molecules/TechStackItem";
import { useTilt } from "@/hooks/useTilt";
import { scrollToSection } from "@/lib/utils";
import { SECTION_IDS } from "@/constants/config";
import type { TechStack } from "@/types";

type TechStackCardProps = {
  techStacks: TechStack[];
};

export const TechStackCard = ({ techStacks }: TechStackCardProps) => {
  const { ref: tiltRef, rotateX, rotateY } = useTilt<HTMLDivElement>({ max: 5 });

  return (
    <motion.div
      ref={tiltRef}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className="col-span-1 lg:col-span-2"
    >
      <Card className="relative overflow-hidden p-4 md:p-6 transition-shadow duration-300 hover:shadow-2xl">
        {/* Aurora wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-cyan-400/[0.05] via-transparent to-fuchsia-400/[0.07]"
        />

        <div
          className="relative flex items-center justify-center gap-3 mb-3 md:mb-4"
          style={{ transform: "translateZ(25px)" }}
        >
          <h4 className="font-heading text-base md:text-lg lg:text-xl font-bold text-foreground">
            <GradientText>Tech Stacks</GradientText>
          </h4>
          <span className="inline-flex items-center gap-1 rounded-full bg-foreground/5 border border-border/60 px-2.5 py-0.5 text-[10px] md:text-xs font-medium text-muted-foreground">
            <Layers className="size-3" />
            {techStacks.length} tools
          </span>
        </div>

        <div
          className="relative flex flex-wrap justify-center items-center gap-2 md:gap-3"
          style={{ transform: "translateZ(20px)" }}
        >
          {techStacks.map((tech, index) => (
            <TechStackItem key={index} tech={tech} index={index} />
          ))}
        </div>

        <div
          className="relative flex justify-end items-end"
          style={{ transform: "translateZ(15px)" }}
        >
          <Button
            className="mt-4 md:mt-6 cursor-pointer animate-moveRight"
            variant="link"
            onClick={() => scrollToSection(SECTION_IDS.skills)}
          >
            Explore more <ArrowBigRight />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
