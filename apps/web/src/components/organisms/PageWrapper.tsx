import React from "react";

import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { GrainOverlay } from "@/components/atoms/GrainOverlay";

interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <div className="relative min-h-screen w-full">
      <GrainOverlay />
      <Navigation />

      {children}

      <Footer />
    </div>
  );
};
