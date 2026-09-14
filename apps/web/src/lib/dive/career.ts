export function earliestYear(periods: string[]): number | null {
  const years = periods.flatMap((p) => (p.match(/\b(19|20)\d{2}\b/g) ?? []).map(Number));
  return years.length ? Math.min(...years) : null;
}
