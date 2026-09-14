import type { CSSProperties } from "react";
import Image from "next/image";

import { RecordPanel } from "@/components/molecules/RecordPanel";
import { DIVE_COPY } from "@/constants/dive";
import type { Skill, SkillCategory } from "@/types";

export type ToolGroup = { category: SkillCategory; label: string; tools: Skill[] };

/** CDN logos stay a plain <img> (SVG, no remotePatterns); local WebP gets next/image. */
const Logo = ({ tool }: { tool: Skill }) => {
  if (!tool.logo) return null;
  const cls = "size-4 object-contain";
  return tool.logo.startsWith("http") ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={tool.logo} alt="" width={16} height={16} className={cls} />
  ) : (
    <Image src={tool.logo} alt="" width={16} height={16} className={cls} />
  );
};

/** The panel beside the sonar: the selected contact's tools, or the idle prompt. */
export const SonarReadout = ({ group }: { group: ToolGroup | null }) => (
  <div aria-live="polite" className="sonar-readout">
    {group ? (
      // Keyed by contact so every switch remounts and replays the swap-in:
      // a scan line sweeps the panel, rows settle, then the chips pop in turn.
      <div key={group.category} className="readout-swap">
        <RecordPanel
          title="OBJECT READOUT"
          rows={[
            { label: "OBJECT", value: group.category },
            { label: "CLASS", value: group.label },
            {
              label: "STACK",
              value: (
                <ul className="m-0 flex max-w-[300px] flex-wrap justify-end gap-1.5 p-0">
                  {group.tools.map((t, i) => (
                    <li
                      key={t.name}
                      style={{ "--i": i } as CSSProperties}
                      className="readout-chip inline-flex list-none items-center gap-1.5 rounded border border-border px-2 py-0.5 text-[10px] tracking-[0.08em]"
                    >
                      <Logo tool={t} />
                      {t.name}
                    </li>
                  ))}
                </ul>
              ),
            },
          ]}
        />
      </div>
    ) : (
      // The contacts are the only way into the toolbox, so the idle state says
      // how to reach them, the same bracketed voice as the scroll cue.
      <div className="sonar-idle">
        <p className="m-0 font-mono text-xs tracking-[0.18em] text-foreground">
          <span className="animate-blink text-accent">[</span>
          <span className="mx-2">{DIVE_COPY.sonarCue}</span>
          <span className="animate-blink text-accent">]</span>
        </p>
        <p className="m-0 mt-3 font-mono text-[10px] tracking-[0.16em] text-muted-foreground">{DIVE_COPY.sonarIdle}</p>
      </div>
    )}
  </div>
);
