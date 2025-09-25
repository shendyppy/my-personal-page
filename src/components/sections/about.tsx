"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Mail,
  Linkedin,
  Github,
  Instagram,
  Twitter,
  ArrowBigRight,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { scrollToSection } from "@/lib/utils";
import { useThemeContext } from "@/app/providers/ThemeProvider";

export const About = () => {
  const { theme } = useThemeContext();

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
    { name: "React", src: "/assets/img/content/react.png" },
    { name: "TypeScript", src: "/assets/img/content/typescript.png" },
    { name: "JavaScript", src: "/assets/img/content/javascript.png" },
    { name: "Redux", src: "/assets/img/content/redux.png" },
    { name: "Axios", src: "/assets/img/content/axios.png" },
    { name: "Jest", src: "/assets/img/content/jest.png" },
    { name: "NodeJS", src: "/assets/img/content/nodejs.png" },
    { name: "Firebase", src: "/assets/img/content/firebase.png" },
    { name: "Vue", src: "/assets/img/content/vue.png" },
  ];

  const loves = [
    {
      main: { name: "DOTA 2", src: "/assets/img/content/dota-2.png" },
      clubs: [
        { name: "Rekonix", src: "/assets/img/content/rekonix.png" },
        {
          name: "Tundra Esports",
          src: "/assets/img/content/tundra-esports.png",
        },
      ],
    },
    {
      main: { name: "Football", src: "/assets/img/content/football.png" },
      clubs: [
        { name: "Real Madrid", src: "/assets/img/content/real-madrid.png" },
      ],
    },
    {
      main: { name: "Basketball", src: "/assets/img/content/basketball.png" },
      clubs: [
        { name: "Los Angeles Lakers", src: "/assets/img/content/lakers.png" },
        {
          name: "Golden State Warriors",
          src: "/assets/img/content/warriors.png",
        },
      ],
    },
  ];

  return (
    <section
      id="about"
      className="w-full flex flex-col justify-center items-center py-16 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-14 mx-auto rounded-[40px] md:rounded-[80px] shadow-2xl bg-accent"
    >
      <div className="max-w-6xl w-full flex flex-col gap-8 md:gap-12">
        {/* Top row: text, photo, socials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6 items-start">
          {/* Text block */}
          <Card className="lg:col-span-3 p-4 md:p-6 rounded-xl transition-all duration-500 hover:-rotate-2 hover:scale-105 hover:shadow-xl">
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
                <div className="col-span-3 lg:col-span-2 transition-all duration-500 hover:rotate-2 hover:scale-105 hover:shadow-xl">
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
          <Card className="col-span-1 lg:col-span-2 p-4 md:p-6 flex flex-col justify-center gap-4 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl">
            <h4 className="text-left font-heading text-base md:text-lg lg:text-xl font-bold text-foreground mb-2 md:mb-4">
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
              className="px-6 md:px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-primary/90 active:scale-95 mx-auto"
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
            <h4 className="text-center font-heading text-base md:text-lg lg:text-xl font-bold text-foreground mb-3 md:mb-4">
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Tech Stacks
              </span>
            </h4>
            <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3">
              {techStacks.map((tech, index) => (
                <div
                  key={index}
                  className="group relative bg-background/50 backdrop-blur-sm rounded-lg p-2 md:p-3 transition-all duration-300 hover:scale-110 hover:shadow-lg border border-border/50"
                >
                  <Image
                    src={tech.src}
                    width={1000}
                    height={1000}
                    alt={tech.name}
                    className="size-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {tech.name}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end items-end relative">
              <Button
                className="mt-4 md:mt-6 cursor-pointer animate-moveRight"
                variant="link"
                onClick={() => scrollToSection("skills")}
              >
                Explore more <ArrowBigRight />
              </Button>
            </div>
          </Card>

          {/* What I Love Card */}
          <Card className="col-span-1 lg:col-span-2 p-4 md:p-6 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl">
            <h4 className="text-right font-heading text-base md:text-lg lg:text-xl font-bold text-foreground mb-3 md:mb-4">
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                What I Love
              </span>
            </h4>

            <div className="flex flex-col gap-6">
              {loves.map((love, idx) => (
                <div
                  key={idx}
                  className="flex flex-row items-center gap-3 md:gap-4 flex-wrap justify-center"
                >
                  {/* Main category (DOTA2, Football, Basketball) */}
                  <div className="group relative bg-background/50 backdrop-blur-sm rounded-lg p-2 md:p-3 transition-all duration-300 hover:scale-110 hover:shadow-lg border border-border/50">
                    <Image
                      src={love.main.src}
                      width={1000}
                      height={1000}
                      alt={love.main.name}
                      className="size-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {love.main.name}
                    </div>
                  </div>

                  {/* Arrow icon */}
                  <ArrowBigRight className="text-muted-foreground animate-moveRight" />

                  {/* Clubs under that category */}
                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    {love.clubs.map((club, i) => (
                      <div
                        key={i}
                        className="group relative bg-background/50 backdrop-blur-sm rounded-lg p-2 md:p-3 transition-all duration-300 hover:scale-110 hover:shadow-lg border border-border/50"
                      >
                        <Image
                          src={club.src}
                          width={1000}
                          height={1000}
                          alt={club.name}
                          className="size-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                          {club.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
