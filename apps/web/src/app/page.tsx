// Re-render once per hour at most. Content rarely changes; ISR keeps the
// landing page fully static-cacheable while still picking up DB edits
// without a full redeploy.
export const revalidate = 3600;

import { DiveHud } from "@/components/organisms/DiveHud";
import { DiveScene } from "@/components/organisms/DiveScene";
import { DiveShell } from "@/components/organisms/DiveShell";
import { GrainOverlay } from "@/components/effects/GrainOverlay";
import { DescentChapter } from "@/components/sections/dive/DescentChapter";
import { MidnightChapter } from "@/components/sections/dive/MidnightChapter";
import { ReefChapter } from "@/components/sections/dive/ReefChapter";
import { SeafloorChapter } from "@/components/sections/dive/SeafloorChapter";
import { SurfaceChapter } from "@/components/sections/dive/SurfaceChapter";
import { TwilightChapter } from "@/components/sections/dive/TwilightChapter";
import { CHAPTERS } from "@/constants/dive";
import { getAbout } from "@/server/queries/about";
import { getExperiences } from "@/server/queries/experiences";
import { getProjects } from "@/server/queries/projects";
import { getSkills } from "@/server/queries/skills";

export default async function Home() {
  const [projects, experiences, about, skills] = await Promise.all([
    getProjects(),
    getExperiences(),
    getAbout(),
    getSkills(),
  ]);
  const beats = CHAPTERS.map((c) =>
    c.id === "reef" ? Math.max(1, projects.length) : c.id === "descent" ? Math.max(1, experiences.length) : c.beats
  );
  return (
    <>
      <GrainOverlay />
      <DiveHud />
      {/* Static opening frame under the canvas (see globals.css). */}
      <div aria-hidden className="dive-surface-backdrop" />
      <DiveScene />
      <main id="main-content" className="relative z-10 w-full">
        <DiveShell beats={beats}>
          <SurfaceChapter projectCount={projects.length} experiences={experiences} />
          <ReefChapter projects={projects} beats={beats[1]} />
          <TwilightChapter about={about} />
          <DescentChapter experiences={experiences} beats={beats[3]} />
          <MidnightChapter skills={skills} />
          <SeafloorChapter cv={about.cvInfo} />
        </DiveShell>
      </main>
    </>
  );
}
