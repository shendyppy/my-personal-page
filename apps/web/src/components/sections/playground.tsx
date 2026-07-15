import { Rotate3d } from "lucide-react";

import { PlaygroundIsland } from "@/components/molecules/PlaygroundIsland";

/**
 * "Beyond the brief" playground — a draggable 3D shape beside the copy. The
 * canvas is a client island; this shell is static server HTML with a soft
 * accent-glow fallback that shows until (or unless) the scene mounts.
 */
export const Playground = () => (
  <section className="relative mx-auto box-border max-w-[1400px] px-6 pb-36 md:px-10">
    <div className="relative grid grid-cols-1 items-stretch overflow-hidden rounded-[28px] border border-border bg-card lg:grid-cols-2">
      <div className="flex flex-col justify-center p-[clamp(40px,5vw,72px)]">
        <p className="m-0 font-mono text-xs tracking-[0.14em] text-accent">
          BEYOND THE BRIEF
        </p>
        <h2 className="font-heading mt-5 text-[clamp(34px,3.7vw,54px)] font-extrabold uppercase leading-[1.02] tracking-[-0.03em]">
          I build things
          <br />
          that{" "}
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: "2px var(--accent)" }}
          >
            move
          </span>
          .
        </h2>
        <p className="mt-6 max-w-[420px] text-base leading-[1.7] text-subtle">
          WebGL, shaders, motion, physics — the layer most engineers skip. It&apos;s
          where an interface stops feeling like a document and starts feeling
          alive.
        </p>
        <div className="mt-8 inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.1em] text-muted-foreground">
          <Rotate3d className="size-4 text-accent" />
          DRAG THE SHAPE — IT&apos;S YOURS TO SPIN
        </div>
      </div>

      <div className="relative min-h-[clamp(360px,42vw,520px)] cursor-grab touch-none border-t border-border lg:border-l lg:border-t-0">
        <div
          aria-hidden
          data-play-fallback
          className="pointer-events-none absolute left-1/2 top-1/2 size-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45 blur-lg transition-opacity duration-700"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, var(--accent), transparent 66%)",
          }}
        />
        <PlaygroundIsland />
      </div>
    </div>
  </section>
);
