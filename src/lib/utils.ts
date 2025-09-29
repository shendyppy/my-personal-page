import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const scrollToSection = (section: string) => {
  const element = document.getElementById(section);
  if (element) {
    const y = element.getBoundingClientRect().top + window.scrollY + -64;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
};
