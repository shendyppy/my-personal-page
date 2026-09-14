"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./SubEscort.impl").then((m) => m.SubEscortImpl), { ssr: false });

type SubEscortProps = { className?: string };

/**
 * The dive's submersible, hovering in its own small stage on the project
 * page: it bobs, its props churn and a mouse drag spins it. three.js stays
 * out of the first-paint bundle.
 */
export const SubEscort = ({ className }: SubEscortProps) => (
  <div aria-hidden className={className}>
    <Scene />
  </div>
);
