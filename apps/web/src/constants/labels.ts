import type { EmploymentType, SkillCategory } from "@prisma/client";

// Prisma enum names are identifiers ("FullTime"); these are what the page shows.
// `Record` keeps them exhaustive: a new enum value fails type-check until labelled.

export const SKILL_CATEGORY_LABEL: Record<SkillCategory, string> = {
  Frontend: "Frontend",
  Backend: "Backend",
  Database: "Database",
  DevOps: "DevOps",
  AI: "AI",
  ProjectManagement: "Project Management",
};

export const EMPLOYMENT_TYPE_LABEL: Record<EmploymentType, string> = {
  FullTime: "Full Time",
  PartTime: "Part Time",
  Contract: "Contract",
  Freelance: "Freelance",
  Internship: "Internship",
};
