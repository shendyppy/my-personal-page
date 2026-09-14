import { ChapterHead } from "@/components/atoms/ChapterHead";
import { DescentLogEntry } from "@/components/organisms/DescentLogEntry";
import { ChapterFrame } from "@/components/organisms/ChapterFrame";
import { chapterById } from "@/constants/dive";
import type { ExperienceDto } from "@/server/queries/experiences";

type DescentChapterProps = {
  experiences: ExperienceDto[];
  beats: number;
};

const chapter = chapterById("descent");
const TICK_M = 500;
/** The same band the HUD reads across this chapter. */
const [START_M, END_M] = chapter.depthM;
const TICKS = Array.from({ length: Math.floor((END_M - START_M) / TICK_M) + 1 }, (_, i) => START_M + i * TICK_M);

/** Career. Entries alternate either side of a pressure line the marker descends. */
export const DescentChapter = ({ experiences, beats }: DescentChapterProps) => {

  return (
    <ChapterFrame id={chapter.id} beats={beats}>
      <ChapterHead index={chapter.index + 1} category={chapter.category} label={chapter.label} />
      <div className="descent">
        {/* The marker's timeline is linear in chapter progress, and the chapter's
            progress is linear in depth, so a tick at its share of the line is
            passed exactly when the HUD reads that depth. */}
        <div className="pressure-line" aria-hidden>
          {TICKS.map((m) => (
            <span key={m} className="depth-tick" data-depth-tick style={{ top: `${((m - START_M) / (END_M - START_M)) * 100}%` }}>
              {m} M
            </span>
          ))}
          <span data-depth-marker />
        </div>
        {/* The sub rides down the gutter between the columns, in step with the
            marker (a travel lane, see lib/dive/lanes). */}
        <div data-sub-anchor="lane" data-sub-travel aria-hidden className="descent-lane" />
        <ol className="log">
          {experiences.map((e, i) => (
            <DescentLogEntry key={e.id} experience={e} index={i} side={i % 2 === 0 ? "left" : "right"} />
          ))}
        </ol>
      </div>
    </ChapterFrame>
  );
};
