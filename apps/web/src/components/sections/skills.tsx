"use client";

import React, { Suspense, useState, useMemo, useEffect, useRef } from "react";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useThemeContext } from "@/app/providers/ThemeProvider";
import { skillCategoryColors } from "@/constants/colors";
import { Skill } from "@/types";
import { SkillCard } from "@/components/molecules/SkillCard";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const SkillModel = ({
  skill,
  theme,
}: {
  skill: Skill;
  theme: string;
}) => {
  const glb = useGLTF(skill.model);

  // Calculate bounding box to normalize model size
  const box = new THREE.Box3().setFromObject(glb.scene);
  const size = box.getSize(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z);
  const targetSize = 2.5; // Target size for all models
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
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(sectionRef, {
    threshold: 0.1,
    rootMargin: "100px",
  });

  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [hasStartedFetching, setHasStartedFetching] = useState(false);
  const [animatingKey, setAnimatingKey] = useState(0);

  useEffect(() => {
    // Only fetch when section becomes visible and hasn't fetched yet
    if (!isVisible || hasStartedFetching) return;

    setHasStartedFetching(true);

    async function fetchSkills() {
      try {
        const response = await fetch("/api/skills");
        const data = await response.json();

        setSkills(data);

        // Set first skill as selected initially
        if (data.length > 0) {
          setSelectedSkill(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, [isVisible, hasStartedFetching]);

  const filteredSkills = useMemo(
    () =>
      filter === "All" ? skills : skills.filter((s) => s.category === filter),
    [filter, skills]
  );

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setAnimatingKey((prev) => prev + 1);

    // Auto-select first skill of the new category
    const newFilteredSkills =
      newFilter === "All"
        ? skills
        : skills.filter((s) => s.category === newFilter);

    if (newFilteredSkills.length > 0) {
      setSelectedSkill(newFilteredSkills[0]);
    }
  };

  if (loading || !selectedSkill) {
    return (
      <section
        ref={sectionRef}
        id="skills"
        className={`max-w-6xl px-4 md:px-6 py-2 relative overflow-hidden space-y-8 !mx-auto transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Header skeleton */}
        <div className="relative text-center">
          <Skeleton className="h-12 w-48 mx-auto mb-4" />
          <Skeleton className="h-6 w-64 mx-auto mb-3" />
          <Skeleton className="h-1 w-24 mx-auto rounded-full" />
        </div>

        <div className="flex flex-col !justify-center md:grid md:grid-cols-2 gap-6 md:gap-8 items-center mx-auto">
          {/* Left Side - 3D Viewer skeleton */}
          <div className="flex-1 h-[50vh] md:h-[calc(100dvh-12rem)] relative rounded-xl">
            <Skeleton className="w-full h-full" />
          </div>

          {/* Right Side - Filter + Cards skeleton */}
          <div className="flex-1 flex flex-col justify-center gap-4">
            {/* Filter skeletons */}
            <div className="flex gap-2 mb-2 flex-wrap justify-start">
              {["All", "Frontend", "Backend", "DevOps", "Database", "Project Management"].map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>

            {/* Cards skeletons */}
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 pr-0 md:pr-2 items-start">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="skills"
      className={`max-w-6xl px-4 md:px-6 py-2 relative overflow-hidden space-y-8 !mx-auto transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
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
        {/* Left Side - 3D Viewer - Always centered */}
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

        {/* Right Side - Filter + Cards - Aligned to start */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Filter */}
          <div className="flex gap-2 mb-2 flex-wrap justify-start">
            {["All", "Frontend", "Backend", "DevOps", "Database", "Project Management"].map((cat) => (
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

          {/* Cards */}
          <div
            key={animatingKey}
            className="grid grid-cols-2 xl:grid-cols-3 gap-4 pr-0 md:pr-2 items-start"
          >
            {filteredSkills.map((skill, index) => {
              const isActive = selectedSkill?.name === skill.name;
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
                    onClick={() => setSelectedSkill(skill)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
