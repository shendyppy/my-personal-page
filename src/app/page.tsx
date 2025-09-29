"use client";

import React, { useEffect, useState } from "react";
import { LoaderPinwheel } from "lucide-react";

import { Navigation } from "@/components/navigation";
import { Hero3D } from "@/components/sections/hero3d";
import { Projects } from "@/components/sections/projects";
import { About } from "@/components/sections/about";
import { Experiences } from "@/components/sections/experiences";
import { Skills } from "@/components/sections/skills";
import { Footer } from "@/components/footer";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  // fake loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // attach intersection observer after loading is done
  useEffect(() => {
    if (loading) return; // wait until content (hero) is mounted

    let observer: IntersectionObserver | null = null;
    let retries = 0;
    let stopped = false;

    const initObserver = () => {
      if (stopped) return;
      const heroEl = document.getElementById("hero");
      if (!heroEl) {
        retries += 1;
        if (retries <= 20) {
          setTimeout(initObserver, 150);
          return;
        } else {
          setIsHeroVisible(false);
          return;
        }
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          setIsHeroVisible(entry.isIntersecting);
        },
        { threshold: 0.5 }
      );

      observer.observe(heroEl);
    };

    initObserver();

    return () => {
      stopped = true;
      if (observer) observer.disconnect();
    };
  }, [loading]);

  return (
    <div className="items-center justify-items-center min-h-screen">
      <Navigation />
      {loading ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <LoaderPinwheel className="h-16 w-16 text-accent animate-spin" />
        </div>
      ) : (
        <main className="flex flex-col justify-center items-center w-full gap-16">
          <section id="hero" className="w-full">
            <Hero3D />
          </section>

          <Projects />
          <About />
          <Experiences />
          <Skills />
        </main>
      )}

      <div
        className={`pt-15 w-full transition-opacity duration-500 ${
          !loading && !isHeroVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <Footer loading={false} />
      </div>
    </div>
  );
};

export default Home;
