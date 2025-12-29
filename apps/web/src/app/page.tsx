import { PageWrapper } from "@/components/organisms/PageWrapper";
import { Hero3D } from "@/components/sections/hero3d";
import { Projects } from "@/components/sections/projects";
import { About } from "@/components/sections/about";
import { Experiences } from "@/components/sections/experiences";
import { Skills } from "@/components/sections/skills";

const Home = () => {
  return (
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
  );
};

export default Home;
