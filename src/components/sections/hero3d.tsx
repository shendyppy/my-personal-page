"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text3D, Environment, Float } from "@react-three/drei";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";

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
        position={[-1.7, 1.8, -1.2]}
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
  const scrollToAbout = () => {
    const element = document.getElementById("about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-foreground mb-6">
          <span className="text-accent">Shendy&apos;s here!</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Full-Stack Developer crafting digital experiences with modern
          technologies and creative 3D elements
          <br />
          [DUMMY]
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            View My Work
          </Button>
          <Button variant="outline" className="border-secondary" size="lg">
            Download CV
          </Button>
        </div>

        <div className="flex justify-center space-x-6 mb-12">
          <Button variant="outline" className="border-secondary" size="sm">
            <Github className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="border-secondary" size="sm">
            <Linkedin className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="border-secondary" size="sm">
            <Mail className="h-5 w-5" />
          </Button>
        </div>

        <Button
          variant="outline"
          className="border-secondary animate-bounce"
          size="sm"
          onClick={scrollToAbout}
        >
          <ArrowDown className="h-5 w-5" />
        </Button>
      </div>
    </section>
  );
};
