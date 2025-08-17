"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Float } from "@react-three/drei";
import { Suspense, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const skills = [
  { name: "TypeScript", level: 90, category: "Frontend" },
  { name: "React", level: 95, category: "Frontend" },
  { name: "Three.js", level: 80, category: "Frontend" },
  { name: "Node.js", level: 85, category: "Backend" },
  { name: "Python", level: 75, category: "Backend" },
  { name: "PostgreSQL", level: 80, category: "Database" },
];

const SkillSphere = ({
  position,
  skill,
  isActive,
}: {
  position: [number, number, number];
  skill: (typeof skills)[0];
  isActive: boolean;
}) => {
  return (
    <Float speed={0.1} rotationIntensity={0.1} floatIntensity={1}>
      <mesh position={position} scale={isActive ? 3 : 2}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={isActive ? "#A5B68D" : "#A1D6B2"}
          transparent
          opacity={0.8}
        />
        <Text
          position={[0, 0, 0.35]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {skill.name}
        </Text>
      </mesh>
    </Float>
  );
};

const Skills3D = ({ activeSkill }: { activeSkill: string }) => {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} />

      {skills.map((skill, index) => {
        const angle = (index / skills.length) * Math.PI * 2;
        const radius = 2;
        const position: [number, number, number] = [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.5,
          Math.sin(angle) * radius * 0.3,
        ];

        return (
          <SkillSphere
            key={skill.name}
            position={position}
            skill={skill}
            isActive={activeSkill === skill.name}
          />
        );
      })}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1}
      />
    </>
  );
};

export const Skills = () => {
  const [activeSkill, setActiveSkill] = useState("");

  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
            Skills & Technologies
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Interactive 3D visualization of my technical expertise
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-7 items-center">
          <div className="h-96">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
              <Suspense fallback={null}>
                <Skills3D activeSkill={activeSkill} />
              </Suspense>
            </Canvas>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            {skills.map((skill) => (
              <Card
                key={skill.name}
                className={`col-span-1 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  activeSkill === skill.name ? "ring-2 ring-accent" : ""
                }`}
                onMouseEnter={() => setActiveSkill(skill.name)}
                onMouseLeave={() => setActiveSkill("")}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-subheading text-lg text-card-foreground">
                      {skill.name}
                    </h3>
                    <span className="text-sm text-accent">
                      {skill.category}
                    </span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                  <div className="text-right text-sm text-muted-foreground mt-1">
                    {skill.level}%
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
