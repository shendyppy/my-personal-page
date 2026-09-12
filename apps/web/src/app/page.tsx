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
import { SurfaceChapter } from "@/components/sections/dive/SurfaceChapter";
import { CHAPTERS } from "@/constants/dive";
import { getExperiences } from "@/server/queries/experiences";
import { getProjects } from "@/server/queries/projects";

export default async function Home() {
  const [projects, experiences] = await Promise.all([getProjects(), getExperiences()]);
  const beats = CHAPTERS.map((c) =>
    c.id === "reef" ? Math.max(1, projects.length) : c.id === "descent" ? Math.max(1, experiences.length) : c.beats
  );
  return (
    <>
      <GrainOverlay />
      <DiveHud />
      <DiveScene />
      <main id="main-content" className="relative z-10 w-full">
        <DiveShell beats={beats}>
          <SurfaceChapter projectCount={projects.length} experiences={experiences} />
          {CHAPTERS.slice(1).map((c, i) => (
            <ChapterFrame key={c.id} id={c.id} beats={beats[i + 1]}>
              <ChapterHead index={c.index + 1} category={c.category} label={c.label} />
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
