"use client";

import { useState } from "react";
import {
  Code,
  Layout,
  Layers3,
  Cpu,
  Workflow,
  Gamepad2,
  Lightbulb,
  Brain,
  Sparkles,
  Bot,
  Frame,
  Wand,
  Shuffle,
  Briefcase,
  Palette,
  Globe,
  NotebookPen,
  BookText,
  Library,
  NotepadText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useThemeContext } from "@/app/providers/ThemeProvider";

export const About = () => {
  const { theme } = useThemeContext();

  const initialTraits = [
    { label: "Curious Mind", type: "general", icon: Lightbulb },
    {
      label: "Problem Solver (still eager to learn)",
      type: "general",
      icon: Workflow,
    },
    { label: "Always Growing", type: "general", icon: Brain },

    { label: "Exploring Front-End Craft", type: "frontend", icon: Layout },
    { label: "UI/UX Enthusiast", type: "frontend", icon: Frame },
    { label: "Playful Experiments", type: "frontend", icon: Sparkles },
    { label: "Test Driven Development", type: "frontend", icon: Sparkles },

    { label: "Learning 3D & Graphics", type: "three", icon: Layers3 },
    { label: "Trying Out Animations", type: "three", icon: Gamepad2 },
    { label: "Polishing Interfaces", type: "three", icon: Wand },

    { label: "Backend Beginner", type: "backend", icon: Code },
    { label: "REST API Craft", type: "backend", icon: Cpu },
    { label: "Docker Self Test Endpoint", type: "backend", icon: Bot },

    {
      label: "DevOps Love at The First Deployment",
      type: "learning",
      icon: BookText,
    },
    { label: "AI Engineer Wanna Be", type: "learning", icon: Library },
    { label: "Database Want to Learn", type: "learning", icon: NotepadText },
  ];

  const descriptions = [
    {
      icon: <Briefcase className="w-5 h-5 -rotate-45" />,
      iconWrapper: `rounded-full border-2 shadow-md rotate-45 ${
        theme === "dark"
          ? "bg-orange-500/20 border-orange-400"
          : "bg-orange-200/40 border-orange-500"
      }`,
      title: "Experience",
      description:
        "3+ years building modern web apps and solving real-world problems.",
      tags: [
        "React / Vite.js",
        "Next.js",
        "Vue.js",
        "TypeScript",
        "JavaScript",
        "Jest",
        "Various UI Frameworks",
        "Various CSS Frameworks",
      ].map((label) => ({
        label,
        bg: theme === "dark" ? "bg-orange-500/20" : "bg-orange-200/80",
        text: theme === "dark" ? "text-orange-300" : "text-orange-600",
      })),
    },
    {
      icon: <Palette className="w-5 h-5" />,
      iconWrapper: `rounded-lg border-2 shadow-md ${
        theme === "dark"
          ? "bg-pink-500/20 border-pink-400"
          : "bg-red-200/30 border-pink-400"
      }`,
      title: "What I Love",
      description:
        "Curious about where design, interactivity, and playfulness meet.",
      tags: ["UI/UX", "3D Web", "Animations"].map((label) => ({
        label,
        bg: theme === "dark" ? "bg-pink-500/20" : "bg-red-400/40",
        text: theme === "dark" ? "text-pink-300" : "text-pink-600",
      })),
    },
    {
      icon: <NotebookPen className="w-5 h-5" />,
      iconWrapper: `rounded-lg border-2 shadow-md ${
        theme === "dark"
          ? "bg-blue-500/20 border-blue-400"
          : "bg-blue-300/30 border-blue-400"
      }`,
      title: "Growing Skills",
      description:
        "Exploring backend, DevOps, and AI to connect design with infrastructure.",
      tags: [
        "Node.js",
        "Nest.js",
        "Express",
        "MongoDB",
        "Sequelize",
        "PostgreSQL",
        "AWS",
        "Github Actions",
        "CI/CD",
        "AI",
        "Python",
      ].map((label) => ({
        label,
        bg: theme === "dark" ? "bg-blue-500/20" : "bg-blue-300/40",
        text: theme === "dark" ? "text-blue-300" : "text-blue-600",
      })),
    },
    {
      icon: <Globe className="w-5 h-5" />,
      iconWrapper: `rounded-full border-2 shadow-md ${
        theme === "dark"
          ? "bg-teal-500/20 border-teal-500"
          : "bg-teal-200/30 border-teal-500"
      }`,
      title: "Location",
      description:
        "Based in Indonesia 🌏 — always open to remote collaboration.",
      tags: [
        "Banten, Tangerang Selatan",
        "Remote-friendly",
        "Willing-to-relocate",
      ].map((label) => ({
        label,
        bg: theme === "dark" ? "bg-teal-500/20" : "bg-teal-300/40",
        text: theme === "dark" ? "text-teal-300" : "text-teal-700",
      })),
    },
  ];

  const [traits, setTraits] = useState(initialTraits);
  const [shuffleKey, setShuffleKey] = useState(0);

  const shuffleArray = (array: typeof traits) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleShuffle = () => {
    setTraits(shuffleArray(traits));
    setShuffleKey((k) => k + 1);
  };

  const colorKeys: Record<string, { light: string; dark: string }> = {
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
  };

  return (
    <section
      id="about"
      className="relative max-w-6xl flex flex-col justify-center items-center xl:h-screen py-16 px-6 mx-auto"
    >
      {/* Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-10 h-10 rounded-full bg-[#6366f1]/40 animate-firework" />
        <div className="absolute top-2/3 left-2/3 w-12 h-12 rounded-full bg-[#f472b6]/70 animate-firework delay-300" />
        <div className="absolute top-1/2 left-1/5 w-8 h-8 rounded-full bg-[#f97316]/70 animate-firework delay-500" />
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Column */}
        <div className="flex-1">
          <h3 className="font-subheading text-2xl md:text-3xl text-foreground mb-6">
            My Journey So Far 🚀
          </h3>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            I began my career as a civil engineer, but curiosity soon pulled me
            into tech{" "}
            <span className="italic underline">
              (during the pandemic I challenged myself to switch paths by
              joining a coding bootcamp)
            </span>
            . Growing up as a gamer — and still one today — I was always
            fascinated by how those worlds were built. Realizing that a few
            lines of code could bring something interactive to life was
            game-changing. Since then, I’ve been all-in on front-end craft:
            experimenting with 3D on the web, and polishing interfaces that feel
            playful and intuitive.
          </p>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Recently, I’ve been revisiting the backend, DevOps, and even dipping
            my toes into LLMs — learning my way through Node.js, Nest.js, ORMs,
            Python, and the world of CI/CD and deployment. I’m still early on
            this path, but my aim is clear: to eventually feel just as
            comfortable building systems behind the scenes as I do shaping the
            UI up front.
          </p>

          {/* Shuffle button + traits */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <Button
              onClick={handleShuffle}
              className={`flex items-center gap-2 text-white cursor-pointer 
    transition-all duration-500 ease-in-out 
    hover:scale-105 active:scale-95 shadow-md
    ${
      theme === "light"
        ? "bg-emerald-400 hover:bg-emerald-600"
        : "bg-emerald-800 hover:bg-emerald-600"
    }`}
              aria-label="Shuffle Traits"
            >
              <Shuffle className="w-4 h-4" />
            </Button>
            <div
              key={shuffleKey}
              className="flex flex-wrap gap-2 transition-all duration-500"
            >
              {traits.map((trait) => {
                const Icon = trait.icon;
                const traitColors =
                  colorKeys[trait.type][theme === "dark" ? "dark" : "light"];
                return (
                  <span
                    key={trait.label}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium animate-fadeIn ${traitColors}`}
                  >
                    <Icon className="w-4 h-4" /> {trait.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 w-full transition-all duration-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {descriptions.map((description, idx) => (
              <div key={idx} className="text-center">
                {/* Icon */}
                <div
                  className={`mx-auto flex h-10 w-10 items-center justify-center relative z-10 ${description.iconWrapper}`}
                >
                  {description.icon}
                </div>

                <h4 className="font-subheading text-lg text-card-foreground mt-4 mb-2">
                  {description.title}
                </h4>

                {description.description && (
                  <p className="text-muted-foreground mb-2 text-sm md:text-base">
                    {description.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 justify-center">
                  {description.tags.map((tag, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded-md text-sm font-medium transition-all duration-500 ${tag.bg} ${tag.text}`}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
