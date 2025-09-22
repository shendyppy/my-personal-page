"use client";

import React, { Suspense, useState, useMemo } from "react";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useThemeContext } from "@/app/providers/ThemeProvider";

const skills = [
  {
    name: "TypeScript",
    level: 90,
    category: "Frontend",
    logo: "assets/img/typescript.png",
    model: "assets/models/typescript.glb",
    color: "#3178C6",
  },
  {
    name: "JavaScript",
    level: 95,
    category: "Frontend",
    logo: "assets/img/javascript.png",
    model: "assets/models/javascript.glb",
    color: "#F7DF1E",
  },
  {
    name: "Vue.js",
    level: 50,
    category: "Frontend",
    logo: "assets/img/vue.png",
    model: "assets/models/vue.glb",
    color: "#42B883",
  },
  {
    name: "React.js",
    level: 95,
    category: "Frontend",
    logo: "assets/img/react.png",
    model: "assets/models/react.glb",
    color: "#61DAFB",
  },
  {
    name: "AXIOS",
    level: 90,
    category: "Frontend",
    logo: "assets/img/axios.png",
    model: "assets/models/axios.glb",
    color: "#5A29E4",
  },
  {
    name: "Redux",
    level: 80,
    category: "Frontend",
    logo: "assets/img/redux.png",
    model: "assets/models/redux.glb",
    color: "#764ABC",
  },
  {
    name: "Jest",
    level: 70,
    category: "Frontend",
    logo: "assets/img/jest.png",
    model: "assets/models/jest.glb",
    color: "#C21325",
  },
  {
    name: "Python",
    level: 40,
    category: "Backend",
    logo: "assets/img/python.png",
    model: "assets/models/python.glb",
    color: "#3776AB",
  },
  {
    name: "Node.js",
    level: 60,
    category: "Backend",
    logo: "assets/img/nodejs.png",
    model: "assets/models/nodejs.glb",
    color: "#339933",
  },
  {
    name: "Sequelize",
    level: 50,
    category: "Backend",
    logo: "assets/img/sequelize.png",
    model: "assets/models/sequelize.glb",
    color: "#52B0E7",
  },
  {
    name: "Github Actions",
    level: 60,
    category: "DevOps",
    logo: "assets/img/github-actions.png",
    model: "assets/models/github-actions.glb",
    color: "#2088FF",
  },
  {
    name: "AWS",
    level: 50,
    category: "DevOps",
    logo: "assets/img/aws.png",
    model: "assets/models/aws.glb",
    color: "#FF9900",
  },
  {
    name: "cPanel",
    level: 50,
    category: "DevOps",
    logo: "assets/img/cPanel.png",
    model: "assets/models/cPanel.glb",
    color: "#FF6C2C",
  },
  {
    name: "Firebase",
    level: 75,
    category: "DevOps",
    logo: "assets/img/firebase.png",
    model: "assets/models/firebase.glb",
    color: "#FFCA28",
  },
  {
    name: "PostgreSQL",
    level: 60,
    category: "Database",
    logo: "assets/img/postgresql.png",
    model: "assets/models/postgresql.glb",
    color: "#336791",
  },
];

const categoryColors: Record<string, { light: string; dark: string }> = {
  Frontend: {
    light: "bg-blue-100 border-blue-400",
    dark: "bg-blue-900/40 border-blue-600",
  },
  Backend: {
    light: "bg-green-100 border-green-400",
    dark: "bg-green-900/40 border-green-600",
  },
  DevOps: {
    light: "bg-yellow-100 border-yellow-400",
    dark: "bg-yellow-900/40 border-yellow-600",
  },
  Database: {
    light: "bg-purple-100 border-purple-400",
    dark: "bg-purple-900/40 border-purple-600",
  },
  All: {
    light: "bg-gray-100 border-gray-400",
    dark: "bg-gray-800 border-gray-600",
  },
};

const getLevelLabel = (level: number) => {
  if (level >= 90) return "Expert";
  if (level >= 70) return "Advanced";
  if (level >= 50) return "Intermediate";
  return "Beginner";
};

const SkillModel = ({
  skill,
  theme,
}: {
  skill: (typeof skills)[0];
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
  const [selectedSkill, setSelectedSkill] = useState<(typeof skills)[0]>(
    skills[0]
  );
  const [filter, setFilter] = useState("All");

  const filteredSkills = useMemo(
    () =>
      filter === "All" ? skills : skills.filter((s) => s.category === filter),
    [filter]
  );

  return (
    <section
      id="skills"
      className="max-w-6xl xl:h-screen px-4 md:px-6 relative overflow-hidden space-y-8 !mx-auto"
    >
      {/* Header */}
      <div className="relative text-center">
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
          <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Skills & Technologies{" "}
          </span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
          Explore my <span className="text-accent font-semibold">3D orbit</span>{" "}
          of skills and browse through categorized cards{" "}
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
                categoryColors[skill.category][theme as "light" | "dark"];

              return (
                <Card
                  key={skill.name}
                  onClick={() => setSelectedSkill(skill)}
                  className={`
                    ${colorClasses}
                    cursor-pointer transition-all duration-300
                    ${
                      isActive
                        ? "ring-2 ring-offset-2 ring-secondary scale-[1.05] shadow-xl"
                        : "hover:scale-[1.02] hover:shadow-lg"
                    }
                  `}
                >
                  <CardContent className="flex items-start gap-2 p-3 md:p-4 !py-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={skill.logo}
                      alt={skill.name}
                      className="w-8 h-8 md:w-10 md:h-10 object-contain"
                    />
                    <div>
                      <h4
                        className={`font-semibold text-sm xl:text-base ${
                          isActive ? "text-accent" : "text-foreground"
                        }`}
                      >
                        {skill.name}
                      </h4>
                      <p
                        className={`text-xs lg:text-sm ${
                          isActive ? "text-accent/80" : "text-muted-foreground"
                        }`}
                      >
                        {getLevelLabel(skill.level)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
