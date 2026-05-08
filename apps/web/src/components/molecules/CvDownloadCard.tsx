"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { GradientText } from "@/components/atoms/GradientText";
import { useMagneticHover } from "@/hooks/useMagneticHover";
import { useTilt } from "@/hooks/useTilt";
import type { CvInfo } from "@/types";

type CvDownloadCardProps = {
  cvInfo: CvInfo | null;
};

/**
 * CV preview card with the gradient download button. Hovering scrolls
 * the preview image upward; the download button drifts toward the
 * pointer (magnetic hover) and the whole card tilts in 3D following
 * the cursor (paper-fold feel). On touch / reduced-motion both fancy
 * effects gracefully no-op.
 */
export const CvDownloadCard = ({ cvInfo }: CvDownloadCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { ref: tiltRef, rotateX, rotateY } = useTilt<HTMLDivElement>({ max: 7 });
  const { ref: magneticRef, x: magneticX, y: magneticY } =
    useMagneticHover<HTMLAnchorElement>({ strength: 8 });

  return (
    <motion.div
      ref={tiltRef}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className="col-span-1 lg:col-span-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="relative overflow-hidden p-4 md:p-6 flex flex-col justify-center gap-4 transition-shadow duration-300 hover:shadow-2xl">
        {/* Aurora wash that warms up on hover */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-red-500/[0.06] via-transparent to-orange-400/[0.08] transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Folded-corner accent (top-right) — sits forward in 3D */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 right-0 size-8 md:size-10"
          style={{ transform: "translateZ(8px)" }}
        >
          <div
            className="absolute inset-0"
            style={{
              clipPath: "polygon(100% 0, 0 0, 100% 100%)",
              background:
                "linear-gradient(225deg, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0.12) 100%)",
            }}
          />
          <div
            className="absolute top-0 right-0 size-3 md:size-4"
            style={{
              clipPath: "polygon(100% 0, 0 0, 100% 100%)",
              background: "rgba(0,0,0,0.18)",
            }}
          />
        </div>

        <div
          className="relative flex justify-between items-center mb-2 md:mb-4"
          style={{ transform: "translateZ(30px)" }}
        >
          <div className="flex flex-col gap-1.5">
            <h4 className="text-left font-heading text-base md:text-lg lg:text-xl font-bold text-foreground">
              <GradientText>{cvInfo?.title}</GradientText>
            </h4>
            <span className="inline-flex items-center gap-1 self-start rounded-full bg-foreground/5 border border-border/60 px-2 py-0.5 text-[10px] md:text-xs font-medium text-muted-foreground">
              <FileText className="size-3" />
              PDF · A4
            </span>
          </div>

          <motion.div
            style={{ x: magneticX, y: magneticY }}
            animate={{
              opacity: isHovered ? 1 : undefined,
            }}
            className={`
              md:transition-all md:duration-200 md:ease-out
              ${
                isHovered
                  ? "md:opacity-100 md:translate-y-0"
                  : "md:opacity-0 md:-translate-y-2 md:pointer-events-none"
              }
            `}
          >
            <Link
              ref={magneticRef}
              href={cvInfo?.downloadPath ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              download
              aria-label="Download CV"
              className="
                relative
                size-10 sm:size-12 lg:size-14
                rounded-lg sm:rounded-xl md:rounded-2xl
                flex items-center justify-center
                bg-gradient-to-br from-red-500 via-orange-500 to-yellow-400
                text-white font-semibold
                shadow-[0_6px_12px_rgba(0,0,0,0.3),0_0_8px_rgba(0,0,0,0.25)]
                border border-transparent
                transition-shadow duration-200
                hover:shadow-[0_10px_20px_rgba(0,0,0,0.35),0_0_12px_rgba(0,0,0,0.3)]
                active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),inset_0_0_4px_rgba(255,255,255,0.25)]
                before:content-[''] before:absolute before:inset-0 before:rounded-xl
                before:bg-gradient-to-t before:from-white/30 before:to-transparent
                before:transition-all before:duration-150
                animate-gradient-x
              "
            >
              <span className="absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75 animate-ping md:hidden" />
              <Download className="size-6 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
            </Link>
          </motion.div>
        </div>

        {/* Preview reads as a paper sheet — ring + soft vignette */}
        <div
          className="relative w-full h-[150px] md:h-[200px] overflow-hidden rounded-lg shadow-md ring-1 ring-border/40 bg-muted/30"
          style={{ transform: "translateZ(15px)" }}
        >
          <div className="absolute inset-0 transition-transform duration-[1500ms] ease-in-out hover:-translate-y-[100%]">
            <Image
              src={cvInfo?.previewImage ?? ""}
              alt="CV Preview"
              width={300}
              height={1000}
              className="w-full h-auto object-contain"
              priority
              onTouchMove={() => setIsHovered(true)}
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-foreground/10"
          />
        </div>
      </Card>
    </motion.div>
  );
};
