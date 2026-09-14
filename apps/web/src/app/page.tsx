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
import { DescentChapter } from "@/components/sections/dive/DescentChapter";
import { ReefChapter } from "@/components/sections/dive/ReefChapter";
import { SurfaceChapter } from "@/components/sections/dive/SurfaceChapter";
import { TwilightChapter } from "@/components/sections/dive/TwilightChapter";
import { CHAPTERS } from "@/constants/dive";
import { chapterRanges, depthForProgress } from "@/lib/dive/depth";
import { getAbout } from "@/server/queries/about";
import { getExperiences } from "@/server/queries/experiences";
import { getProjects } from "@/server/queries/projects";

export default async function Home() {
  const [projects, experiences, about] = await Promise.all([
    getProjects(),
    getExperiences(),
    getAbout(),
  ]);
  const beats = CHAPTERS.map((c) =>
    c.id === "reef" ? Math.max(1, projects.length) : c.id === "descent" ? Math.max(1, experiences.length) : c.beats
  );
  const descent = chapterRanges(beats)[3];
  return (
    <>
      <GrainOverlay />
      <DiveHud />
      <DiveScene />
      <main id="main-content" className="relative z-10 w-full">
        <DiveShell beats={beats}>
          <SurfaceChapter projectCount={projects.length} experiences={experiences} />
          <ReefChapter projects={projects} beats={beats[1]} />
          <TwilightChapter about={about} />
          <DescentChapter
            experiences={experiences}
            beats={beats[3]}
            depth={{ start: depthForProgress(descent.start), end: depthForProgress(descent.end) }}
          />
          {CHAPTERS.slice(4).map((c, i) => (
            <ChapterFrame key={c.id} id={c.id} beats={beats[i + 4]}>
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
