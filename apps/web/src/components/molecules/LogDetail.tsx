"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Plus, X } from "lucide-react";

import type { ExperienceDto } from "@/server/queries/experiences";

type LogDetailProps = {
  experience: Pick<ExperienceDto, "title" | "company" | "location" | "projects" | "responsibilities" | "techStack">;
};

const Body = ({ experience: e }: LogDetailProps) => {
  const stack = e.techStack.split(",").map((s) => s.trim()).filter(Boolean);
  return (
    <>
      {e.location && <p className="log-detail-loc">{e.location}</p>}
      {e.projects.length > 0 && (
        <section>
          <h4 className="log-detail-label">PROJECTS · {e.projects.length}</h4>
          <ul className="log-detail-list">
            {e.projects.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      )}
      {e.responsibilities.length > 0 && (
        <section>
          <h4 className="log-detail-label">LOG</h4>
          <ul className="log-detail-list log-detail-list--quiet">
            {e.responsibilities.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      )}
      {stack.length > 0 && (
        <section>
          <h4 className="log-detail-label">STACK</h4>
          <ul className="log-detail-chips">
            {stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
};

/**
 * The rest of an experience — projects, responsibilities, stack — which the
 * log entry has no room for. Only a click opens it (a hover popover got in the
 * way of reading the log): a bottom sheet on phones, a centred dialog on
 * desktop, portalled to <body> because the pinned, transformed stage would
 * otherwise trap a fixed element.
 */
export const LogDetail = ({ experience }: LogDetailProps) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (ev: KeyboardEvent) => ev.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const count = experience.projects.length;

  return (
    <>
      <button type="button" className="log-detail-toggle" aria-expanded={open} onClick={() => setOpen(true)}>
        <span aria-hidden className="log-detail-ping" />
        <span className="log-detail-bracket">[</span>
        {count > 0 ? `${count} PROJECT${count === 1 ? "" : "S"} · STACK` : "OPEN LOG"}
        <span className="log-detail-bracket">]</span>
        <Plus aria-hidden className="log-detail-plus" />
      </button>

      {/* open only ever becomes true from a click, so this never runs on the server. */}
      {open &&
        createPortal(
          <div className="log-sheet-layer" data-lenis-prevent>
            <button type="button" aria-label="Close" className="log-sheet-backdrop" onClick={() => setOpen(false)} />
            <div role="dialog" aria-modal="true" aria-label={`${experience.title} — ${experience.company}`} className="log-sheet record-panel">
              <div className="record-head">
                <span className="truncate">{experience.company}</span>
                <span aria-hidden className="record-rule" />
                <button type="button" aria-label="Close" className="log-sheet-close" onClick={() => setOpen(false)}>
                  <X className="size-4" />
                </button>
              </div>
              <div className="log-sheet-body">
                <p className="log-detail-title">{experience.title}</p>
                <Body experience={experience} />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
