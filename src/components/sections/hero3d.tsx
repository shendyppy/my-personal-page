"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text3D, Environment, Float } from "@react-three/drei";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import TypingText from "@/hooks/useTypingEffect";
import { useThemeContext } from "@/app/providers/ThemeProvider";
import { Theme } from "@/types/Theme";

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

      <Text3D
        font="/fonts/Press Start 2P.json"
        size={1}
        height={0.2}
        position={[-1.5, 1.5, -1.2]}
      >
        Hi,
        <meshStandardMaterial color={colors.text} />
      </Text3D>

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

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY + -64;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
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

      <div className="flex flex-col justify-center text-center z-10 px-4 max-w-6xl mx-auto mt-auto sm:py-10">
        <h1
          className={`font-heading text-4xl md:text-6xl lg:text-7xl mb-6 ${
            theme === "dark" ? "text-gray-100" : "text-gray-800"
          }`}
        >
          <span className="text-accent">Shendy&apos;s here!</span>
        </h1>

        <TypingText
          text={`Front-End Developer with a knack for crafting clean UIs and
          playful interactions. I’m working my way toward Full-Stack reliability
          — curious about LLMs, fascinated by 3D elements, and putting in the
          reps to become just as comfortable building the back end as I am
          polishing the front.`}
        />

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          {/* Primary CTA */}
          <Button
            size="lg"
            className={`cursor-pointer font-semibold rounded-lg transition-all duration-300 transform
      ${
        theme === "dark"
          ? "bg-yellow-400 text-black hover:bg-yellow-300 hover:ring-2 hover:ring-yellow-500 hover:scale-105 shadow-md"
          : "bg-indigo-600 text-white hover:bg-indigo-500 hover:ring-2 hover:ring-indigo-400 hover:scale-105 shadow-md"
      }`}
            onClick={() => scrollToSection("projects")}
            aria-label="View My Work"
          >
            View My Work
          </Button>

          {/* CV Button */}
          <Button
            variant="outline"
            size="lg"
            asChild
            aria-label="Download CV"
            className={`rounded-lg transition-all duration-300 transform
      ${
        theme === "dark"
          ? "border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-muted-foreground hover:scale-105 hover:shadow-lg"
          : "border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-105 hover:shadow-lg"
      }`}
          >
            <Link
              href="/assets/CV_Shendy Putra Perdana Yohansah_19 Sep 2025.pdf"
              download
            >
              Download CV
            </Link>
          </Button>
        </div>

        {/* Social buttons */}
        <div className="flex justify-center space-x-6 mb-12">
          {[
            {
              href: "https://github.com/shendyppy",
              icon: <Github className="h-5 w-5" />,
              label: "GitHub",
            },
            {
              href: "https://www.linkedin.com/in/shendyppy/",
              icon: <Linkedin className="h-5 w-5" />,
              label: "LinkedIn",
            },
            {
              href: "mailto:shendyppy@gmail.com?subject=Hello Shendy&body=I%20saw%20your%20portfolio!",
              icon: <Mail className="h-5 w-5" />,
              label: "Email",
            },
          ].map((item, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              asChild
              aria-label={`Link to my ${item.label}`}
              className={`rounded-lg transition-all duration-300 transform
        ${
          theme === "dark"
            ? "border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-muted-foreground hover:scale-110 hover:shadow-md"
            : "border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-110 hover:shadow-md"
        }`}
            >
              <Link href={item.href} target="_blank">
                {item.icon}
              </Link>
            </Button>
          ))}
        </div>

        {/* Scroll down arrow */}
        <div className="flex justify-center space-x-6 mb-12">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollToSection("about")}
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
