"use client";

import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    title: "Sapasonny",
    description:
      "A marketplace and community platform for wellness and lifestyle products.",
    image: "/projects/sapasonny.png",
    link: "https://sapasonny.com",
  },
  {
    title: "SayangiKotamu",
    description:
      "Civic engagement app where users can report and track issues in their city.",
    image: "/projects/sayangikotamu.png",
    link: "https://sayangikotamu.com",
  },
  {
    title: "Your NBA App",
    description:
      "A React.js app visualizing NBA teams, stadiums, and fan stats with maps and charts.",
    image: "/projects/nba.png",
    link: "#",
  },
];

export const Professional = () => {
  return (
    <section
      id="professional"
      className="relative max-w-6xl flex flex-col justify-center items-center xl:h-screen py-20 px-6 mx-auto"
    >
      {/* Floating Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute top-1/4 left-1/3 w-10 h-10 rounded-full bg-[#6366f1]/40 animate-firework" />
        <div className="absolute top-2/3 left-2/3 w-12 h-12 rounded-full bg-[#f472b6]/70 animate-firework delay-300" />
        <div className="absolute top-1/2 left-1/5 w-8 h-8 rounded-full bg-[#f97316]/70 animate-firework delay-500" />
      </div>

      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-subheading text-foreground mb-12 relative z-10">
        Featured Projects ✨
      </h2>

      {/* Project Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full relative z-10">
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
    </section>
  );
};
