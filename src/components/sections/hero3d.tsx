"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text3D, Environment, Float } from "@react-three/drei";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

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

const Scene3D = () => {
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
        <meshStandardMaterial color="#164E63" />
      </Text3D>

      <FloatingCube position={[3, 1, 0]} color="#597445" />
      <FloatingCube position={[-3, -1.5, -5]} color="#164E63" />
      <FloatingCube position={[-3, -1, 1]} color="#C96868" />
      <FloatingCube position={[2, -1.5, -1]} color="#295F98" />

      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
};

export const Hero3D = () => {
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
            <Scene3D />
          </Suspense>
        </Canvas>
      </div>

      <div className="flex flex-col justify-center text-center z-10 px-4 max-w-4xl mx-auto mt-auto sm:py-10">
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-foreground mb-6">
          <span className="text-accent">Shendy&apos;s here!</span>
        </h1>
        <p className="text-md md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto line-clamp-6 italic underline">
          &quot;Front-End Developer with a knack for crafting clean UIs and
          playful interactions. I’m working my way toward Full-Stack reliability
          — curious about LLMs, fascinated by 3D elements, and putting in the
          reps to become just as comfortable building the back end as I am
          polishing the front.&quot;
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/70 cursor-pointer"
            onClick={() => scrollToSection("projects")}
          >
            View My Work
          </Button>
          <Button
            variant="outline"
            className="border-secondary"
            size="lg"
            asChild
          >
            <Link
              href="/assets/CV_Shendy Putra Perdana Yohansah_05 Aug 2025.pdf"
              download
            >
              Download CV
            </Link>
          </Button>
        </div>

        <div className="flex justify-center space-x-6 mb-12">
          <Button
            variant="outline"
            className="border-secondary"
            size="sm"
            asChild
          >
            <Link href="https://github.com/shendyppy" target="_blank">
              <Github className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" className="border-secondary" size="sm">
            <Link href="https://www.linkedin.com/in/shendyppy/" target="_blank">
              <Linkedin className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="outline"
            className="border-secondary cursor-pointer"
            size="sm"
            onClick={() => scrollToSection("contact")}
          >
            <Mail className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex justify-center space-x-6 mb-12">
          <Button
            variant="outline"
            className="border-secondary animate-bounce cursor-pointer"
            size="sm"
            onClick={() => scrollToSection("about")}
          >
            <ArrowDown className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};
