"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  Mail,
  Linkedin,
  Github,
  Instagram,
  Twitter,
  ChevronDown,
  ArrowBigRight,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { scrollToSection } from "@/lib/utils";
import { useThemeContext } from "@/app/providers/ThemeProvider";

export const About = () => {
  const { theme } = useThemeContext();
  const [expandedExperience, setExpandedExperience] = useState<number | null>(
    null
  );

  const items = [
    {
      href: "https://github.com/shendyppy",
      icon: <Github className="size-6" />,
      label: "GitHub",
    },
    {
      href: "https://www.linkedin.com/in/shendyppy/",
      icon: <Linkedin className="size-6" />,
      label: "LinkedIn",
    },
    {
      href: "https://www.instagram.com/shendyppy/",
      icon: <Instagram className="size-6" />,
      label: "Instagram",
    },
    {
      href: "https://www.twitter.com/shendyppy/",
      icon: <Twitter className="size-6" />,
      label: "Twitter",
    },
    {
      href: "mailto:shendyppy@gmail.com?subject=Hello Shendy&body=I%20saw%20your%20portfolio!",
      icon: <Mail className="size-6" />,
      label: "Email",
    },
  ];

  const techStacks = [
    { name: "React", src: "/assets/img/react.png" },
    { name: "TypeScript", src: "/assets/img/typescript.png" },
    { name: "JavaScript", src: "/assets/img/javascript.png" },
    { name: "Redux", src: "/assets/img/redux.png" },
    { name: "Axios", src: "/assets/img/axios.png" },
  ];

  const experiences = [
    {
      id: 1,
      title: "Front End Developer",
      company: "PT. Daya Dimensi Indonesia (DDI)",
      logo: "/assets/img/ddi-logo.webp",
      location: "Jakarta, Indonesia - Remote",
      period: "February 2022 - Present",
      current: true,
      description:
        "Human resources consultant specializing in learning management systems and assessment platforms.",
      responsibilities: [
        "Drove product iteration cycles by participating in planning and quality reviews, ensuring timely delivery of high-impact features.",
        "Enhanced learning management systems with focus on usability, scalability, and performance.",
        "Built and delivered 80+ features including face recognition, video conferencing, dynamic organizational charts, and real-time communication.",
        "Led end-to-end development of multiple applications across diverse business domains.",
      ],
      projects: [
        "EnGauge – Assessment Platform (Released, internal use)",
        "Learning Hub – Learning Platform (Released, internal use)",
        "TPOP (Talent Potential Predictors) – (Released, internal use)",
        "DASH SaaS – SaaS assessment platform with video conferencing (Released, internal use)",
        "WISH – Career discovery platform (Released, education.acelents.com)",
        "ACELENTS – SaaS platform for assessment and recruitment (In development)",
        "PortrAI – AI-driven assessment platform (In development)",
      ],
      techStack:
        "React.js, Redux, Axios, Ant Design, Firebase, Vite.js, TypeScript",
    },
    {
      id: 2,
      title: "Front End Developer",
      company: "PT. Mahardika Solusi Teknologi (IDE Asia)",
      logo: "/assets/img/ide-logo.webp",
      location: "Jakarta, Indonesia - Remote",
      period: "October 2021 - May 2022, September 2024 - August 2025",
      current: false,
      description:
        "Technology consultant working on banking integration features and cross-border payment solutions.",
      responsibilities: [
        "Contributed to BI-FAST, one of Indonesia's largest banking integration features for interbank transactions.",
        "Implemented Vietnam eTax Payment, a regional cross-border banking initiative.",
        "Delivered 20+ production-ready features enhancing customer experience in banking applications.",
        "Collaborated with Big 4 global consulting firm on retail/consumer banking platform.",
        "Built responsive, accessible, and user-friendly banking service interfaces.",
      ],
      projects: [
        "Banking Platform (BI-FAST & VN eTax features, Released, internal use)",
      ],
      techStack: "React.js, Redux, Axios, Material UI, Jenkins, Sonar",
    },
  ];

  const toggleExperience = (id: number | null) => {
    setExpandedExperience(expandedExperience === id ? null : id);
  };

  return (
    <section
      id="about"
      className="w-full flex flex-col justify-center items-center xl:h-screen py-16 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-14 mx-auto rounded-[40px] md:rounded-[80px] shadow-2xl bg-accent"
    >
      <div className="max-w-6xl w-full flex flex-col gap-8 md:gap-12">
        {/* Top row: text, photo, socials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6 items-start">
          {/* Text block */}
          <Card className="lg:col-span-3 p-4 md:p-6 rounded-xl transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl">
            <h2 className="font-heading text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-3 md:mb-4">
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Professional Dreamer
              </span>
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              I began my career as a civil engineer, but curiosity soon pulled
              me into tech{" "}
              <span className="italic underline">
                (during the pandemic I challenged myself to switch paths by
                joining a coding bootcamp)
              </span>
              . Growing up as a gamer — and still one today — I was always
              fascinated by how those worlds were built. Realizing that a few
              lines of code could bring something interactive to life was
              game-changing. Since then, I&apos;ve been all-in on front-end
              craft: experimenting with 3D on the web, and polishing interfaces
              that feel playful and intuitive.
            </p>
          </Card>

          {/* Photo */}
          <div className="lg:col-span-3">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3 lg:col-span-2 transition-all duration-500 hover:-rotate-2 hover:scale-105 hover:shadow-xl">
                  <Image
                    src="/assets/Shendy.webp"
                    width={1000}
                    height={1000}
                    alt="Photos of Me"
                    className="w-full h-auto rounded-xl object-cover"
                    priority
                  />
                </div>

                {/* Social buttons */}
                <div className="col-span-3 lg:col-span-1 grid grid-cols-5 md:grid-cols-3 lg:grid-cols-2 gap-2 md:gap-3 justify-items-center">
                  {items.map((item, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      asChild
                      aria-label={`Link to my ${item.label}`}
                      className="size-14 md:size-16 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg flex items-center justify-center"
                    >
                      <Link href={item.href} target="_blank">
                        {item.icon}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex flex-row">
                <h4
                  className={`transition-colors ${
                    theme === "dark" ? "text-yellow-500" : "text-yellow-200"
                  } text-center text-sm md:text-base font-semibold mb-6 leading-relaxed italic`}
                >
                  &quot;Recently, I’ve been revisiting the backend, DevOps, and
                  even dipping my toes into LLMs — learning my way through
                  Node.js, Nest.js, ORMs, Python, and the world of CI/CD and
                  deployment. I’m still early on this path, but my aim is clear:
                  to eventually feel just as comfortable building systems behind
                  the scenes as I do shaping the UI up front.&quot;
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* --- */}

        {/* Bottom row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6 items-start">
          {/* CV Card */}
          <Card className="col-span-1 lg:col-span-2 p-4 md:p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl">
            <h4 className="font-heading text-base md:text-lg lg:text-xl font-bold text-foreground mb-2 md:mb-4">
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Curriculum Vitae
              </span>
            </h4>
            <div className="w-full h-[150px] md:h-[200px] overflow-hidden rounded-lg shadow-md relative">
              <div className="absolute inset-0 transition-transform duration-[2500ms] ease-in-out hover:-translate-y-[65%]">
                <Image
                  src="/assets/Screenshot_CV.png"
                  alt="CV Preview"
                  width={300}
                  height={1000}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </div>
            <Button
              asChild
              className="px-6 md:px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-primary/90 active:scale-95"
            >
              <Link
                href="/assets/CV_Shendy Putra Perdana Yohansah_19 Sep 2025.pdf"
                target="_blank"
                download
                className="flex items-center gap-2"
              >
                Download
              </Link>
            </Button>
          </Card>

          {/* Tech Stacks Card */}
          <Card className="col-span-1 lg:col-span-2 p-4 md:p-6 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl">
            <h4 className="font-heading text-base md:text-lg lg:text-xl font-bold text-foreground mb-3 md:mb-4">
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Tech Stacks
              </span>
            </h4>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {techStacks.map((tech, index) => (
                <div
                  key={index}
                  className="group relative bg-background/50 backdrop-blur-sm rounded-lg p-2 md:p-3 transition-all duration-300 hover:scale-110 hover:shadow-lg border border-border/50"
                >
                  <Image
                    src={tech.src}
                    width={32}
                    height={32}
                    alt={tech.name}
                    className="md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {tech.name}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end relative">
              <Button
                className="mt-4 md:mt-6 cursor-pointer animate-moveRight"
                variant="link"
                onClick={() => scrollToSection("skills")}
              >
                Explore more <ArrowBigRight />
              </Button>
            </div>
          </Card>

          {/* Experiences Card */}
          <Card className="col-span-1 sm:col-span-2 lg:col-span-2 p-4 md:p-6 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl">
            <h4 className="font-heading text-base md:text-lg lg:text-xl font-bold text-foreground mb-3 md:mb-4">
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Experiences
              </span>
            </h4>
            <div className="space-y-3 md:space-y-4 max-h-[400px] overflow-y-auto px-1">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="border border-border/50 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleExperience(exp.id)}
                    className={`w-full p-3 md:p-4 text-left transition-all duration-300 hover:bg-accent/20 ${
                      exp.current ? "bg-primary/10" : "bg-background/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          <Image
                            src={exp.logo}
                            width={40}
                            height={40}
                            alt={`${exp.company} logo`}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-cover bg-white/10 p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-semibold text-sm md:text-base text-foreground truncate">
                              {exp.title}
                            </h5>
                            {exp.current && (
                              <span className="text-xs bg-green-500/20 text-green-700 px-2 py-1 rounded-full whitespace-nowrap">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-xs md:text-sm text-muted-foreground truncate">
                            {exp.company}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {exp.period}
                          </p>
                        </div>
                      </div>
                      <div className="ml-2">
                        <ChevronDown
                          className={`size-4 md:size-5 transition-transform duration-300 ${
                            expandedExperience === exp.id
                              ? "rotate-180"
                              : "rotate-0"
                          }`}
                        />
                      </div>
                    </div>
                  </button>
                  {expandedExperience === exp.id && (
                    <div className="p-3 md:p-4 border-t border-border/50 bg-background/30 animate-in slide-in-from-top-2 duration-300">
                      <p className="text-xs md:text-sm text-muted-foreground mb-3 leading-relaxed">
                        {exp.description}
                      </p>
                      <div className="space-y-2 md:space-y-3">
                        <div>
                          <h6 className="font-medium text-xs md:text-sm text-foreground mb-1 md:mb-2">
                            Key Responsibilities:
                          </h6>
                          <ul className="space-y-1 text-xs text-muted-foreground">
                            {exp.responsibilities.map((resp, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span className="leading-relaxed">{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {exp.projects && (
                          <div>
                            <h6 className="font-medium text-xs md:text-sm text-foreground mb-1 md:mb-2">
                              Key Projects:
                            </h6>
                            <ul className="space-y-1 text-xs text-muted-foreground">
                              {exp.projects.map((project, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2"
                                >
                                  <span className="text-accent mt-1">•</span>
                                  <span className="leading-relaxed">
                                    {project}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div>
                          <h6 className="font-medium text-xs md:text-sm text-foreground mb-1">
                            Tech Stack:
                          </h6>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {exp.techStack}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
