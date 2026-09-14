import type { CSSProperties } from "react";

import { LogDetail } from "@/components/molecules/LogDetail";
import type { ExperienceDto } from "@/server/queries/experiences";

type DescentLogEntryProps = { experience: ExperienceDto; index: number; side: "left" | "right" };

/** One experience on the descent log, hung off one side of the pressure line; the rest of it opens from the log toggle. */
export const DescentLogEntry = ({ experience: e, index, side }: DescentLogEntryProps) => (
  <li className={`log-entry log-entry--${side}`} data-beat={index} style={{ "--row": index + 1 } as CSSProperties}>
    <p className={`log-period m-0 font-mono text-[11px] tracking-[0.14em] ${e.current ? "text-accent" : "text-muted-foreground"}`}>
      {e.period}
    </p>
    <h3 className="font-heading m-0 mt-2 text-[clamp(20px,2.2vw,32px)] leading-[1.05]">{e.title}</h3>
    <p className="log-company m-0 mt-1 font-mono text-xs tracking-[0.1em] text-hud">{e.company}</p>
    <p className="log-description mt-3 max-w-[44ch] text-sm leading-[1.7] text-subtle">{e.description}</p>
    <div className="log-meta mt-3">
      <span className="log-badge inline-block rounded-full border border-border px-3 py-1 font-mono text-[10px] tracking-[0.12em] text-muted-foreground">
        {e.employmentType}
      </span>
      <LogDetail experience={e} />
    </div>
  </li>
);
