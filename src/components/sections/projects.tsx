"use client";

import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    title: "Daya Dimensi Indonesia - HR Consultant",
    description:
      "Building assessment platform for HR consultants to evaluate candidates, also manage clients and reports.",
    image: "/assets/img/projects/learning-hub/cms-1.png",
    link: "https://sapasonny.com",
  },
  {
    title: "UOB Infinity - Banking Platform",
    description:
      "A banking platform for UOB customers to manage accounts, transfer funds, pay bills, and access financial services.",
    image: "/assets/img/projects/learning-hub/participant-2.png",
    link: "https://sayangikotamu.com",
  },
  {
    title: "Sapasonny - Personal Branding Website",
    description:
      "A personal branding website to showcase portfolio, services, contact information, and can be used as aspiration tracker.",
    image: "/assets/img/projects/learning-hub/cms-3.png",
    link: "#",
  },
];

export const Projects = () => {
  return (
    <section
      id="projects"
      className="relative max-w-6xl flex flex-col justify-center items-center xl:h-screen py-20 px-6 mx-auto"
    >
      {/* Floating Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute top-1/8 left-1/10 w-10 h-10 rounded-full bg-[#6366f1]/40 animate-firework" />
        <div className="absolute top-1/3 right-1/8 w-12 h-12 rounded-full bg-[#f472b6]/70 animate-firework delay-300" />
        <div className="absolute bottom-1/10 left-1/8 w-12 h-12 rounded-full bg-[#f97316]/70 animate-firework delay-500" />
      </div>

      <div className="flex flex-col items-center space-y-8 w-full relative z-20">
        {/* Title */}
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
          <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Projects{" "}
          </span>
        </h2>

        {/* Project Grid */}
        <div className="flex flex-col gap-8 w-3/5 relative z-10">
          {projects.map((project, idx) => (
            <Link
              href={project.link}
              key={idx}
              className="group bg-card rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-transform hover:scale-[1.02]"
            >
              <div className="relative w-full h-48">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {project.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
