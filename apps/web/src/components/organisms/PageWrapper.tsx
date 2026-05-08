"use client";

import React, { useEffect, useState } from "react";

import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper = ({ children }: PageWrapperProps) => {
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  // attach intersection observer for hero visibility
  useEffect(() => {
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
  }, []);

  return (
    <div className="items-center justify-items-center min-h-screen">
      <Navigation />

      {children}

      <div
        className={`pt-15 w-full transition-opacity duration-500 ${
          !isHeroVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <Footer />
      </div>
    </div>
  );
};
