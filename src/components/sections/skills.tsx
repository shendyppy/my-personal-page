"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, useTexture } from "@react-three/drei";
import { Suspense, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";

const skills = [
  {
    name: "TypeScript",
    level: 90,
    category: "Frontend",
    logo: "assets/img/typescript.png",
  },
  {
    name: "JavaScript",
    level: 95,
    category: "Frontend",
    logo: "assets/img/javascript.png",
  },
  {
    name: "Vue.js",
    level: 50,
    category: "Frontend",
    logo: "assets/img/vue.png",
  },
  {
    name: "React.js",
    level: 95,
    category: "Frontend",
    logo: "assets/img/react.png",
  },
  {
    name: "AXIOS",
    level: 90,
    category: "Frontend",
    logo: "assets/img/axios.png",
  },
  {
    name: "Redux",
    level: 80,
    category: "Frontend",
    logo: "assets/img/redux.png",
  },
  {
    name: "Jest",
    level: 70,
    category: "Frontend",
    logo: "assets/img/jest.png",
  },
  {
    name: "Python",
    level: 40,
    category: "Backend",
    logo: "assets/img/python.png",
  },
  {
    name: "Node.js",
    level: 60,
    category: "Backend",
    logo: "assets/img/nodejs.png",
  },
  {
    name: "Sequelize",
    level: 50,
    category: "Backend",
    logo: "assets/img/sequelize.png",
  },
  {
    name: "Github Actions",
    level: 60,
    category: "DevOps",
    logo: "assets/img/github-actions.png",
  },
  { name: "AWS", level: 50, category: "DevOps", logo: "assets/img/aws.png" },
  {
    name: "cPanel",
    level: 50,
    category: "DevOps",
    logo: "assets/img/cPanel.png",
  },
  {
    name: "Firebase",
    level: 75,
    category: "DevOps",
    logo: "assets/img/firebase.png",
  },
  {
    name: "PostgreSQL",
    level: 60,
    category: "Database",
    logo: "assets/img/postgresql.png",
  },
];

// 🟦 Cube with glowing effect & PNG logo
const SkillCube = ({
  position,
  skill,
  isActive,
  setActiveSkill,
}: {
  position: [number, number, number];
  skill: (typeof skills)[0];
  isActive: boolean;
  setActiveSkill: (name: string) => void;
}) => {
  const texture = useTexture(skill.logo);

  return (
    <Float
      speed={isActive ? 2 : 1}
      rotationIntensity={isActive ? 2 : 0.6}
      floatIntensity={1.2}
    >
      <mesh
        position={position}
        scale={isActive ? 1.5 : 1}
        onPointerEnter={() => setActiveSkill(skill.name)}
        onPointerLeave={() => setActiveSkill("")}
        onClick={() => setActiveSkill(skill.name)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          map={texture}
          transparent
          roughness={0.25}
          metalness={0.4}
          emissive={isActive ? "#00ffaa" : "#222222"}
          emissiveIntensity={isActive ? 0.8 : 0.2}
        />
      </mesh>
    </Float>
  );
};

// 🌐 3D Scene → now uses filteredSkills
const Skills3D = ({
  activeSkill,
  setActiveSkill,
  filteredSkills = skills,
}: {
  activeSkill: string;
  setActiveSkill: (name: string) => void;
  filteredSkills: typeof skills;
}) => {
  return (
    <>
      {/* Stronger lights for glow */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, -5, 5]} intensity={0.6} />

      {filteredSkills.map((skill, index) => {
        const angle = (index / filteredSkills.length) * Math.PI * 2;
        const radius = 3.5;

        const position: [number, number, number] = [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.5,
          Math.sin(angle) * radius * 0.4,
        ];

        return (
          <SkillCube
            key={skill.name}
            position={position}
            skill={skill}
            isActive={activeSkill === skill.name}
            setActiveSkill={setActiveSkill}
          />
        );
      })}

      <OrbitControls autoRotate autoRotateSpeed={0.6} enableZoom={false} />
    </>
  );
};

// 🎨 Category Colors
const categoryColors: Record<string, string> = {
  Frontend: "bg-blue-100 border-blue-400",
  Backend: "bg-green-100 border-green-400",
  DevOps: "bg-yellow-100 border-yellow-400",
  Database: "bg-purple-100 border-purple-400",
  All: "bg-gray-100 border-gray-400",
};

// 🧩 Main Skills Section
export const Skills = () => {
  const [activeSkill, setActiveSkill] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredSkills = useMemo(() => {
    return activeCategory === "All"
      ? skills
      : skills.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  const getLevelLabel = (level: number) => {
    if (level >= 75) return "Proficient";
    if (level >= 50) return "Intermediate";
    return "Needs Improvement";
  };

  return (
    <section
      id="skills"
      className="py-24 xl:py-55 px-6 relative overflow-hidden"
    >
      {/* Header */}
      <div className="relative text-center mb-16">
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
          <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Skills & Technologies
          </span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Explore my <span className="text-accent font-semibold">3D orbit</span>{" "}
          of skills and browse through categorized cards
        </p>
        <div className="mt-3 w-24 h-1 bg-gradient-to-r from-accent to-primary mx-auto rounded-full" />
      </div>

      {/* Flex Layout */}
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Left: 3D Orbit */}
        <div className="h-[28rem] w-full lg:w-1/2">
          <Canvas camera={{ position: [0, 0, 8], fov: 70 }}>
            <Suspense fallback={null}>
              <Skills3D
                activeSkill={activeSkill}
                setActiveSkill={setActiveSkill}
                filteredSkills={filteredSkills}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Right: Filters + Cards */}
        <div className="flex flex-col gap-6 w-full lg:w-1/2">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            {["All", "Frontend", "Backend", "DevOps", "Database"].map((cat) => (
              <div
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border cursor-pointer transition 
              ${
                activeCategory === cat
                  ? "bg-accent text-white border-accent hover:bg-border/50 hover:text-accent"
                  : "bg-border hover:bg-accent/50"
              }`}
              >
                {cat}
              </div>
            ))}
          </div>

          {/* Skill Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSkills.map((skill, i) => (
              <Card
                key={skill.name}
                className={`cursor-pointer border ${
                  categoryColors[skill.category]
                } transform transition-all duration-500 ease-in-out
              hover:scale-105 hover:shadow-lg animate-fade-in-up`}
                style={{ animationDelay: `${i * 100}ms` }}
                onMouseEnter={() => setActiveSkill(skill.name)}
                onMouseLeave={() => setActiveSkill("")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={skill.logo}
                      alt={skill.name}
                      className="w-7 h-7"
                    />
                    <h3 className="font-subheading text-lg truncate">
                      {skill.name}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getLevelLabel(skill.level)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
