import { ChapterHead } from "@/components/atoms/ChapterHead";
import { DescentLogEntry } from "@/components/molecules/DescentLogEntry";
import { ChapterFrame } from "@/components/organisms/ChapterFrame";
import { CHAPTERS } from "@/constants/dive";
import type { ExperienceDto } from "@/server/queries/experiences";

type DescentChapterProps = {
  experiences: ExperienceDto[];
  beats: number;
  /** The chapter's depth range in metres, from the same ranges the HUD reads. */
  depth: { start: number; end: number };
};

const chapter = CHAPTERS[3];
const TICK_M = 200;

/** Every multiple of 200 m inside [start, end]. */
const ticksFor = ({ start, end }: DescentChapterProps["depth"]) => {
  const out: number[] = [];
  for (let m = Math.ceil(start / TICK_M) * TICK_M; m <= end; m += TICK_M) out.push(m);
  return out;
};

/** Career. Entries alternate either side of a pressure line the marker descends. */
export const DescentChapter = ({ experiences, beats, depth }: DescentChapterProps) => {
  const span = depth.end - depth.start || 1;

  return (
    <ChapterFrame id={chapter.id} beats={beats}>
      <ChapterHead index={chapter.index + 1} category={chapter.category} label={chapter.label} />
      <div className="descent">
        {/* The marker's timeline is linear in chapter progress, and the chapter's
            progress is linear in depth, so a tick at its share of the line is
            passed exactly when the HUD reads that depth. */}
        <div className="pressure-line" aria-hidden>
          {ticksFor(depth).map((m) => (
            <span key={m} className="depth-tick" data-depth-tick style={{ top: `${((m - depth.start) / span) * 100}%` }}>
              {m} M
            </span>
          ))}
          <span data-depth-marker />
        </div>
        <ol className="log">
          {experiences.map((e, i) => (
            <DescentLogEntry key={e.id} experience={e} index={i} side={i % 2 === 0 ? "left" : "right"} />
          ))}
        </ol>
      </div>
    </ChapterFrame>
  );
};
