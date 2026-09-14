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
