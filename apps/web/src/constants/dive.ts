export const MAX_DEPTH_M = 4000;

export const CHAPTER_IDS = [
  "surface",
  "reef",
  "twilight",
  "descent",
  "midnight",
  "seafloor",
] as const;
export type ChapterId = (typeof CHAPTER_IDS)[number];

export type Chapter = {
  id: ChapterId;
  index: number;
  /** Rail / HUD word, e.g. "REEF". */
  name: string;
  /** Chapter subtitle, e.g. "DIVE SITES". */
  label: string;
  /** Chapter head word (the content category). */
  category: string;
  /** Viewport-heights the pinned stage scrolls. reef/descent are replaced by data length. */
  beats: number;
};

export const CHAPTERS: readonly Chapter[] = [
  { id: "surface", index: 0, name: "SURFACE", label: "DEEP FIELD", category: "HERO", beats: 1 },
  { id: "reef", index: 1, name: "REEF", label: "DIVE SITES", category: "WORK", beats: 5 },
  { id: "twilight", index: 2, name: "TWILIGHT", label: "DIVER RECORD", category: "ABOUT", beats: 1.5 },
  { id: "descent", index: 3, name: "DESCENT", label: "DESCENT LOG", category: "CAREER", beats: 3 },
  { id: "midnight", index: 4, name: "MIDNIGHT", label: "SONAR", category: "TOOLBOX", beats: 1.5 },
  { id: "seafloor", index: 5, name: "SEAFLOOR", label: "SURFACE LINK", category: "CONTACT", beats: 1 },
];

export const sectionId = (id: ChapterId) => `dive-${id}`;

export const DIVE_COPY = {
  brand: "DEEP DIVE",
  scrollCue: "[ SCROLL TO DIVE ]",
  path: "Front-end → Full-stack",
  base: "Tangerang Selatan, ID",
  sonarIdle: "AWAITING CONTACT · HOVER A BLIP",
  dragCue: "DRAG THE SUB — IT'S YOURS TO SPIN",
  contactHeadline: "Have something worth building?",
  contactSub: "LET'S BUILD SOMETHING GOOD.",
  builtIn: "BUILT WITH CURIOSITY IN TANGERANG SELATAN",
  backToSurface: "↑ BACK TO SURFACE",
} as const;
