"use client";

import Link from "next/link";

import { TerminalLogo } from "@/components/atoms/TerminalLogo";
import { CHAPTERS, DIVE_COPY, sectionId } from "@/constants/dive";
import { useDiveSnapshot } from "@/hooks/useDive";
import { useWibClock } from "@/hooks/useWibClock";
import { scroller } from "@/lib/dive/scroll";

type DiveHudProps = { mode?: "dive" | "surface" };

const pad4 = (n: number) => String(n).padStart(4, "0");

/**
 * Fixed HUD. `dive` mode (landing): brand · DIVE 0n · label · depth + clock,
 * plus the numbered rail on md+. `surface` mode (project pages): brand ·
 * BACK TO DIVE · clock, no rail.
 */
export const DiveHud = ({ mode = "dive" }: DiveHudProps) => {
  const clock = useWibClock();
  const snap = useDiveSnapshot();
  const chapter = CHAPTERS.find((c) => c.id === snap.chapter) ?? CHAPTERS[0];

  return (
    <>
      <div className="hud-bar">
        <div className="flex items-center gap-3">
          <TerminalLogo href="/" />
          <span className="hidden text-muted-foreground sm:inline">· {DIVE_COPY.brand}</span>
        </div>

        {mode === "dive" ? (
          <span className="hidden text-subtle md:inline">
            DIVE {String(chapter.index + 1).padStart(2, "0")} · {chapter.name}
          </span>
        ) : (
          <Link href={`/#${sectionId("reef")}`} className="text-subtle hover:text-accent">
            ← BACK TO DIVE
          </Link>
        )}

        <div className="flex items-center gap-4 tabular-nums">
          {mode === "dive" && (
            <span className="text-hud">{pad4(snap.depth)} m</span>
          )}
          <span className="hidden text-muted-foreground sm:inline">{clock}</span>
        </div>
      </div>

      {mode === "dive" && (
        <nav aria-label="Chapters" className="hud-rail">
          {CHAPTERS.map((c) => {
            const active = c.id === snap.chapter;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => scroller.to(c.id)}
                aria-current={active ? "true" : undefined}
                className={`hud-rail-item ${active ? "is-active" : ""}`}
              >
                <span className="hud-rail-name">{c.name}</span>
                <span aria-hidden className="hud-rail-line" />
                <span>{String(c.index + 1).padStart(2, "0")}</span>
              </button>
            );
          })}
        </nav>
      )}
    </>
  );
};
