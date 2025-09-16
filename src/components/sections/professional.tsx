"use client";

import React, { useState } from "react";
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContactInfo } from "@/components/organism/ContactInfo";
import { LocationMap } from "../organism/LocationMap";

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description:
      "Full-stack e-commerce solution with 3D product visualization and real-time inventory management",
    tech: ["React", "Node.js", "Three.js", "PostgreSQL", "Stripe"],
    color: "#EAE4DD",
    image: "assets/img/aws.png",
    github: "https://github.com/shendyppy/ecommerce-platform",
    demo: "https://ecommerce-demo.vercel.app",
  },
  {
    id: 2,
    title: "3D Portfolio Website",
    description:
      "Interactive portfolio showcasing 3D graphics, animations, and modern web technologies",
    tech: ["Next.js", "Three.js", "TypeScript", "Tailwind", "Framer Motion"],
    color: "#1C6EA4",
    image: "assets/img/axios.png",
    github: "https://github.com/shendyppy/3d-portfolio",
    demo: "https://portfolio-3d.vercel.app",
  },
  {
    id: 3,
    title: "Data Visualization Dashboard",
    description:
      "Real-time analytics dashboard with interactive 3D charts and AI-powered insights",
    tech: ["React", "D3.js", "Python", "FastAPI", "WebSocket"],
    color: "#FFE100",
    image: "assets/img/jest.png",
    github: "https://github.com/shendyppy/data-dashboard",
    demo: "https://data-viz.vercel.app",
  },
  {
    id: 4,
    title: "AI Chat Application",
    description:
      "Modern chat app with AI integration, real-time messaging, and voice recognition",
    tech: ["Next.js", "OpenAI", "Socket.io", "MongoDB", "Tailwind"],
    color: "#FF6B6B",
    image: "assets/img/python.png",
    github: "https://github.com/shendyppy/ai-chat",
    demo: "https://ai-chat-app.vercel.app",
  },
];

export const Professional = () => {
  const [activeProject, setActiveProject] = useState<number>(0);

  const nextProject = () => {
    setActiveProject((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setActiveProject((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <section
      id="professional"
      className="max-w-6xl flex flex-col justify-center items-center bg-gradient-to-br from-background via-background to-accent/5 xl:h-screen py-16 px-6 mx-auto"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Professional Journey
            </span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            Explore my projects and let&apos;s create something amazing
            together! ✨
          </p>
          <div className="mt-4 w-32 h-1 bg-gradient-to-r from-blue-600 to-pink-600 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Projects */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="font-subheading text-2xl md:text-3xl text-foreground mb-4 flex items-center justify-center lg:justify-start gap-2">
                🚀 <span>My Projects</span>
              </h3>
            </div>

            {/* Project Carousel */}
            <div className="relative">
              <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-subheading text-xl text-card-foreground">
                      {projects[activeProject].title}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={prevProject}
                        className="hover:bg-accent/20 transition-colors bg-transparent"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={nextProject}
                        className="hover:bg-accent/20 transition-colors bg-transparent"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Project Image */}
                  <div className="relative overflow-hidden rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={projects[activeProject].image || "/placeholder.svg"}
                      alt={projects[activeProject].title}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {projects[activeProject].description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {projects[activeProject].tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium border border-blue-200/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      asChild
                    >
                      <a
                        href={projects[activeProject].github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4 mr-2" />
                        Code
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gradient hover:bg-accent/20 bg-transparent"
                      asChild
                    >
                      <a
                        href={projects[activeProject].demo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Project Selector */}
              <div className="flex justify-center gap-2 mt-4">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveProject(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      activeProject === index
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 scale-125"
                        : "bg-muted hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Contact */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="font-subheading text-2xl md:text-3xl text-foreground mb-4 flex items-center justify-center lg:justify-start gap-2">
                💬 <span>Let&apos;s Connect</span>
              </h3>
            </div>

            {/* Contact Info */}
            <ContactInfo />
            <LocationMap />
          </div>
        </div>
      </div>
    </section>
  );
};
