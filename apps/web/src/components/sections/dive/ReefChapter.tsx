import { ChapterHead } from "@/components/atoms/ChapterHead";
import { DiveSiteRecord } from "@/components/molecules/DiveSiteRecord";
import { ChapterFrame } from "@/components/organisms/ChapterFrame";
import { chapterById } from "@/constants/dive";
import type { ProjectListItem } from "@/server/queries/projects";

type ReefChapterProps = { projects: ProjectListItem[]; beats: number };

const chapter = chapterById("reef");

/** One dive site per project, stacked in a single grid cell and cross-faded
 *  beat by beat. `snap` settles a lazy scroll on a site (Ruling A). */
export const ReefChapter = ({ projects, beats }: ReefChapterProps) => (
  <ChapterFrame id={chapter.id} beats={beats} snap>
    <ChapterHead index={chapter.index + 1} category={chapter.category} label={chapter.label} />
    <div className="reef-stack">
      {/* Sites alternate sides, so the sub gets a lane on each: right of the
          even sites' record, left of the odd ones' (lib/dive/pose altAt). */}
      <div data-sub-anchor="lane" aria-hidden className="reef-lane" />
      <div data-sub-anchor="lane-alt" aria-hidden className="reef-lane reef-lane--alt" />
      {projects.map((p, i) => (
        <DiveSiteRecord key={p.slug} project={p} index={i + 1} />
      ))}
    </div>
  </ChapterFrame>
);
