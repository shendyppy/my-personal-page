"use client";

import { DIVE_COPY } from "@/constants/dive";
import { scroller } from "@/lib/dive/scroll";

export const ScrollCue = () => (
  <button
    type="button"
    onClick={() => scroller.to("reef")}
    className="mt-10 inline-flex cursor-pointer items-center font-mono text-xs tracking-[0.18em] text-muted-foreground transition-colors hover:text-accent"
    data-reveal
  >
    <span className="animate-blink text-accent">[</span>
    <span className="mx-2">{DIVE_COPY.scrollCue.slice(2, -2)}</span>
    <span className="animate-blink text-accent">]</span>
  </button>
);
