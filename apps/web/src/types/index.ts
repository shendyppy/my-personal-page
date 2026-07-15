export type Theme = "light" | "dark";

export interface ProjectImage {
  link: string;
  isScrollable: boolean;
}

export interface ProjectHighlight {
  id: string;
  title: string;
  description: string;
  impact: string[];
  images: ProjectImage[];
  link?: string;
}

export interface StoryBlock {
  title: string;
  body: string;
}

export interface ProjectDetail {
  slug: string;
  company: string;
  title: string;
  overview: string;
  scope: string;
  industry: string;
  image: string;
  year: string;
  timeline: string;
  status: string;
  stack: string[];
  storyBlocks: StoryBlock[];
  highlights: ProjectHighlight[];
}

export interface ProjectCard {
  slug: string;
  title: string;
  description: string;
  image: string;
}

export type SkillCategory =
  | "Frontend"
  | "Backend"
  | "DevOps"
  | "Database"
  | "Project Management"
  | "AI";

export interface Skill {
  name: string;
  level: number;
  category: SkillCategory;
  logo: string;
}

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export type EmploymentType =
  | "Full Time"
  | "Part Time"
  | "Freelance"
  | "Contract"
  | "Internship";

export interface Experience {
  id: number;
  title: string;
  company: string;
  logo: string;
  location: string;
  period: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  projects: string[];
  techStack: string;
  employmentType: EmploymentType;
}

export type TraitType =
  | "general"
  | "frontend"
  | "backend"
  | "three"
  | "learning"
  | "shuffle";

export interface Trait {
  label: string;
  type: TraitType;
  icon: React.ComponentType<{ className?: string }>;
}

export interface SocialLink {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

export interface TechStack {
  name: string;
  src: string;
}

export interface Club {
  name: string;
  src: string;
  url?: string;
}

export interface Love {
  main: {
    name: string;
    src: string;
  };
  clubs: Club[];
}

export interface CvInfo {
  title: string;
  previewImage: string;
  downloadPath: string;
}

export interface ColorConfig {
  light: string;
  dark: string;
}

export type CategoryColors = Record<string, ColorConfig>;
export type TraitColors = Record<TraitType, ColorConfig>;
