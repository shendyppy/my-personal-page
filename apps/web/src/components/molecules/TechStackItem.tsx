"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { TechStack } from "@/types";

interface TechStackItemProps {
  tech: TechStack;
  index?: number;
}

export const TechStackItem = ({ tech, index = 0 }: TechStackItemProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="group relative"
      initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.9 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 22,
        delay: index * 0.025,
      }}
      whileHover={
        reduceMotion
          ? undefined
          : {
              scale: 1.18,
              y: -4,
              transition: { type: "spring", stiffness: 400, damping: 14 },
            }
      }
    >
      <div className="relative bg-background/50 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-border/50 shadow-sm transition-[box-shadow,border-color] duration-300 group-hover:border-primary/40 group-hover:shadow-[0_8px_20px_-6px_rgba(99,102,241,0.35)]">
        {/* Glow halo on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
        />
        <Image
          src={tech.src}
          width={1000}
          height={1000}
          alt={tech.name}
          className="relative size-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow-md">
        {tech.name}
      </div>
    </motion.div>
  );
};
