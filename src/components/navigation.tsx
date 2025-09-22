"use client";

import { useState, useEffect } from "react";
import {
  Box,
  BriefcaseBusiness,
  FlaskConical,
  HatGlasses,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useThemeContext } from "@/app/providers/ThemeProvider";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { theme, toggleTheme } = useThemeContext();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "skills", "professional"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);

    if (element) {
      const yOffset = sectionId === "hero" ? -1000 : -64;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }

    setIsOpen(false);
  };

  const navItems = [
    { id: "hero", label: <Box className="!size-8 p-1 inline my-1" /> },
    { id: "about", label: <HatGlasses className="!size-8 p-1 inline my-1" /> },
    {
      id: "skills",
      label: <FlaskConical className="!size-8 p-1 inline my-1" />,
    },
    {
      id: "professional",
      label: <BriefcaseBusiness className="!size-8 p-1 inline my-1" />,
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-background/80 ${
        isOpen ? "backdrop-blur-md h-screen" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="font-logo text-2xl text-primary">Portfolio</div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`!size-10 text-sm font-medium cursor-pointer 
      transition-all duration-300 ease-in-out
      hover:scale-105 active:scale-95 hover:text-white
      ${activeSection === item.id ? "text-accent" : "text-muted-foreground"}`}
                variant="ghost"
              >
                {item.label}
              </Button>
            ))}

            <div className="w-[2px] h-10 bg-border" />

            {/* Theme toggle */}
            <Button
              onClick={toggleTheme}
              className="!size-10 cursor-pointer hover:text-white relative flex items-center justify-center"
              variant="ghost"
            >
              {/* Moon */}
              <Moon
                className={`absolute !size-6 transition-all duration-500 ease-in-out
        ${
          theme === "light"
            ? "opacity-0 -rotate-90 scale-50"
            : "opacity-100 rotate-0 scale-100"
        }`}
              />

              {/* Sun */}
              <Sun
                className={`absolute !size-6 transition-all duration-500 ease-in-out
        ${
          theme === "dark"
            ? "opacity-0 rotate-90 scale-50"
            : "opacity-100 rotate-0 scale-100"
        }`}
              />
            </Button>
          </div>

          {/* Mobile Navigation Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden relative z-[60]"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div
              className={`transform transition-transform duration-300 ${
                isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
              } absolute`}
            >
              <Menu className="!size-8 p-1 inline my-1" />
            </div>
            <div
              className={`transform transition-transform duration-300 ${
                isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
              }`}
            >
              <X className="!size-8 p-1 inline my-1" />
            </div>
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col justify-center items-center space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left px-4 py-2 text-sm font-medium transition-colors hover:text-white ${
                    activeSection === item.id
                      ? "text-accent"
                      : "text-muted-foreground"
                  }`}
                  variant="ghost"
                >
                  {item.label}
                </Button>
              ))}

              <div className="w-full h-[2px] rounded-xl bg-border" />

              {/* Theme toggle (mobile) */}
              <Button
                onClick={toggleTheme}
                className="!size-10 cursor-pointer hover:text-white relative"
                variant="ghost"
              >
                {/* Moon */}
                <Moon
                  className={`absolute !size-6 transition-all duration-500 ease-in-out
        ${
          theme === "light"
            ? "opacity-0 -rotate-90 scale-50"
            : "opacity-100 rotate-0 scale-100"
        }`}
                />

                {/* Sun */}
                <Sun
                  className={`absolute !size-6 transition-all duration-500 ease-in-out
        ${
          theme === "dark"
            ? "opacity-0 rotate-90 scale-50"
            : "opacity-100 rotate-0 scale-100"
        }`}
                />
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
