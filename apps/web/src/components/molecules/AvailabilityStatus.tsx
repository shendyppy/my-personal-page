"use client";

import { useEffect, useState } from "react";

/**
 * Live availability pill for the closing CTA — a pulsing accent dot beside a
 * ticking Tangerang Selatan (WIB) clock, so the footer reads as *alive* rather
 * than static copy. Time renders only after mount to avoid a hydration
 * mismatch (server has no timezone-local clock); a stable placeholder holds the
 * layout until then.
 */
const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Jakarta",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export const AvailabilityStatus = () => {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(timeFormatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/[0.06] px-4 py-2 font-mono text-xs tracking-[0.14em] text-accent">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex size-2 rounded-full bg-accent" />
      </span>
      AVAILABLE FOR WORK
      <span className="text-accent/50" aria-hidden>
        ·
      </span>
      <span className="tabular-nums text-accent/80">
        {time ?? "--:--:--"} WIB
      </span>
    </span>
  );
};
