// Re-render once per hour at most. Content rarely changes; ISR keeps the
// landing page fully static-cacheable while still picking up DB edits
// without a full redeploy.
export const revalidate = 3600;

import { ChapterHead } from "@/components/atoms/ChapterHead";
import { ChapterFrame } from "@/components/organisms/ChapterFrame";
import { DiveHud } from "@/components/organisms/DiveHud";
import { DiveScene } from "@/components/organisms/DiveScene";
import { DiveShell } from "@/components/organisms/DiveShell";
import { GrainOverlay } from "@/components/atoms/GrainOverlay";
import { CHAPTERS } from "@/constants/dive";

export default function Home() {
  const beats = CHAPTERS.map((c) => c.beats);
  return (
    <>
      <GrainOverlay />
      <DiveHud />
      <DiveScene />
      <main id="main-content" className="relative z-10 w-full">
        <DiveShell beats={beats}>
          {CHAPTERS.map((c) => (
            <ChapterFrame key={c.id} id={c.id} beats={c.beats}>
              <ChapterHead index={c.index} category={c.category} label={c.label} />
              <h2 className="font-heading text-[clamp(36px,5vw,72px)] uppercase leading-none">
                {c.name}
              </h2>
            </ChapterFrame>
          ))}
        </DiveShell>
      </main>
    </>
  );
}
