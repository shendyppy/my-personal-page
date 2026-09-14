"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./SubEscort.impl").then((m) => m.SubEscortImpl), { ssr: false });

type SubEscortProps = { className?: string };

/**
 * The dive's submersible on the project page, floating free in a fixed
 * corner: it turns on the spot, bobs, its props churn, and a mouse drag on the
 * hull spins it. The box itself takes no pointer events (the canvas listens on
 * <body>), so the content under it stays clickable. three.js stays out of the
 * first-paint bundle.
 */
export const SubEscort = ({ className }: SubEscortProps) => (
  <div aria-hidden className={className}>
    <Scene />
  </div>
);
