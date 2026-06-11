import { HeroSceneIsland } from "@/components/molecules/HeroSceneIsland";
import { HeroBodyIsland } from "@/components/molecules/HeroBodyIsland";
import { GradientText } from "@/components/atoms/GradientText";
import { Spotlight } from "@/components/ui/spotlight";

/**
 * Server-rendered hero shell. The H1 (LCP element) is static HTML, so it
 * paints before any JS hydrates. The interactive 3D robot (Spline) streams
 * in behind the text via a client island that's skipped on mobile. The
 * aurora wash + spotlight are static server HTML and ride the LCP paint.
 *
 * Layering: backdrop/scene at z-0, text column at z-10. The text column is
 * `pointer-events-none` so the cursor reaches the robot canvas behind it;
 * the interactive bits (traits, scroll cue) re-enable events themselves.
 */
export const Hero3D = () => (
  <section
    id="hero"
    className="relative w-full min-h-[100svh] flex items-center justify-center overflow-hidden"
  >
    {/* Aurora wash + spotlight sweep behind the 3D scene. The aurora backdrop
        gently breathes (scale + opacity) so the hero never feels static. */}
    <div aria-hidden className="aurora-radial animate-aurora-breathe pointer-events-none absolute inset-0 z-0" />
    <Spotlight className="-top-40 left-0 md:-top-20 md:left-60 text-aurora-2 dark:text-white" />

    {/* Mobile-only aurora orbs — soft drifting glows that replace the (heavy)
        Spline robot on phones. Uses aurora-drift for organic wandering motion
        with staggered delays so each orb traces a different path. */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden sm:hidden"
    >
      <div className="absolute left-[8%] top-[34%] size-56 rounded-full bg-aurora-1/30 blur-3xl animate-aurora-drift" />
      <div className="absolute right-[2%] top-[52%] size-64 rounded-full bg-aurora-3/25 blur-3xl animate-aurora-drift [animation-delay:-6s]" />
      <div className="absolute bottom-[18%] left-[30%] size-60 rounded-full bg-aurora-2/25 blur-3xl animate-aurora-drift [animation-delay:-12s]" />
    </div>

    <HeroSceneIsland />

    <div className="pointer-events-none flex flex-col justify-center text-center z-10 px-4 max-w-6xl mx-auto sm:mt-auto pt-20 pb-12 sm:py-20">
      <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl mb-6 text-foreground">
        Shendy&apos;s{" "}
        <GradientText className="animate-gradient-x">here!</GradientText>
      </h1>

      <HeroBodyIsland />
    </div>
  </section>
);
