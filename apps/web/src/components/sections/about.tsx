"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

import {
  ArrowBigRight,
  Github,
  Instagram,
  Linkedin,
  type LucideIcon,
  Mail,
  Twitter,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { scrollToSection } from "@/lib/utils";
import { useThemeContext } from "@/app/providers/ThemeProvider";
import { SECTION_IDS, SITE_CONFIG } from "@/constants/config";
import { SocialButton } from "@/components/molecules/SocialButton";
import { TechStackItem } from "@/components/molecules/TechStackItem";
import { LoveCard } from "@/components/molecules/LoveCard";
import { CvDownloadCard } from "@/components/molecules/CvDownloadCard";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { GradientText } from "@/components/atoms/GradientText";
import { queryKeys } from "@/lib/query-keys";
import type { AboutBundle } from "@/server/queries/about";

const iconMap: Record<string, LucideIcon> = {
  Github,
  Linkedin,
  Instagram,
  Twitter,
  Mail,
};

const fetchAbout = async (): Promise<AboutBundle> => {
  const res = await fetch("/api/about");
  if (!res.ok) throw new Error("Failed to fetch about data");
  return res.json();
};

export const About = () => {
  const { theme } = useThemeContext();

  const { data } = useQuery({ queryKey: queryKeys.about, queryFn: fetchAbout });

  const view = useMemo(() => {
    if (!data) return null;

    const bioSection = data.aboutSections.find((s) => s.key === "professional_bio");
    const learningSection = data.aboutSections.find(
      (s) => s.key === "current_learning"
    );

    return {
      professionalBio: {
        title: bioSection?.title ?? "Professional Dreamer",
        content: bioSection?.content ?? "",
      },
      currentLearningJourney: learningSection?.content ?? "",
      cvInfo: data.cvInfo,
      techStacks: data.techStacks.map((t) => ({ name: t.name, src: t.src })),
      socialLinks: data.socialLinks.map((link) => ({
        href: link.url,
        icon: (iconMap[link.iconName] ?? Mail) as React.ComponentType<{ className?: string }>,
        label: link.label,
      })),
      loves: data.loves.map((love) => ({
        main: { name: love.mainName, src: love.mainSrc },
        clubs: love.clubs,
      })),
    };
  }, [data]);

  if (!view) return null;

  const { professionalBio, currentLearningJourney, cvInfo, techStacks, socialLinks, loves } = view;

  return (
    <SectionContainer
      id="about"
      className="w-full flex flex-col justify-center items-center py-16 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-14 mx-auto rounded-[40px] md:rounded-[80px] shadow-2xl bg-accent"
    >
      <div className="max-w-6xl w-full flex flex-col gap-8 md:gap-12">
        {/* Top row: text, photo, socials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6 items-start">
          {/* Text block */}
          <Card className="lg:col-span-3 p-4 md:p-6 rounded-xl transition-all duration-500 hover:-rotate-2 hover:scale-105 hover:shadow-xl">
            <h2 className="font-heading text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-3 md:mb-4">
              <GradientText>{professionalBio.title}</GradientText>
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              {professionalBio.content}
            </p>
          </Card>

          {/* Photo */}
          <div className="lg:col-span-3">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3 lg:col-span-2 transition-all duration-500 hover:rotate-2 hover:scale-105 hover:shadow-xl">
                  <Image
                    src={SITE_CONFIG.profileImage}
                    width={1000}
                    height={1000}
                    alt="Photos of Me"
                    className="w-full h-auto rounded-xl object-cover"
                    priority
                  />
                </div>

                {/* Social buttons */}
                <div className="col-span-3 lg:col-span-1 grid grid-cols-5 md:grid-cols-3 lg:grid-cols-2 gap-2 md:gap-3 justify-items-center">
                  {socialLinks.map((item, i) => (
                    <SocialButton
                      key={i}
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-row">
                <h4
                  className={`transition-colors ${
                    theme === "dark" ? "text-yellow-500" : "text-yellow-200"
                  } text-center text-sm md:text-base font-semibold mb-6 leading-relaxed italic`}
                >
                  &quot;{currentLearningJourney}&quot;
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6 items-start">
          <CvDownloadCard cvInfo={cvInfo} />

          {/* Tech Stacks Card */}
          <Card className="col-span-1 lg:col-span-2 p-4 md:p-6 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl">
            <h4 className="text-center font-heading text-base md:text-lg lg:text-xl font-bold text-foreground mb-3 md:mb-4">
              <GradientText>Tech Stacks</GradientText>
            </h4>
            <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3">
              {techStacks.map((tech, index) => (
                <TechStackItem key={index} tech={tech} />
              ))}
            </div>
            <div className="flex justify-end items-end relative">
              <Button
                className="mt-4 md:mt-6 cursor-pointer animate-moveRight"
                variant="link"
                onClick={() => scrollToSection(SECTION_IDS.skills)}
              >
                Explore more <ArrowBigRight />
              </Button>
            </div>
          </Card>

          <LoveCard loves={loves} />
        </div>
      </div>
    </SectionContainer>
  );
};
