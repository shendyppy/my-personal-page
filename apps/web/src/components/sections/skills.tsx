"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";

import { Button } from "@/components/ui/button";
import { useThemeContext } from "@/app/providers/ThemeProvider";
import { skillCategoryColors } from "@/constants/colors";
import { SKILL_CATEGORIES, type SkillCategoryFilter } from "@/constants/config";
import { Skill } from "@/types";
import { SkillCard } from "@/components/molecules/SkillCard";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { queryKeys } from "@/lib/query-keys";

const fetchSkills = async (): Promise<Skill[]> => {
  const res = await fetch("/api/skills");
  if (!res.ok) throw new Error("Failed to fetch skills");
  return res.json();
};

const SkillModel = ({ skill, theme }: { skill: Skill; theme: string }) => {
  const glb = useGLTF(skill.model);

  const box = new THREE.Box3().setFromObject(glb.scene);
  const size = box.getSize(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z);
  const targetSize = 2.5;
  const scale = maxDimension > 0 ? targetSize / maxDimension : 1.2;

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

  const { data: skills = [] } = useQuery({
    queryKey: queryKeys.skills,
    queryFn: fetchSkills,
  });

  const [filter, setFilter] = useState<SkillCategoryFilter>("All");
  const [animatingKey, setAnimatingKey] = useState(0);
  const [explicitSelected, setExplicitSelected] = useState<Skill | null>(null);

  const filteredSkills = useMemo(
    () => (filter === "All" ? skills : skills.filter((s) => s.category === filter)),
    [filter, skills]
  );

  const selectedSkill: Skill | null = explicitSelected ?? filteredSkills[0] ?? null;

  const handleFilterChange = (newFilter: SkillCategoryFilter) => {
    setFilter(newFilter);
    setExplicitSelected(null);
    setAnimatingKey((prev) => prev + 1);
  };

  if (!selectedSkill) return null;

  return (
    <SectionContainer
      id="skills"
      className="max-w-6xl px-4 md:px-6 py-2 relative overflow-hidden space-y-8 !mx-auto"
    >
      <SectionHeading
        subtitle={
          <>
            Explore <span className="text-accent font-semibold">3D orbit</span> of skills
            and browse through categorized cards{" "}
          </>
        }
        withDivider
      >
        Experiments{" "}
      </SectionHeading>

      <div className="flex flex-col !justify-center md:grid md:grid-cols-2 gap-6 md:gap-8 items-center mx-auto">
        <div className="flex-1 h-[50vh] md:h-[calc(100dvh-12rem)] relative rounded-xl flex items-center justify-center">
          <div className="w-full h-[300px] lg:h-full transition-all duration-500 ease-in-out animate-fadeIn">
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

        <div className="flex-1 flex flex-col gap-4">
          <div className="flex gap-2 mb-2 flex-wrap justify-start">
            {SKILL_CATEGORIES.map((cat) => (
              <Button
                key={cat}
                onClick={() => handleFilterChange(cat)}
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

          <div
            key={animatingKey}
            className="grid grid-cols-2 xl:grid-cols-3 gap-4 pr-0 md:pr-2 items-start"
          >
            {filteredSkills.map((skill, index) => {
              const isActive = selectedSkill.name === skill.name;
              const colorClasses =
                skillCategoryColors[skill.category][theme as "light" | "dark"];

              return (
                <div
                  key={skill.name}
                  className="animate-fadeIn"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <SkillCard
                    skill={skill}
                    isActive={isActive}
                    colorClasses={colorClasses}
                    onClick={() => setExplicitSelected(skill)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
