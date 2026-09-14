import { ArrowUpRight } from "lucide-react";

import { ChapterHead } from "@/components/atoms/ChapterHead";
import { CvRecord } from "@/components/molecules/CvRecord";
import { ChapterFrame } from "@/components/organisms/ChapterFrame";
import { EXTERNAL_LINKS, SITE_CONFIG } from "@/constants/config";
import { CHAPTERS, DIVE_COPY, sectionId } from "@/constants/dive";
import type { CvInfoDto } from "@/server/queries/about";

type SeafloorChapterProps = { cv: CvInfoDto | null };

const chapter = CHAPTERS[5];

const CHANNELS = [
  { code: "CH-01", label: "GITHUB", href: EXTERNAL_LINKS.github },
  { code: "CH-02", label: "LINKEDIN", href: EXTERNAL_LINKS.linkedin },
  { code: "CH-03", label: "EMAIL", href: `mailto:${EXTERNAL_LINKS.email}` },
  { code: "CH-04", label: "CALENDLY", href: EXTERNAL_LINKS.calendly },
];

/**
 * Contact. The landed sub is the focal point, so the layout is built around
 * the patch of water it sits in (bottom centre): headline above, and a bottom
 * band of CV card | the sub | channels, with the footer line under it all.
 */
export const SeafloorChapter = ({ cv }: SeafloorChapterProps) => (
  <ChapterFrame id={chapter.id} beats={chapter.beats}>
    <div className="seafloor">
      <div className="seafloor-top">
        <ChapterHead index={chapter.index + 1} category={chapter.category} label={chapter.label} />
        <h2 className="seafloor-headline font-heading m-0" data-reveal>
          {DIVE_COPY.contactHeadline}
        </h2>
        <p className="m-0 mt-4 font-mono text-xs tracking-[0.2em] text-hud" data-reveal>
          {DIVE_COPY.contactSub}
        </p>
      </div>

      <div data-sub-anchor="lane" aria-hidden className="seafloor-lane-phone" />

      <div className="seafloor-band">
        {cv && (
          <div className="seafloor-cv" data-reveal>
            <CvRecord cv={cv} />
          </div>
        )}

        <div className="seafloor-lane">
          <div data-sub-anchor="lane" aria-hidden className="grow" />
          <p className="seafloor-cue m-0 font-mono text-[10px] tracking-[0.16em] text-muted-foreground" data-reveal>
            {DIVE_COPY.dragCue}
          </p>
        </div>

        <ul className="seafloor-channels" data-reveal>
          {CHANNELS.map((c) => {
            const web = c.href.startsWith("http");
            return (
              <li key={c.code}>
                <a href={c.href} {...(web ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group">
                  <span className="text-muted-foreground">{c.code}</span>
                  <span className="text-foreground transition-colors group-hover:text-accent">{c.label}</span>
                  <ArrowUpRight aria-hidden className="size-3.5 text-muted-foreground transition-colors group-hover:text-accent" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="seafloor-foot m-0 font-mono text-[10px] tracking-[0.14em] text-muted-foreground">
        <span>
          © {new Date().getFullYear()} {SITE_CONFIG.author.toUpperCase()}
        </span>
        <span>{DIVE_COPY.builtIn}</span>
        {/* Lenis `anchors` turns this into a smooth scroll; without JS it still jumps. */}
        <a href={`#${sectionId("surface")}`} className="hover:text-accent">
          {DIVE_COPY.backToSurface}
        </a>
      </p>
    </div>
  </ChapterFrame>
);
