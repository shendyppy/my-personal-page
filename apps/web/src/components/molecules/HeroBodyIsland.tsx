"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { useMagneticHover } from "@/hooks/useMagneticHover";
import { scrollToSection } from "@/lib/utils";
import { SECTION_IDS } from "@/constants/config";

/** Live Jakarta (WIB) clock for the hero status line. */
export const HeroStatus = () => {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      const t = new Date().toLocaleTimeString("en-GB", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setClock(`${t} WIB`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-3.5 overflow-hidden font-mono text-[13px] tracking-[0.12em] text-muted-foreground">
      <span className="inline-flex items-center gap-2 animate-rise [animation-delay:0.1s]">
        <span className="size-2 rounded-full bg-accent animate-pulse-dot" />
        OPEN FOR OPPORTUNITIES
      </span>
      <span className="animate-rise [animation-delay:0.2s]">
        — TANGERANG SELATAN, ID · {clock}
      </span>
    </div>
  );
};

/** Magnetic circular "SEE WORK" cue with a spinning dashed ring. */
export const HeroSeeWork = () => {
  const { ref, x, y } = useMagneticHover<HTMLButtonElement>({ strength: 22 });

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onClick={() => scrollToSection(SECTION_IDS.projects)}
      className="group relative inline-flex size-[120px] cursor-pointer items-center justify-center rounded-full border border-border font-mono text-xs tracking-[0.1em] text-foreground transition-colors duration-300 hover:border-accent hover:text-accent"
    >
      <span
        aria-hidden
        className="absolute -inset-px rounded-full border border-dashed border-border animate-spin-slow motion-reduce:animate-none group-hover:border-accent/50"
      />
      SEE WORK ↓
    </motion.button>
  );
};
