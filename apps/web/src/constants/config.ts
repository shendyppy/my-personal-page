export const EXTERNAL_LINKS = {
  calendly: "https://calendly.com/shendyppy",
  github: "https://github.com/shendyppy",
  linkedin: "https://www.linkedin.com/in/shendyppy/",
  instagram: "https://www.instagram.com/shendyppy/",
  twitter: "https://www.twitter.com/shendyppy/",
  email: "shendyppy@gmail.com",
};

// Production canonical URL. Override via NEXT_PUBLIC_SITE_URL on preview /
// non-default deploys (e.g. branch previews). Trailing slash intentionally
// omitted so callers can append paths cleanly.
const inferredUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://shendyppy.vercel.app");

export const SITE_CONFIG = {
  author: "Shendy Putra Perdana Yohansah",
  title: "Shendy's Portfolio",
  description: "Front-End Developer specializing in React, TypeScript, and 3D web experiences",
  profileImage: "/assets/Shendy.webp",
  url: inferredUrl,
  locale: "en_US",
};

export const ANIMATION_DELAYS = {
  typing: 30, // useTypingEffect character delay
  clubReveal: 120, // domino-style reveal in About section
  traitShuffle: 500, // shuffle animation duration
};

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export const SECTION_IDS = {
  hero: "hero",
  projects: "projects",
  about: "about",
  experiences: "experiences",
  skills: "skills",
} as const;

// Brand accent options for the live accent picker. Default is lime.
// Each accent carries a `dark` (vivid, pops on near-black) and `light`
// (deeper, readable on the warm-paper light bg) variant — `--accent` is set
// to the theme-appropriate value at runtime by ThemeProvider, so lime/teal
// never disappear on light. `value` is the canonical vivid swatch id.
export const ACCENTS = [
  { id: "lime", label: "Lime", value: "#D7FF3E", dark: "#D7FF3E", light: "#4D7A00" },
  { id: "orange", label: "Orange", value: "#FF6B35", dark: "#FF6B35", light: "#D9531E" },
  { id: "violet", label: "Violet", value: "#7C6CFF", dark: "#7C6CFF", light: "#5A48E0" },
  { id: "teal", label: "Teal", value: "#3EE0C8", dark: "#3EE0C8", light: "#0E9C86" },
] as const;

export type AccentId = (typeof ACCENTS)[number]["id"];
export const DEFAULT_ACCENT: AccentId = "lime";

export const SKILL_CATEGORIES = [
  "All",
  "Frontend",
  "Backend",
  "DevOps",
  "Database",
  "AI",
  "Project Management",
] as const;

export type SkillCategoryFilter = (typeof SKILL_CATEGORIES)[number];
