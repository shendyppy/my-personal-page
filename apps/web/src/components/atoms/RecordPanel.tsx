import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Row = { label: string; value: ReactNode };
type RecordPanelProps = { title: string; code?: string; rows: Row[]; className?: string };

/** Hairline HUD panel: mono header ("DIVER RECORD ······ REC-01") + label|value rows. */
export const RecordPanel = ({ title, code, rows, className }: RecordPanelProps) => (
  <div className={cn("record-panel", className)} data-reveal>
    <div className="record-head">
      <span>{title}</span>
      <span aria-hidden className="record-rule" />
      {code && <span className="text-accent">{code}</span>}
    </div>
    <dl className="m-0">
      {rows.map((r) => (
        <div key={r.label} className="record-row">
          <dt>{r.label}</dt>
          <dd>{r.value}</dd>
        </div>
      ))}
    </dl>
  </div>
);
