"use client";

import { Mail } from "lucide-react";
import { motion } from "framer-motion";

import { useMagneticHover } from "@/hooks/useMagneticHover";

interface MagneticEmailButtonProps {
  email: string;
}

/**
 * The primary "email me" call-to-action, given weight by a magnetic drift —
 * the pill leans toward the cursor and springs back on leave (auto-disabled on
 * touch / reduced-motion via the hook). This is the focal action of the
 * closing CTA, so it earns the interaction the plainer links don't.
 */
export const MagneticEmailButton = ({ email }: MagneticEmailButtonProps) => {
  const { ref, x, y } = useMagneticHover<HTMLAnchorElement>({ strength: 12 });

  return (
    <motion.a
      ref={ref}
      href={`mailto:${email}`}
      style={{ x, y }}
      className="group inline-flex items-center gap-3 rounded-full bg-accent px-7 py-4 font-mono text-[15px] font-bold tracking-[0.04em] text-accent-foreground shadow-[0_0_0_0_var(--accent)] transition-shadow duration-300 hover:shadow-[0_12px_40px_-8px_var(--accent)]"
    >
      {email}
      <Mail className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
    </motion.a>
  );
};
