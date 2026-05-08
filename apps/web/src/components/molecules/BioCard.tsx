"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";
import { GradientText } from "@/components/atoms/GradientText";
import { useTilt } from "@/hooks/useTilt";

type BioCardProps = {
  title: string;
  content: string;
};

export const BioCard = ({ title, content }: BioCardProps) => {
  const { ref: tiltRef, rotateX, rotateY } = useTilt<HTMLDivElement>({ max: 6 });

  return (
    <motion.div
      ref={tiltRef}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className="lg:col-span-3"
    >
      <Card className="relative overflow-hidden p-5 md:p-7 rounded-xl transition-shadow duration-500 hover:shadow-2xl">
        {/* Aurora wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fuchsia-400/[0.07] via-transparent to-cyan-400/[0.06]"
        />

        {/* Decorative big sparkle */}
        <Sparkles
          aria-hidden
          className="pointer-events-none absolute -top-3 -right-3 size-20 md:size-24 text-foreground/[0.04] rotate-12"
        />

        <div
          className="relative flex flex-col gap-3 md:gap-4"
          style={{ transform: "translateZ(25px)" }}
        >
          <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-foreground/5 border border-border/60 px-2.5 py-0.5 text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            About me
          </div>

          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
            <GradientText>{title}</GradientText>
          </h2>

          <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
            {content}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};
