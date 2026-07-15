"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";

import { TerminalLogo } from "@/components/atoms/TerminalLogo";
import { AccentPicker } from "@/components/atoms/AccentPicker";
import { useThemeContext } from "@/app/providers/ThemeProvider";
import { EXTERNAL_LINKS } from "@/constants/config";

// Editorial nav labels → in-page section ids.
const NAV_ITEMS = [
  { id: "projects", label: "WORK" },
  { id: "about", label: "ABOUT" },
  { id: "experiences", label: "CAREER" },
  { id: "skills", label: "TOOLBOX" },
] as const;

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  // Auto-hide on scroll-down, reveal on scroll-up; `scrolled` adds a readable
  // backdrop once we leave the very top.
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const { theme, toggleTheme } = useThemeContext();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const scrollPosition = currentY + 100;

      const sections = ["hero", "projects", "about", "experiences", "skills"];
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

      setScrolled(currentY > 8);
      if (currentY > lastScrollY.current && currentY > 96) {
        setHidden(true);
      } else if (currentY < lastScrollY.current) {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -72;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-transform duration-300 will-change-transform ${
        hidden && !isOpen ? "-translate-y-full" : "translate-y-0"
      } ${
        isOpen
          ? "h-screen bg-background/95 backdrop-blur-md"
          : scrolled
            ? "border-b border-border/60 bg-background/70 backdrop-blur-md"
            : ""
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex h-[68px] items-center justify-between">
          <TerminalLogo href="/" />

          {/* Desktop */}
          <div className="hidden items-center gap-7 font-mono text-xs tracking-[0.08em] md:flex">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`cursor-pointer transition-colors hover:text-accent ${
                  activeSection === item.id ? "text-accent" : "text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}

            <AccentPicker className="ml-1" />

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="relative flex size-8 cursor-pointer items-center justify-center text-foreground transition-colors hover:text-accent"
            >
              <Moon
                className={`absolute size-5 transition-all duration-500 ${
                  theme === "light"
                    ? "scale-50 -rotate-90 opacity-0"
                    : "scale-100 rotate-0 opacity-100"
                }`}
              />
              <Sun
                className={`absolute size-5 transition-all duration-500 ${
                  theme === "dark"
                    ? "scale-50 rotate-90 opacity-0"
                    : "scale-100 rotate-0 opacity-100"
                }`}
              />
            </button>

            <a
              href={`mailto:${EXTERNAL_LINKS.email}`}
              className="rounded-full bg-foreground px-4 py-2 font-mono text-xs font-bold tracking-[0.08em] text-background transition-all duration-200 hover:scale-105 hover:bg-accent hover:text-accent-foreground"
            >
              LET&apos;S TALK
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle menu"
            className="relative z-[60] flex size-9 items-center justify-center text-foreground md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="flex flex-col items-start gap-6 border-t border-border/60 px-2 py-8 font-mono">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-2xl tracking-[0.06em] transition-colors hover:text-accent ${
                  activeSection === item.id ? "text-accent" : "text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="mt-4 flex w-full items-center justify-between">
              <AccentPicker />
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="relative flex size-9 items-center justify-center text-foreground"
              >
                <Moon
                  className={`absolute size-6 transition-all duration-500 ${
                    theme === "light"
                      ? "scale-50 -rotate-90 opacity-0"
                      : "scale-100 rotate-0 opacity-100"
                  }`}
                />
                <Sun
                  className={`absolute size-6 transition-all duration-500 ${
                    theme === "dark"
                      ? "scale-50 rotate-90 opacity-0"
                      : "scale-100 rotate-0 opacity-100"
                  }`}
                />
              </button>
            </div>

            <a
              href={`mailto:${EXTERNAL_LINKS.email}`}
              className="mt-2 rounded-full bg-foreground px-5 py-3 text-sm font-bold tracking-[0.08em] text-background"
            >
              LET&apos;S TALK
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
