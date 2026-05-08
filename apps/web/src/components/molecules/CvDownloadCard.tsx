"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { GradientText } from "@/components/atoms/GradientText";
import { useMagneticHover } from "@/hooks/useMagneticHover";
import type { CvInfo } from "@/types";

type CvDownloadCardProps = {
  cvInfo: CvInfo | null;
};

/**
 * CV preview card with the gradient download button. Hovering scrolls
 * the preview image upward; the download button drifts toward the
 * pointer (magnetic hover) for a premium-feeling micro-interaction.
 * On mobile (no pointer / coarse pointer) the magnetic hook is a no-op
 * and the button is always visible.
 */
export const CvDownloadCard = ({ cvInfo }: CvDownloadCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const magnetic = useMagneticHover<HTMLAnchorElement>({ strength: 8 });

  return (
    <Card
      className="col-span-1 lg:col-span-2 p-4 md:p-6 flex flex-col justify-center gap-4 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center content-center mb-2 md:mb-4 transition-all duration-300">
        <h4 className="text-left font-heading text-base md:text-lg lg:text-xl font-bold text-foreground">
          <GradientText>{cvInfo?.title}</GradientText>
        </h4>

        <motion.div
          style={{ x: magnetic.x, y: magnetic.y }}
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
            ref={magnetic.ref}
            href={cvInfo?.downloadPath ?? "#"}
            target="_blank"
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

      <div className="w-full h-[150px] md:h-[200px] overflow-hidden rounded-lg shadow-md relative">
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
      </div>
    </Card>
  );
};
