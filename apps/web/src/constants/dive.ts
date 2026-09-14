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
  sonarIdle: "AWAITING CONTACT",
  sonarCue: "HOVER OR TAP A CONTACT",
  dragCue: "DRAG THE SUB — IT'S YOURS TO SPIN",
  dragCueShort: "DRAG THE SUB TO SPIN IT",
  contactHeadline: "Have something worth building?",
  contactSub: "LET'S BUILD SOMETHING GOOD.",
  builtIn: "BUILT WITH CURIOSITY IN TANGERANG SELATAN",
  backToSurface: "↑ BACK TO SURFACE",
} as const;

/**
 * Where the sub sits and how big it may be, in viewport terms: x/y are the
 * centre in NDC (-1..1, y up), w/h the box it must fit as fractions of the
 * viewport. `y2` makes the lane a travel lane (y → y2 over the chapter).
 */
export type Lane = { x: number; y: number; w: number; h: number; y2?: number };
export type Pose = Lane & { rotZ: number; lamp: number };

/**
 * Fallback poses, used only for a chapter with no visible `[data-sub-anchor]`
 * — normally every chapter measures one (see lib/dive/lanes). rotZ and lamp
 * always come from here.
 */
export const SUB_POSES: Record<ChapterId, Pose> = {
  surface: { x: 0.1, y: -0.45, w: 0.3, h: 0.25, rotZ: 0, lamp: 0 },
  reef: { x: 0.15, y: -0.1, w: 0.22, h: 0.22, rotZ: -0.105, lamp: 0.6 },
  twilight: { x: -0.15, y: 0, w: 0.22, h: 0.22, rotZ: 0.07, lamp: 1.2 },
  descent: { x: 0, y: 0.6, w: 0.14, h: 0.2, rotZ: 0, lamp: 1.8 },
  midnight: { x: 0, y: 0, w: 0.1, h: 0.12, rotZ: 0, lamp: 2.5 },
  seafloor: { x: 0, y: -0.48, w: 0.3, h: 0.25, rotZ: 0, lamp: 3 },
};

/** Water gradient + fog density along progress (spec §7 palette). */
export const WATER_STOPS = [
  { at: 0, top: "#0e4a6e", bottom: "#083352", fog: 0.02 },
  { at: 0.25, top: "#06263f", bottom: "#041a2c", fog: 0.045 },
  { at: 0.5, top: "#03141f", bottom: "#020c14", fog: 0.07 },
  { at: 0.75, top: "#020a10", bottom: "#010508", fog: 0.095 },
  { at: 1, top: "#010508", bottom: "#000203", fog: 0.12 },
] as const;
