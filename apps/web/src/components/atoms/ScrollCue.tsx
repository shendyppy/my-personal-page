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
    {/* The brackets are their own blinking spans, so strip whatever padding
        the constant carries rather than slicing fixed indices off it. */}
    <span className="mx-2">{DIVE_COPY.scrollCue.replace(/^\[\s*|\s*\]$/g, "")}</span>
    <span className="animate-blink text-accent">]</span>
  </button>
);
