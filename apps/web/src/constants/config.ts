export const EXTERNAL_LINKS = {
  calendly: "https://calendly.com/shendyppy",
  github: "https://github.com/shendyppy",
  linkedin: "https://www.linkedin.com/in/shendyppy/",
  instagram: "https://www.instagram.com/shendyppy/",
  twitter: "https://www.twitter.com/shendyppy/",
  email: "shendyppy@gmail.com",
};

export const SITE_CONFIG = {
  author: "Shendy Putra Perdana Yohansah",
  title: "Shendy's Portfolio",
  description: "Front-End Developer specializing in React, TypeScript, and 3D web experiences",
  profileImage: "/assets/Shendy.webp",
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
