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

export interface ProjectDetail {
  slug: string;
  company: string;
  title: string;
  overview: string;
  scope: string;
  industry: string;
  highlights: ProjectHighlight[];
}

export interface ProjectCard {
  slug: string;
  title: string;
  description: string;
  image: string;
}

export type SkillCategory = "Frontend" | "Backend" | "DevOps" | "Database";

export interface Skill {
  name: string;
  level: number;
  category: SkillCategory;
  logo: string;
  model: string;
  color: string;
}

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

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
  icon: React.ReactNode;
  label: string;
}

export interface TechStack {
  name: string;
  src: string;
}

export interface Club {
  name: string;
  src: string;
}

export interface Love {
  main: {
    name: string;
    src: string;
  };
  clubs: Club[];
}

export interface ColorConfig {
  light: string;
  dark: string;
}

export type CategoryColors = Record<string, ColorConfig>;
export type TraitColors = Record<TraitType, ColorConfig>;
