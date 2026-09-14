type ChapterHeadProps = { index: number; category: string; label: string };

/** "02 · WORK   DIVE SITES" — the mono orientation line at the top of a stage. */
export const ChapterHead = ({ index, category, label }: ChapterHeadProps) => (
  <p className="chapter-head" data-reveal>
    <span className="text-accent">{String(index).padStart(2, "0")} · {category}</span>
    <span className="ml-4 text-muted-foreground">{label}</span>
  </p>
);
