// Re-render once per hour at most. Content rarely changes; ISR keeps the
// landing page fully static-cacheable while still picking up DB edits
// without a full redeploy.
export const revalidate = 3600;

import { PageWrapper } from "@/components/organisms/PageWrapper";
import { Hero3D } from "@/components/sections/hero3d";
import { Marquee } from "@/components/atoms/Marquee";
import { Projects } from "@/components/sections/projects";
import { About } from "@/components/sections/about";
import { Experiences } from "@/components/sections/experiences";
import { Skills } from "@/components/sections/skills";
import { Playground } from "@/components/sections/playground";

export default function Home() {
  return (
    <PageWrapper>
      <main id="main-content" className="relative w-full">
        <span id="top" className="absolute top-0" aria-hidden />
        <Hero3D />
        <Marquee />
        <Projects />
        <About />
        <Experiences />
        <Skills />
        <Playground />
      </main>
    </PageWrapper>
  );
}
