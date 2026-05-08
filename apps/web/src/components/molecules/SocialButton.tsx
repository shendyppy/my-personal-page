"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";

interface SocialButtonProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  index?: number;
}

export const SocialButton = ({
  href,
  label,
  icon: IconComponent,
  index = 0,
}: SocialButtonProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.7, y: 8 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 22,
        delay: index * 0.04,
      }}
      whileHover={
        reduceMotion
          ? undefined
          : {
              scale: 1.12,
              y: -3,
              transition: { type: "spring", stiffness: 400, damping: 15 },
            }
      }
      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      className="relative group"
    >
      {/* Glow halo on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
      />
      <Button
        variant="outline"
        asChild
        aria-label={`Link to my ${label}`}
        className="relative size-14 md:size-16 rounded-lg shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-primary/50 hover:shadow-lg flex items-center justify-center"
      >
        <Link href={href} target="_blank" rel="noopener noreferrer">
          <IconComponent className="size-6" />
        </Link>
      </Button>
    </motion.div>
  );
};
