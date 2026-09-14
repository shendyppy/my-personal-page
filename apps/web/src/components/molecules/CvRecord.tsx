import Image from "next/image";
import { ArrowDown } from "lucide-react";

import type { CvInfoDto } from "@/server/queries/about";

type CvRecordProps = { cv: Pick<CvInfoDto, "title" | "previewImage" | "downloadPath"> };

/**
 * The CV as a dive record, in the same hairline-panel voice as the diver and
 * sonar readouts: mono header, a preview window that scrolls the page and
 * warms to colour on hover, label rows and a lime bracketed download.
 */
export const CvRecord = ({ cv }: CvRecordProps) => (
  <div className="record-panel cv-record group">
    <div className="record-head">
      <span>CURRICULUM VITAE</span>
      <span aria-hidden className="record-rule" />
      <span className="text-accent">DOC-06</span>
    </div>
    <div className="cv-preview" data-cv-preview>
      <Image src={cv.previewImage} alt="CV preview" width={420} height={594} className="cv-preview-img" />
    </div>
    <dl className="m-0">
      <div className="record-row">
        <dt>FILE</dt>
        <dd>{cv.title}</dd>
      </div>
      <div className="record-row">
        <dt>FORMAT</dt>
        <dd>PDF · A4</dd>
      </div>
    </dl>
    <a href={cv.downloadPath} download target="_blank" rel="noopener noreferrer" aria-label="Download CV" className="cv-download">
      <span className="text-accent">[</span>
      <span>DOWNLOAD CV</span>
      <ArrowDown aria-hidden className="size-3.5" />
      <span className="text-accent">]</span>
    </a>
  </div>
);
