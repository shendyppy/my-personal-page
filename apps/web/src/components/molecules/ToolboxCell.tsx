"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Code2,
  KeyRound,
  MessageCircle,
  Orbit,
  Route,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { useTilt } from "@/hooks/useTilt";

interface ToolboxCellProps {
  name: string;
  logo: string;
}

// Thematic, theme-safe stand-ins for tools whose only brand mark is
// black/monochrome (invisible on the dark theme) or missing from every CDN.
// Keyed by skill name.
const FALLBACK_ICONS: Record<string, LucideIcon> = {
  ChatGPT: MessageCircle,
  Codex: Code2,
  Antigravity: Orbit,
  Express: Route,
  JWT: KeyRound,
};

// Shared motion: sits dimmed until the cell is hovered (or always on touch),
// then brightens, lifts on Z and spins a full turn.
const ICON_MOTION =
  "opacity-50 transition-all duration-700 [transform:translateZ(0)] [transition-timing-function:cubic-bezier(0.34,1.4,0.5,1)] group-hover:opacity-100 group-hover:[transform:rotateY(360deg)_translateZ(38px)_scale(1.16)] [@media(hover:none)]:opacity-100 motion-reduce:transition-none motion-reduce:group-hover:[transform:none]";
// Raster/SVG logos additionally bloom grey→colour.
const LOGO_CLASS = `size-[42px] object-contain grayscale group-hover:grayscale-0 [@media(hover:none)]:grayscale-0 ${ICON_MOTION}`;

/**
 * One tool in the Toolbox grid. The whole cell tilts toward the cursor in 3D
 * (useTilt), while the icon itself lifts off the card on the Z axis, spins a
 * full turn and — for real logos — blooms from desaturated grey to full brand
 * colour on hover. Tools without a theme-safe logo fall back to a thematic
 * lucide glyph in the foreground colour. Tilt + spin auto-disable on touch /
 * reduced-motion; on touch, logos stay full-colour so the grid isn't dead.
 */
export const ToolboxCell = ({ name, logo }: ToolboxCellProps) => {
  const { ref, rotateX, rotateY } = useTilt<HTMLDivElement>({ max: 14 });
  // Remote CDN logos (e.g. Simple Icons SVGs) render via a plain <img>: the
  // browser treats an SVG in <img> as a static image, so it sidesteps
  // next/image's SVG restriction without loosening the config. Local WebP
  // assets keep next/image's optimization.
  const isRemote = logo.startsWith("http");
  const FallbackIcon = logo ? null : FALLBACK_ICONS[name] ?? Sparkles;

  return (
    <div className="group flex aspect-square cursor-default items-center justify-center bg-background transition-colors duration-300 [perspective:640px] hover:bg-surface">
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="flex size-full flex-col items-center justify-center gap-2.5"
      >
        {FallbackIcon ? (
          <FallbackIcon
            strokeWidth={1.5}
            className={`size-[38px] text-foreground ${ICON_MOTION}`}
          />
        ) : isRemote ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt={name} width={42} height={42} className={LOGO_CLASS} />
        ) : (
          <Image
            src={logo}
            alt={name}
            width={42}
            height={42}
            className={LOGO_CLASS}
          />
        )}
        <span className="text-center font-mono text-[9px] tracking-[0.06em] text-muted-foreground [transform:translateZ(12px)]">
          {name}
        </span>
      </motion.div>
    </div>
  );
};
