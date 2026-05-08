"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { useTilt } from "@/hooks/useTilt";

type ProfilePhotoProps = {
  src: string;
  alt?: string;
};

export const ProfilePhoto = ({ src, alt = "Photos of Me" }: ProfilePhotoProps) => {
  const { ref: tiltRef, rotateX, rotateY } = useTilt<HTMLDivElement>({ max: 8 });

  return (
    <motion.div
      ref={tiltRef}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className="col-span-3 lg:col-span-2 relative"
    >
      {/* Soft outer glow halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-2 rounded-2xl bg-gradient-to-br from-primary/30 via-transparent to-secondary/30 opacity-0 blur-xl transition-opacity duration-500 hover:opacity-100"
      />

      <div
        className="relative rounded-xl overflow-hidden ring-1 ring-border/40 shadow-xl bg-muted/20"
        style={{ transform: "translateZ(15px)" }}
      >
        <Image
          src={src}
          width={800}
          height={800}
          alt={alt}
          sizes="(max-width: 768px) 66vw, (max-width: 1024px) 33vw, 22vw"
          className="w-full h-auto object-cover"
          loading="lazy"
        />
        {/* Inner gradient frame */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/15 via-transparent to-transparent"
        />
      </div>
    </motion.div>
  );
};
