// Single source of truth for TanStack Query cache keys.
// Keep keys typed-as-tuple (`as const`) so useQuery infers the right shape.

export const queryKeys = {
  about: ["about"] as const,
  projects: ["projects"] as const,
  projectBySlug: (slug: string) => ["projects", slug] as const,
  experiences: ["experiences"] as const,
  skills: ["skills"] as const,
} as const;
