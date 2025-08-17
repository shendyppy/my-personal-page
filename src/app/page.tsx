import { Navigation } from "@/components/navigation";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Hero3D } from "@/components/sections/hero3d";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";

const Home = () => {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-10">
      <Navigation />
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full">
        <Hero3D />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </div>
  );
};

export default Home;
