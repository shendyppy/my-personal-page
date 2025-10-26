"use client";

import React, { Suspense, useState, useMemo } from "react";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";

import { Button } from "@/components/ui/button";
import { useThemeContext } from "@/app/providers/ThemeProvider";
import { skills } from "@/data/skills";
import { skillCategoryColors } from "@/constants/colors";
import { Skill } from "@/types";
import { SkillCard } from "@/components/molecules/SkillCard";

const SkillModel = ({
  skill,
  theme,
}: {
  skill: Skill;
  theme: string;
}) => {
  const glb = useGLTF(skill.model);
  const scale = 1.2;

  glb.scene.traverse((child: THREE.Object3D) => {
    if ((child as THREE.Mesh).isMesh) {
      (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
        color:
          theme === "dark"
            ? new THREE.Color(skill.color).offsetHSL(0, 0, 0.1)
            : skill.color,
        metalness: 0.3,
        roughness: 0.6,
        side: THREE.DoubleSide,
      });
    }
  });

  return (
    <group rotation={[Math.PI / 2, 0, 0]} scale={scale}>
      <primitive object={glb.scene} />
    </group>
  );
};

export const Skills = () => {
  const { theme } = useThemeContext();
  const [selectedSkill, setSelectedSkill] = useState<Skill>(skills[0]);
  const [filter, setFilter] = useState("All");

  const filteredSkills = useMemo(
    () =>
      filter === "All" ? skills : skills.filter((s) => s.category === filter),
    [filter]
  );

  return (
    <section
      id="skills"
      className="max-w-6xl px-4 md:px-6 py-2 relative overflow-hidden space-y-8 !mx-auto"
    >
      {/* Header */}
      <div className="relative text-center">
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
          <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Experiments{" "}
          </span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
          Explore <span className="text-accent font-semibold">3D orbit</span> of
          skills and browse through categorized cards{" "}
        </p>
        <div className="mt-3 w-24 h-1 bg-gradient-to-r from-accent to-primary mx-auto rounded-full" />
      </div>

      <div className="flex flex-col !justify-center md:grid md:grid-cols-2 gap-6 md:gap-8 items-center mx-auto">
        {/* Left Side - 3D Viewer */}
        <div className="flex-1 h-[50vh] md:h-[calc(100dvh-12rem)] relative rounded-xl">
          <div className="w-full h-[300px] lg:h-full flex items-center justify-center transition-all duration-500 ease-in-out animate-fadeIn">
            <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
              <ambientLight intensity={theme === "dark" ? 0.4 : 0.7} />
              <directionalLight
                position={[5, 5, 5]}
                intensity={theme === "dark" ? 1.5 : 2}
              />
              <Suspense fallback={null}>
                <OrbitControls enableZoom autoRotate autoRotateSpeed={1} />
                <SkillModel skill={selectedSkill} theme={theme} />
              </Suspense>
            </Canvas>
          </div>
        </div>

        {/* Right Side - Filter + Cards */}
        <div className="flex-1 flex flex-col justify-center gap-4">
          {/* Filter */}
          <div className="flex gap-2 mb-2 flex-wrap justify-center md:justify-start">
            {["All", "Frontend", "Backend", "DevOps", "Database"].map((cat) => (
              <Button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 
                  ${
                    filter === cat
                      ? "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:shadow-md scale-105"
                      : theme === "dark"
                      ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                  }`}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 pr-0 md:pr-2">
            {filteredSkills.map((skill) => {
              const isActive = selectedSkill?.name === skill.name;
              const colorClasses =
                skillCategoryColors[skill.category][theme as "light" | "dark"];

              return (
                <SkillCard
                  key={skill.name}
                  skill={skill}
                  isActive={isActive}
                  colorClasses={colorClasses}
                  onClick={() => setSelectedSkill(skill)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
