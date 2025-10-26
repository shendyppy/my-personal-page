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
  BookText,
  Library,
  NotepadText,
  Shuffle,
} from "lucide-react";

import { Trait } from "@/types";

export const heroBio = `<p>
  Front-End Developer currently at <b>Daya Dimensi Indonesia</b> with <b>4+ years of experience</b>. I specialize in creating clean, user-friendly UIs and playful interactions. Currently, I'm expanding my skills to become a full-stack developer, with a keen interest in <b>Large Language Models</b> and <b>3D web elements</b>.
</p>`;

export const heroTraits: Trait[] = [
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

  { label: "Shuffle", type: "shuffle", icon: Shuffle },
];
