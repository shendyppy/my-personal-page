import { HeroParticles } from "@/components/molecules/HeroParticles";
import { HeroStatus, HeroSeeWork } from "@/components/molecules/HeroBodyIsland";

/**
 * Editorial hero. The H1 (LCP element) is static server HTML so it paints
 * before any JS hydrates; the pointer-reactive particle icosahedron streams in
 * behind it via a client island, and the live-clock status line + magnetic
 * "SEE WORK" cue hydrate as small islands. A faint accent radial + the animated
 * scroll-line keep the composition alive.
 */
export const Hero3D = () => (
  <section
    id="hero"
    className="relative box-border flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 md:px-10"
  >
    <HeroParticles />

    {/* Soft accent halo centred behind the particle ball — an ambient glow
        that lifts the 3D form off the background. Kept low-opacity and faded
        well before the section edge so it never reads as a hard bottom band
        (the old 50% 120% glow cut the composition at the hero/marquee seam). */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1]"
      style={{
        background:
          "radial-gradient(ellipse 65% 50% at 50% 46%, color-mix(in oklab, var(--accent) 9%, transparent), transparent 70%)",
      }}
    />

    <div className="pointer-events-none relative z-[2] mx-auto w-full max-w-[1400px] pt-24">
      <HeroStatus />

      <h1 className="font-heading m-0 mt-5 text-[clamp(40px,7.8vw,112px)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em]">
        <span className="block overflow-hidden">
          <span className="block animate-rise [animation-delay:0.25s]">
            Software
          </span>
        </span>
        <span className="block overflow-hidden">
          <span
            className="block animate-rise text-transparent [animation-delay:0.4s]"
            style={{ WebkitTextStroke: "2px var(--foreground)" }}
          >
            Engineer
            <span className="text-accent" style={{ WebkitTextStroke: "0" }}>
              .
            </span>
          </span>
        </span>
      </h1>

      <div className="mt-9 flex flex-wrap items-end justify-between gap-10">
        <p className="m-0 max-w-[420px] animate-fade-up text-[17px] leading-[1.65] text-subtle [animation-delay:0.6s]">
          I&apos;m <b className="text-foreground">Shendy</b> — a software
          engineer shipping products end-to-end for 4+ years. Enterprise
          assessment platforms, cross-border banking systems, and full-stack
          apps from database schema to the last pixel.
        </p>
        <div className="pointer-events-auto animate-fade-up [animation-delay:0.7s]">
          <HeroSeeWork />
        </div>
      </div>
    </div>

    <div
      aria-hidden
      className="absolute bottom-7 left-1/2 z-[2] h-14 w-px -translate-x-1/2 overflow-hidden bg-border"
    >
      <div className="h-full w-full bg-accent animate-scroll-line motion-reduce:animate-none" />
    </div>
  </section>
);
