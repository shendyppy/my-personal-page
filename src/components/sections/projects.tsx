"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box, Text } from "@react-three/drei";
import { Suspense, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with 3D product visualization",
    tech: ["React", "Node.js", "Three.js", "PostgreSQL"],
    color: "#EAE4DD",
  },
  {
    id: 2,
    title: "3D Portfolio Website",
    description: "Interactive portfolio showcasing 3D graphics and animations",
    tech: ["Next.js", "Three.js", "TypeScript", "Tailwind"],
    color: "#1C6EA4",
  },
  {
    id: 3,
    title: "Data Visualization Dashboard",
    description: "Real-time analytics dashboard with interactive 3D charts",
    tech: ["React", "D3.js", "Python", "FastAPI"],
    color: "#FFE100",
  },
];

const ProjectCube = ({
  project,
  position,
  isActive,
}: {
  project: (typeof projects)[0];
  position: [number, number, number];
  isActive: boolean;
}) => {
  return (
    <Box position={position} args={[1, 1, 1]} scale={isActive ? 4 : 3}>
      <meshStandardMaterial color={project.color} transparent opacity={1} />
      <Text
        position={[0, 0, 0.6]}
        fontSize={0.1}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
      >
        {project.title}
      </Text>
    </Box>
  );
};

const Projects3D = ({ activeProject }: { activeProject: number | null }) => {
  return (
    <>
      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} />

      {projects.map((project, index) => (
        <ProjectCube
          key={project.id}
          project={project}
          position={[(index - 1) * 5, 0, 0]}
          isActive={activeProject === project.id}
        />
      ))}

      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
};

export const Projects = () => {
  const [activeProject, setActiveProject] = useState<number | null>(null);

  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
            Featured Projects
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore my work through interactive 3D representations
          </p>
        </div>

        <div className="mb-12 h-64">
          <Canvas camera={{ position: [0, 0, 6], fov: 75 }}>
            <Suspense fallback={null}>
              <Projects3D activeProject={activeProject} />
            </Suspense>
          </Canvas>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                activeProject === project.id ? "ring-2 ring-accent" : ""
              }`}
              onMouseEnter={() => setActiveProject(project.id)}
              onMouseLeave={() => setActiveProject(null)}
            >
              <CardHeader>
                <CardTitle className="font-subheading text-xl text-card-foreground">
                  {project.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-accent/10 text-accent rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Github className="h-4 w-4 mr-2" />
                    Code
                  </Button>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
