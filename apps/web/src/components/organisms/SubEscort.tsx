"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./SubEscort.impl").then((m) => m.SubEscortImpl), { ssr: false });

type SubEscortProps = { className?: string };

/**
 * The dive's submersible on the project page, in a fixed corner: it turns on
 * the spot, bobs and its props churn. It takes no pointer events, so it
 * never blocks the content it floats over. three.js stays
 * out of the first-paint bundle.
 */
export const SubEscort = ({ className }: SubEscortProps) => (
  <div aria-hidden className={className}>
    <Scene />
  </div>
);
