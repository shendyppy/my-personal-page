import { ChapterHead } from "@/components/atoms/ChapterHead";
import { ScrollCue } from "@/components/atoms/ScrollCue";
import { RecordPanel } from "@/components/atoms/RecordPanel";
import { ChapterFrame } from "@/components/organisms/ChapterFrame";
import { chapterById, DIVE_COPY } from "@/constants/dive";
import { earliestYear } from "@/lib/dive/career";
import type { ExperienceDto } from "@/server/queries/experiences";

type SurfaceChapterProps = { projectCount: number; experiences: ExperienceDto[] };

const chapter = chapterById("surface");

/** Hero. The H1 is static server HTML (LCP). */
export const SurfaceChapter = ({ projectCount, experiences }: SurfaceChapterProps) => {
  const since = earliestYear(experiences.map((e) => e.period));
  const years = since ? new Date().getFullYear() - since : null;

  return (
    <ChapterFrame id={chapter.id} beats={chapter.beats}>
      {/* The headline spans both columns. At 112px "SOFTWARE" is wider than a
          7fr column and an fr track never shrinks below its min-content, which
          pushed the panel off the right edge. Full-bleed headline first, then
          the asymmetric split underneath. */}
      {/* Below the headline: copy | the sub's lane | record, so the sub surfaces
          in open water instead of behind the hero type. */}
      {/* Phones: the sub floats on the sea surface, right of the scroll cue. */}
      <div data-sub-anchor="lane" aria-hidden className="surface-lane-phone" />
      <div className="surface-grid grid gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_auto]">
        <div className="lg:col-span-3">
          <ChapterHead index={chapter.index + 1} category="PRIMARY TARGET" label={chapter.label} />
          <h1 className="surface-title font-heading m-0 text-[clamp(40px,7.8vw,112px)] uppercase leading-[0.92] tracking-[-0.03em]" data-hero-title>
            <span className="block">Software</span>
            <span className="block text-transparent" style={{ WebkitTextStroke: "2px var(--foreground)" }}>
              Engineer<span className="text-accent" style={{ WebkitTextStroke: "0" }}>.</span>
            </span>
          </h1>
        </div>

        <div className="lg:self-end">
          <p className="surface-copy m-0 max-w-[440px] text-[17px] leading-[1.65] text-subtle" data-reveal>
            I&apos;m <b className="text-foreground">Shendy</b> — a software engineer shipping products end-to-end
            for {years ?? "4"}+ years. Enterprise assessment platforms, cross-border banking systems, and
            full-stack apps from database schema to the last pixel.
          </p>
          <ScrollCue />
        </div>

        <div className="surface-lane hidden lg:flex lg:self-stretch">
          <div data-sub-anchor="lane" aria-hidden className="grow" />
          <p className="lane-cue m-0 hud-cue text-muted-foreground" data-reveal>
            {DIVE_COPY.dragCueShort}
          </p>
        </div>

        <RecordPanel
          title="DIVER IDENTIFICATION"
          code="ID-01"
          // Below lg the grid is one column, so without a cap the panel
          // stretches the full stage width (943px at 1023) and strands each
          // label metres from its value.
          className="md:max-w-[420px] lg:max-w-none lg:min-w-[320px] lg:justify-self-end lg:self-end"
          rows={[
            { label: "SINCE", value: since ?? "—" },
            { label: "PATH", value: DIVE_COPY.path },
            { label: "DIVE SITES", value: projectCount },
            { label: "EXPERIENCE", value: years ? `${years}+ yrs` : "—" },
            { label: "BASE", value: DIVE_COPY.base },
          ]}
        />
      </div>
    </ChapterFrame>
  );
};
