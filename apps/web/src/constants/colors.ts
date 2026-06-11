import { CategoryColors, TraitColors } from "@/types";

export const skillCategoryColors: CategoryColors = {
  Frontend: {
    light: "bg-blue-100 border-blue-400",
    dark: "bg-blue-900/40 border-blue-600",
  },
  Backend: {
    light: "bg-green-100 border-green-400",
    dark: "bg-green-900/40 border-green-600",
  },
  DevOps: {
    light: "bg-yellow-100 border-yellow-400",
    dark: "bg-yellow-900/40 border-yellow-600",
  },
  Database: {
    light: "bg-purple-100 border-purple-400",
    dark: "bg-purple-900/40 border-purple-600",
  },
  "Project Management": {
    light: "bg-orange-100 border-orange-400",
    dark: "bg-orange-900/40 border-orange-600",
  },
  All: {
    light: "bg-gray-100 border-gray-400",
    dark: "bg-gray-800 border-gray-600",
  },
};

export const traitColors: TraitColors = {
  frontend: {
    light:
      "bg-yellow-200 hover:bg-yellow-300 text-yellow-900 shadow-md hover:shadow-lg hover:scale-105 transition-all",
    dark: "bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 shadow-yellow-500/30 hover:shadow-yellow-400/50 hover:scale-105 transition-all",
  },
  backend: {
    light:
      "bg-green-200 hover:bg-green-300 text-green-900 shadow-md hover:shadow-lg hover:scale-105 transition-all",
    dark: "bg-green-500/20 hover:bg-green-500/40 text-green-300 shadow-green-500/30 hover:shadow-green-400/50 hover:scale-105 transition-all",
  },
  three: {
    light:
      "bg-purple-200 hover:bg-purple-300 text-purple-900 shadow-md hover:shadow-lg hover:scale-105 transition-all",
    dark: "bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 shadow-purple-500/30 hover:shadow-purple-400/50 hover:scale-105 transition-all",
  },
  learning: {
    light:
      "bg-pink-200 hover:bg-pink-300 text-pink-900 shadow-md hover:shadow-lg hover:scale-105 transition-all",
    dark: "bg-pink-500/20 hover:bg-pink-500/40 text-pink-300 shadow-pink-500/30 hover:shadow-pink-400/50 hover:scale-105 transition-all",
  },
  general: {
    light:
      "bg-blue-200 hover:bg-blue-300 text-blue-900 shadow-md hover:shadow-lg hover:scale-105 transition-all",
    dark: "bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 shadow-blue-500/30 hover:shadow-blue-400/50 hover:scale-105 transition-all",
  },
  shuffle: {
    light:
      "bg-emerald-400 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all",
    dark: "bg-emerald-800 hover:bg-emerald-600 shadow-blue-500/30 hover:shadow-blue-400/50 hover:scale-105 transition-all",
  },
};

/**
 * Vivid gradient pairs for project tiles (and experience timeline accents),
 * cycled per index. These are intentionally always-vivid (white text rides on
 * top of a dark scrim), so they read the same on light and dark themes.
 */
export const projectTileGradients = [
  "from-fuchsia-500 via-purple-500 to-indigo-500",
  "from-cyan-400 via-sky-500 to-blue-500",
  "from-amber-400 via-orange-500 to-rose-500",
  "from-emerald-400 via-teal-500 to-cyan-500",
  "from-violet-500 via-fuchsia-500 to-pink-500",
  "from-rose-500 via-red-500 to-orange-500",
] as const;
