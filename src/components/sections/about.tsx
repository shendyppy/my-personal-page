"use client";

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

import { useState } from "react";
import { Button } from "../ui/button";

export const About = () => {
  const initialTraits = [
    { label: "Curious Mind", type: "general", icon: Lightbulb },
    { label: "Problem Solver (learning)", type: "general", icon: Workflow },
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

  const milestones = [
    {
      icon: <Briefcase className="w-5 h-5 text-orange-600 -rotate-45" />,
      iconWrapper:
        "rounded-full bg-orange-200/40 border-2 border-orange-500 shadow-md rotate-45",
      title: "Experience",
      description:
        "3+ years building modern web apps and solving real-world problems.",
      tags: [
        {
          label: "React / Vite.js",
          bg: "bg-orange-200/80",
          text: "text-orange-600",
        },
        { label: "Next.js", bg: "bg-orange-200/80", text: "text-orange-600" },
        { label: "Vue.js", bg: "bg-orange-200/80", text: "text-orange-600" },
        { label: "TypeScript", bg: "bg-orange-200/80", text: "text-orange-600" },
        { label: "JavaScript", bg: "bg-orange-200/80", text: "text-orange-600" },
        { label: "Jest", bg: "bg-orange-200/80", text: "text-orange-600" },
        {
          label: "Various UI Frameworks",
          bg: "bg-orange-200/80",
          text: "text-orange-600",
        },
        {
          label: "Various CSS Frameworks",
          bg: "bg-orange-200/80",
          text: "text-orange-600",
        },
      ],
    },
    {
      icon: <Palette className="w-5 h-5 text-pink-500 -rotate-45" />,
      iconWrapper:
        "rounded-lg bg-red-200/30 border-2 border-pink-400 shadow-md rotate-45",
      title: "What I Love",
      description:
        "Curious about where design, interactivity, and playfulness meet.",
      tags: [
        { label: "UI/UX", bg: "bg-red-400/40", text: "text-pink-600" },
        { label: "3D Web", bg: "bg-red-400/40", text: "text-pink-600" },
        { label: "Animations", bg: "bg-red-400/40", text: "text-pink-600" },
      ],
    },
    {
      icon: <NotebookPen className="w-5 h-5 text-blue-500" />,
      iconWrapper:
        "rounded-lg bg-blue-300/30 border-2 border-blue-400 shadow-md",
      title: "Growing Skills",
      description:
        "Exploring backend, DevOps, and AI to connect design with infrastructure.",
      tags: [
        { label: "Node.js", bg: "bg-blue-300/40", text: "text-blue-600" },
        { label: "Nest.js", bg: "bg-blue-300/40", text: "text-blue-600" },
        { label: "CI/CD", bg: "bg-blue-300/40", text: "text-blue-600" },
        { label: "AI", bg: "bg-blue-300/40", text: "text-blue-600" },
      ],
    },
    {
      icon: <Globe className="w-5 h-5 text-teal-600" />,
      iconWrapper:
        "rounded-full bg-teal-200/30 border-2 border-teal-500 shadow-md",
      title: "Location",
      description:
        "Based in Indonesia 🌏 — always open to remote collaboration.",
      tags: [
        { label: "Indonesia", bg: "bg-teal-300/40", text: "text-teal-700" },
        {
          label: "Remote-friendly",
          bg: "bg-teal-300/40",
          text: "text-teal-700",
        },
      ],
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

  const getColors = (type: string) => {
    switch (type) {
      case "frontend":
        return "bg-yellow-100 hover:bg-yellow-200 text-yellow-800";
      case "three":
        return "bg-blue-100 hover:bg-blue-200 text-blue-800";
      case "backend":
        return "bg-green-100 hover:bg-green-200 text-green-800";
      case "learning":
        return "bg-red-100 hover:bg-red-200 text-red-800";
      default:
        return "bg-gray-100 hover:bg-gray-200 text-gray-800";
    }
  };

  return (
    <section
      id="about"
      className="relative flex flex-col justify-center items-center py-24 px-6 mx-auto"
    >
      {/* Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Firework 1 */}
        <div className="absolute top-1/4 left-1/3 w-10 h-10 rounded-full bg-[#6366f1]/40 animate-firework" />
        {/* Firework 2 */}
        <div className="absolute top-2/3 left-2/3 w-12 h-12 rounded-full bg-[#f472b6]/70 animate-firework delay-300" />
        {/* Firework 3 */}
        <div className="absolute top-1/2 left-1/5 w-8 h-8 rounded-full bg-[#f97316]/70 animate-firework delay-500" />
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Column: Story + Traits */}
        <div className="flex-1">
          <h3 className="font-subheading text-2xl md:text-3xl text-foreground mb-6">
            My Journey So Far 🚀
          </h3>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            I started out as a civil engineer, but my curiosity pulled me into
            tech. Growing up as a gamer (and still one today), I was always
            fascinated by how those worlds were built. The moment I realized a
            few lines of code could bring something interactive to life was
            game-changing — and since then, I’ve been all-in on front-end craft,
            experimenting with 3D on the web, and polishing interfaces that feel
            playful yet reliable.
          </p>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Recently, I’ve been revisiting the backend, DevOps, and even dipping
            my toes into LLMs — learning my way through Node.js, Nest.js, ORMs,
            Python, and the world of CI/CD and deployment. I’m still early on
            this path, but my aim is clear: to eventually feel just as
            comfortable building systems behind the scenes as I do shaping the
            UI up front.
          </p>

          {/* Traits + Shuffle */}

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <Button
              onClick={handleShuffle}
              className="flex items-center gap-2"
              variant="outline"
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
                return (
                  <span
                    key={trait.label}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transform transition-all duration-500 ease-in-out opacity-0 animate-fadeIn ${getColors(
                      trait.type
                    )}`}
                  >
                    <Icon className="w-4 h-4" />
                    {trait.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Milestones */}
        <div className="flex-1 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="text-center">
                {/* Icon */}
                <div
                  className={`mx-auto flex h-10 w-10 items-center justify-center relative z-10 ${milestone.iconWrapper}`}
                >
                  {milestone.icon}
                </div>

                {/* Title */}
                <h4 className="font-subheading text-lg text-card-foreground mt-4 mb-2">
                  {milestone.title}
                </h4>

                {/* Description */}
                {milestone.description && (
                  <p className="text-muted-foreground mb-2 text-sm md:text-base">
                    {milestone.description}
                  </p>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {milestone.tags.map((tag, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded-md text-sm font-medium ${tag.bg} ${tag.text}`}
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
