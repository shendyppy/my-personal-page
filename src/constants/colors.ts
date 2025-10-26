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

export const scene3DColors = {
  dark: {
    text: "#00E5FF", // cyan neon
    cubes: ["#A3FF12", "#FF1F8F", "#FFD60A", "#7C4DFF"],
  },
  light: {
    text: "#2563EB", // sky blue pastel
    cubes: ["#34D399", "#F87171", "#A78BFA", "#FBBF24"],
  },
};
