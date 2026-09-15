import Image from "next/image";

import { ChapterHead } from "@/components/atoms/ChapterHead";
import { RecordPanel } from "@/components/atoms/RecordPanel";
import { LearningLine } from "@/components/molecules/LearningLine";
import { ChapterFrame } from "@/components/organisms/ChapterFrame";
import { SITE_CONFIG } from "@/constants/config";
import { chapterById, DIVE_COPY } from "@/constants/dive";
import type { AboutBundle } from "@/server/queries/about";

type TwilightChapterProps = { about: AboutBundle };

const chapter = chapterById("twilight");

/** First sentence, then the remainder. `[text, ""]` when there is no boundary. */
const splitLead = (text: string) => {
  const i = text.indexOf(". ");
  return i === -1 ? [text, ""] : [text.slice(0, i + 1), text.slice(i + 2)];
};

/** About. Bio as display type on the left, diver record + porthole on the right. */
export const TwilightChapter = ({ about }: TwilightChapterProps) => {
  const bio = about.aboutSections.find((s) => s.key === "professional_bio")?.content ?? "";
  const learning = about.aboutSections.find((s) => s.key === "current_learning")?.content;
  const [lead, rest] = splitLead(bio);
  const instruments = about.techStacks
    .slice(0, 6)
    .map((t) => t.name)
    .join(" · ");

  return (
    <ChapterFrame id={chapter.id} beats={chapter.beats}>
      <ChapterHead index={chapter.index + 1} category={chapter.category} label={chapter.label} />
      {/* Three columns, not the old 7/5 split that piled the bio, body and
          learning line into one heavy left column: bio | the sub's lane |
          portrait, record and learning line. Weight sits on both sides and the
          sub gets open water in the middle. */}
      <div className="twilight-grid grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,3fr)_minmax(300px,4fr)] lg:gap-12">
        <div className="min-w-0">
          {/* Size and measure live on `.twilight-lead` in globals.css — they
              have to answer to viewport height, which a utility cannot. */}
          <p className="twilight-lead font-heading m-0 leading-[1.08] tracking-[-0.02em]" data-reveal>
            {lead}
          </p>
          {rest && (
            <p className="twilight-body mt-6 max-w-[56ch] text-base leading-[1.75] text-subtle" data-reveal>
              {rest}
            </p>
          )}
        </div>

        <div data-sub-anchor="lane" aria-hidden className="twilight-lane hidden lg:block lg:self-stretch" />

        <div className="min-w-0">
          <div className="porthole" data-reveal>
            <Image
              src={SITE_CONFIG.profileImage}
              alt={SITE_CONFIG.author}
              width={96}
              height={96}
              className="size-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
            />
          </div>
          <RecordPanel
            title="DIVER RECORD"
            code="REC-02"
            // Below lg the grid is one column, so without a cap the panel
            // stretches the full stage width and strands each label metres from
            // its value.
            className="mt-6 md:max-w-[420px] lg:max-w-none"
            rows={[
              { label: "DIVER", value: SITE_CONFIG.author },
              { label: "ROLE", value: "Software Engineer" },
              { label: "FOCUS", value: "Front-end · Full-stack · 3D web" },
              { label: "INSTRUMENTS", value: instruments },
              { label: "BASE", value: DIVE_COPY.base },
            ]}
          />
          {learning && <LearningLine text={learning} />}
        </div>
      </div>
    </ChapterFrame>
  );
};
