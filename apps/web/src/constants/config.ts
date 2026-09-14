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
