import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

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

import { getQueryClient } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { getProjects } from "@/server/queries/projects";
import { getAbout } from "@/server/queries/about";
import { getExperiences } from "@/server/queries/experiences";
import { getSkills } from "@/server/queries/skills";

export default async function Home() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.projects,
      queryFn: getProjects,
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.about,
      queryFn: getAbout,
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.experiences,
      queryFn: getExperiences,
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.skills,
      queryFn: getSkills,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageWrapper>
        <main className="flex flex-col justify-center items-center w-full gap-16">
          <section id="hero" className="w-full">
            <Hero3D />
          </section>

          <Projects />
          <About />
          <Experiences />
          <Skills />
        </main>
      </PageWrapper>
    </HydrationBoundary>
  );
}
