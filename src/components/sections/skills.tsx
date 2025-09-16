"use client";

import React, { Suspense, useState, useMemo } from "react";
import { ArrowBigLeft } from "lucide-react";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Float, useTexture, useGLTF, OrbitControls } from "@react-three/drei";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

const categoryColors: Record<string, string> = {
  Frontend: "bg-blue-100 border-blue-400",
  Backend: "bg-green-100 border-green-400",
  DevOps: "bg-yellow-100 border-yellow-400",
  Database: "bg-purple-100 border-purple-400",
  All: "bg-gray-100 border-gray-400",
};

const getLevelLabel = (level: number) => {
  if (level >= 90) return "Expert";
  if (level >= 70) return "Advanced";
  if (level >= 50) return "Intermediate";
  return "Beginner";
};

const SkillCube = ({
  position,
  skill,
  isActive,
  onClick,
}: {
  position: [number, number, number];
  skill: (typeof skills)[0];
  isActive: boolean;
  onClick: () => void;
}) => {
  const texture = useTexture(skill.logo);

  return (
    <Float
      speed={isActive ? 2 : 0.8}
      rotationIntensity={isActive ? 2 : 0.6}
      floatIntensity={isActive ? 2 : 0.6}
    >
      <mesh onClick={onClick} position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial map={texture} transparent />
      </mesh>
    </Float>
  );
};

const SkillModel = ({ skill }: { skill: (typeof skills)[0] }) => {
  const glb = useGLTF(skill.model);
  const scale = 1.2;

  glb.scene.traverse((child: THREE.Object3D) => {
    if ((child as THREE.Mesh).isMesh) {
      (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
        color: skill.color,
        metalness: 0.2,
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
  const [selectedSkill, setSelectedSkill] = useState<(typeof skills)[0] | null>(
    null
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
      className="max-w-6xl xl:h-screen px-6 relative overflow-hidden space-y-8"
    >
      {/* Header */}
      <div className="relative text-center">
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
          <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Skills & Technologies{" "}
          </span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Explore my <span className="text-accent font-semibold">3D orbit</span>{" "}
          of skills and browse through categorized cards{" "}
        </p>
        <div className="mt-3 w-24 h-1 bg-gradient-to-r from-accent to-primary mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-8 items-start">
        {/* Left Side */}
        <div className="flex-1 h-[calc(100dvh-12rem)] relative rounded-xl">
          {selectedSkill ? (
            <div className="w-full h-full flex items-center justify-center transition-all duration-500 ease-in-out animate-fadeIn">
              {/* Back Button */}
              <Button
                onClick={() => setSelectedSkill(null)}
                className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:scale-110 transition-transform duration-300"
              >
                <ArrowBigLeft className="w-5 h-5 text-foreground" />
              </Button>
              <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[5, 5, 5]} intensity={2} />
                <Suspense fallback={null}>
                  <OrbitControls enableZoom autoRotate autoRotateSpeed={1} />
                  <SkillModel skill={selectedSkill} />
                </Suspense>
              </Canvas>
            </div>
          ) : (
            <Canvas camera={{ position: [1, 1, 12], fov: 60 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} />
              <OrbitControls enableZoom autoRotate autoRotateSpeed={1} />
              <Suspense fallback={null}>
                {filteredSkills.map((skill, idx) => {
                  const angle = (idx / filteredSkills.length) * Math.PI * 2;
                  const radius = 4;
                  return (
                    <SkillCube
                      key={skill.name}
                      position={[
                        Math.cos(angle) * radius,
                        Math.sin(angle) * radius,
                        0,
                      ]}
                      skill={skill}
                      isActive={false}
                      onClick={() => setSelectedSkill(skill)}
                    />
                  );
                })}
              </Suspense>
            </Canvas>
          )}
        </div>

        {/* Right Side */}
        <div className="flex-1 flex flex-col justify-center gap-4">
          {/* Filter */}
          <div className="flex gap-2 mb-2 flex-wrap">
            {["All", "Frontend", "Backend", "DevOps", "Database"].map((cat) => (
              <Button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === cat
                    ? `bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:shadow-md scale-105`
                    : "bg-gray-500 hover:bg-gray-700"
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pr-2">
            {filteredSkills.map((skill) => {
              const isActive = selectedSkill?.name === skill.name;

              return (
                <Card
                  key={skill.name}
                  onClick={() => setSelectedSkill(skill)}
                  className={`
          ${categoryColors[skill.category]}
          cursor-pointer transition-all duration-300
          ${
            isActive
              ? "ring-2 ring-offset-2 ring-secondary scale-[1.05] shadow-xl"
              : "hover:scale-[1.02] hover:shadow-lg"
          }
        `}
                >
                  <CardContent className="flex items-start gap-4 p-4 !py-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={skill.logo}
                      alt={skill.name}
                      className="w-10 h-10 object-contain"
                    />
                    <div>
                      <h4
                        className={`font-semibold ${
                          isActive ? "text-red-500" : ""
                        }`}
                      >
                        {skill.name}
                      </h4>
                      <p
                        className={`text-sm ${
                          isActive ? "text-red-300" : "text-gray-400"
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
