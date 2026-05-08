// Re-render once per hour at most. Content rarely changes; ISR keeps the
// landing page fully static-cacheable while still picking up DB edits
// without a full redeploy.
export const revalidate = 3600;

import { PageWrapper } from "@/components/organisms/PageWrapper";
import { Hero3D } from "@/components/sections/hero3d";
import { Projects } from "@/components/sections/projects";
import { About } from "@/components/sections/about";
import { Experiences } from "@/components/sections/experiences";
import { Skills } from "@/components/sections/skills";

export default function Home() {
  return (
    <PageWrapper>
      <main id="main-content" className="relative flex flex-col justify-center items-center w-full gap-16">
        <Hero3D />

        <Projects />
        <About />
        <Experiences />
        <Skills />
      </main>
    </PageWrapper>
  );
}
