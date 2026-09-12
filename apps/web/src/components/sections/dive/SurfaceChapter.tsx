import { ChapterHead } from "@/components/atoms/ChapterHead";
import { ScrollCue } from "@/components/atoms/ScrollCue";
import { RecordPanel } from "@/components/molecules/RecordPanel";
import { ChapterFrame } from "@/components/organisms/ChapterFrame";
import { CHAPTERS, DIVE_COPY } from "@/constants/dive";
import { earliestYear } from "@/lib/dive/career";
import type { ExperienceDto } from "@/server/queries/experiences";

type SurfaceChapterProps = { projectCount: number; experiences: ExperienceDto[] };

const chapter = CHAPTERS[0];

/** Hero. The H1 is static server HTML (LCP). */
export const SurfaceChapter = ({ projectCount, experiences }: SurfaceChapterProps) => {
  const since = earliestYear(experiences.map((e) => e.period));
  const years = since ? new Date().getFullYear() - since : null;

  return (
    <ChapterFrame id="surface" beats={chapter.beats}>
      <div className="grid items-end gap-10 lg:grid-cols-[7fr_5fr]">
        <div>
          <ChapterHead index={chapter.index + 1} category="PRIMARY TARGET" label={chapter.label} />
          <h1 className="font-heading m-0 text-[clamp(40px,7.8vw,112px)] uppercase leading-[0.92] tracking-[-0.03em]" data-hero-title>
            <span className="block">Software</span>
            <span className="block text-transparent" style={{ WebkitTextStroke: "2px var(--foreground)" }}>
              Engineer<span className="text-accent" style={{ WebkitTextStroke: "0" }}>.</span>
            </span>
          </h1>
          <p className="m-0 mt-8 max-w-[440px] text-[17px] leading-[1.65] text-subtle" data-reveal>
            I&apos;m <b className="text-foreground">Shendy</b> — a software engineer shipping products end-to-end
            for {years ?? "4"}+ years. Enterprise assessment platforms, cross-border banking systems, and
            full-stack apps from database schema to the last pixel.
          </p>
          <ScrollCue />
        </div>

        <RecordPanel
          title="DIVER IDENTIFICATION"
          code="ID-01"
          className="lg:justify-self-end lg:min-w-[320px]"
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
