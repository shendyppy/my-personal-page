"use client";

import { Suspense, lazy } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

type SplineSceneProps = {
  scene: string;
  className?: string;
};

/**
 * Lazy Spline scene wrapper. The Spline runtime + the hosted .splinecode are
 * fetched client-side only; a lightweight spinner holds the space while it
 * streams in. Skipped on mobile by the caller (see HeroSceneIsland).
 */
export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <span className="size-8 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground motion-reduce:animate-none" />
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}
