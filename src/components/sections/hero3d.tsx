"use client";

import { Suspense, useState } from "react";
import {
  ArrowDown,
  Shuffle,
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
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text3D, Environment, Float } from "@react-three/drei";

import { Button } from "@/components/ui/button";
import TypingText from "@/hooks/useTypingEffect";
import { useThemeContext } from "@/app/providers/ThemeProvider";
import { Theme } from "@/types/Theme";
import { useIsSmUp } from "@/hooks/useIsSmUp";
import { scrollToSection } from "@/lib/utils";

const INITIAL_TRAITS = [
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

const FloatingCube = ({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) => {
  return (
    <Float speed={3} rotationIntensity={1} floatIntensity={2}>
      <mesh position={position}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </Float>
  );
};

const Scene3D = ({ theme }: { theme: Theme }) => {
  const isSmUp = useIsSmUp();
  const colors =
    theme === "dark"
      ? {
          text: "#00E5FF", // cyan neon
          cubes: ["#A3FF12", "#FF1F8F", "#FFD60A", "#7C4DFF"],
        }
      : {
          text: "#2563EB", // sky blue pastel
          cubes: ["#34D399", "#F87171", "#A78BFA", "#FBBF24"],
        };

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Environment preset="studio" />

      {isSmUp && (
        <Text3D
          font="/fonts/Press Start 2P.json"
          size={1}
          height={0.2}
          position={[-1.5, 1.5, -1.2]}
        >
          Hi,
          <meshStandardMaterial color={colors.text} />
        </Text3D>
      )}

      <FloatingCube position={[3, 1, 0]} color={colors.cubes[0]} />
      <FloatingCube position={[-3, -1.5, -5]} color={colors.cubes[1]} />
      <FloatingCube position={[-3, -1, 1]} color={colors.cubes[2]} />
      <FloatingCube position={[2, -1.5, -1]} color={colors.cubes[3]} />

      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
};

export const Hero3D = () => {
  const { theme } = useThemeContext();

  const [traits, setTraits] = useState(INITIAL_TRAITS);
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
    shuffle: {
      light:
        "bg-emerald-400 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all",
      dark: "bg-emerald-800 hover:bg-emerald-600 shadow-blue-500/30 hover:shadow-blue-400/50 hover:scale-105 transition-all",
    },
  };

  return (
    <section
      id="hero"
      className="w-full h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Suspense fallback={null}>
            <Scene3D theme={theme} />
          </Suspense>
        </Canvas>
      </div>

      <div className="flex flex-col justify-center text-center z-10 px-4 max-w-6xl mx-auto mt-auto sm:py-16">
        <h1
          className={`font-heading text-4xl md:text-6xl lg:text-7xl mb-6 ${
            theme === "dark" ? "text-gray-100" : "text-gray-800"
          }`}
        >
          <span className="text-accent">Shendy&apos;s here!</span>
        </h1>

        <TypingText
          text={`<p>
  Front-End Developer currently at <b>Daya Dimensi Indonesia</b> with <b>4+ years of experience</b>. I specialize in creating clean, user-friendly UIs and playful interactions. Currently, I'm expanding my skills to become a full-stack developer, with a keen interest in <b>Large Language Models</b> and <b>3D web elements</b>.
</p>`}
        />

        {/* Shuffle button + traits */}
        <div
          key={shuffleKey}
          className="flex flex-wrap gap-2 justify-center transition-all duration-500 px-2 sm:px-4"
        >
          {traits.map((trait) => {
            const Icon = trait.icon;
            const traitColors =
              colorKeys[trait.type][theme === "dark" ? "dark" : "light"];
            return (
              <Button
                key={trait.label}
                className={`flex items-center gap-1 
          px-2 py-1 text-xs
          sm:px-3 sm:py-1.5 sm:text-sm 
          md:px-4 md:py-2 md:text-base
          rounded-full font-medium animate-fadeIn select-none ${traitColors}`}
                onClick={trait.type === "shuffle" ? handleShuffle : undefined}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                {trait.label}
              </Button>
            );
          })}
        </div>

        <div className="flex justify-center space-x-6 my-12">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollToSection("projects")}
            className={`animate-bounce cursor-pointer rounded-lg transition-all duration-300 transform
      ${
        theme === "dark"
          ? "border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-muted-foreground hover:scale-110"
          : "border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-110"
      }`}
          >
            <ArrowDown className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};
