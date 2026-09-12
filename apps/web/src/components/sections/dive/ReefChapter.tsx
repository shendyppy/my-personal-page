import { ChapterHead } from "@/components/atoms/ChapterHead";
import { DiveSiteRecord } from "@/components/molecules/DiveSiteRecord";
import { ChapterFrame } from "@/components/organisms/ChapterFrame";
import { CHAPTERS } from "@/constants/dive";
import type { ProjectListItem } from "@/server/queries/projects";

type ReefChapterProps = { projects: ProjectListItem[]; beats: number };

const chapter = CHAPTERS[1];

/** One dive site per project, stacked in a single grid cell and cross-faded
 *  beat by beat. `snap` settles a lazy scroll on a site (Ruling A). */
export const ReefChapter = ({ projects, beats }: ReefChapterProps) => (
  <ChapterFrame id={chapter.id} beats={beats} snap>
    <ChapterHead index={chapter.index + 1} category={chapter.category} label={chapter.label} />
    <div className="reef-stack">
      {projects.map((p, i) => (
        <DiveSiteRecord key={p.slug} project={p} index={i + 1} />
      ))}
    </div>
  </ChapterFrame>
);
