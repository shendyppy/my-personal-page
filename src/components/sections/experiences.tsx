"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useThemeContext } from "@/app/providers/ThemeProvider";

const experiences = [
  {
    id: 1,
    title: "Front End Developer",
    company: "PT. Daya Dimensi Indonesia (DDI)",
    logo: "/assets/img/content/ddi-logo.webp",
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
      "React.js, Redux, Axios, Ant Design, Firebase, Vite.js, JavaScript, TypeScript",
  },
  {
    id: 2,
    title: "Front End Developer",
    company: "PT. Mahardika Solusi Teknologi (IDE Asia)",
    logo: "/assets/img/content/ide-logo.webp",
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
      "Banking Platform – BI-FAST & VN eTax features (Released, internal use)",
    ],
    techStack:
      "React.js, JavaScript, Redux, Axios, Material UI, Jenkins, Sonar, Jest",
  },
];

export const Experiences = () => {
  const { theme } = useThemeContext();

  const [expandedExperiences, setExpandedExperiences] = useState<number[]>([]);

  const toggleExperience = (id: number) => {
    setExpandedExperiences((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  return (
    <section
      id="experiences"
      className="relative max-w-6xl flex flex-col justify-center items-center py-16 px-6 mx-auto"
    >
      <div className="flex flex-col items-center space-y-8 w-full relative z-20">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Experiences
            </span>
          </h2>
        </div>

        <div className="space-y-4 px-1 w-4/5">
          {experiences.map((exp) => {
            const isExpanded = expandedExperiences.includes(exp.id);
            return (
              <div
                key={exp.id}
                className="border border-border/50 rounded-lg overflow-hidden shadow-sm transition hover:shadow-md"
              >
                <button
                  onClick={() => toggleExperience(exp.id)}
                  className={`w-full p-4 text-left transition-all duration-300 hover:bg-accent/10 flex items-center justify-between ${
                    exp.current ? "bg-primary/10" : "bg-background"
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Image
                      src={exp.logo}
                      width={48}
                      height={48}
                      alt={`${exp.company} logo`}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-contain bg-white p-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-semibold text-base md:text-lg text-foreground truncate">
                          {exp.title}
                        </h5>
                        {exp.current && (
                          <span
                            className={`text-xs ${
                              theme === "light"
                                ? "bg-green-500/20 text-green-700"
                                : "bg-green-400 text-green-700"
                            } px-2 py-1 rounded-full whitespace-nowrap`}
                          >
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm md:text-base text-muted-foreground truncate">
                        {exp.company}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {exp.period}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`size-5 md:size-6 transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isExpanded
                      ? "max-h-[2000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-4 border-t border-border/50 bg-background/40">
                    <p className="text-sm md:text-base text-muted-foreground mb-4 leading-relaxed">
                      {exp.description}
                    </p>

                    <div className="space-y-4">
                      <div>
                        <h6 className="font-medium text-sm md:text-base text-foreground mb-2">
                          Key Responsibilities:
                        </h6>
                        <ul className="space-y-2 text-sm md:text-base text-muted-foreground">
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
                          <h6 className="font-medium text-sm md:text-base text-foreground mb-2">
                            Key Projects:
                          </h6>
                          <ul className="space-y-2 text-sm md:text-base text-muted-foreground">
                            {exp.projects.map((project, idx) => (
                              <li key={idx} className="flex items-start gap-2">
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
                        <h6 className="font-medium text-sm md:text-base text-foreground mb-2">
                          Tech Stack:
                        </h6>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                          {exp.techStack}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
