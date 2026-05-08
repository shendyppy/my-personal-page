import { HeroSceneIsland } from "@/components/molecules/HeroSceneIsland";
import { HeroBodyIsland } from "@/components/molecules/HeroBodyIsland";

/**
 * Server-rendered hero shell. The H1 (LCP element) is static HTML, so it
 * paints before any JS hydrates. Interactive bits — typing bio, trait
 * shuffle, CTA — are isolated in a small client island; the heavy 3D
 * scene + scroll parallax are isolated in a separate island that's
 * skipped entirely on mobile.
 */
export const Hero3D = () => (
  <section
    id="hero"
    className="relative w-full sm:h-screen flex items-center justify-center overflow-hidden"
  >
    <HeroSceneIsland />

    <div className="flex flex-col justify-center text-center z-10 px-4 max-w-6xl mx-auto sm:mt-auto pt-20 pb-12 sm:py-20">
      <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl mb-6 text-foreground">
        <span className="text-accent">Shendy&apos;s here!</span>
      </h1>

      <HeroBodyIsland />
    </div>
  </section>
);
