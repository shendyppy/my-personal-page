"use client";

import React, { useEffect, useState } from "react";
import { LoaderPinwheel } from "lucide-react";

import { Navigation } from "@/components/navigation";
import { Hero3D } from "@/components/sections/hero3d";
import { Projects } from "@/components/sections/projects";
import { About } from "../components/sections/about";
import { Experiences } from "@/components/sections/experiences";
import { Skills } from "@/components/sections/skills";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="items-center justify-items-center min-h-screen pb-20">
      <Navigation />
      {loading ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <LoaderPinwheel className="h-16 w-16 text-accent animate-spin" />
        </div>
      ) : (
        <main className="flex flex-col justify-center items-center w-full gap-16">
          <Hero3D />
          <Projects />
          <About />
          <Experiences />
          <Skills />
        </main>
      )}
    </div>
  );
};

export default Home;
