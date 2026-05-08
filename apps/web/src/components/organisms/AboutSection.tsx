"use client";

import {
  Github,
  Instagram,
  Linkedin,
  type LucideIcon,
  Mail,
  Twitter,
} from "lucide-react";

import { SITE_CONFIG } from "@/constants/config";
import { SocialButton } from "@/components/molecules/SocialButton";
import { TechStackCard } from "@/components/molecules/TechStackCard";
import { LoveCard } from "@/components/molecules/LoveCard";
import { CvDownloadCard } from "@/components/molecules/CvDownloadCard";
import { BioCard } from "@/components/molecules/BioCard";
import { ProfilePhoto } from "@/components/molecules/ProfilePhoto";
import { LearningQuote } from "@/components/molecules/LearningQuote";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import type { AboutBundle } from "@/server/queries/about";

const iconMap: Record<string, LucideIcon> = {
  Github,
  Linkedin,
  Instagram,
  Twitter,
  Mail,
};

type AboutSectionProps = {
  initialData: AboutBundle;
};

export const AboutSection = ({ initialData }: AboutSectionProps) => {
  const data = initialData;

  const bioSection = data.aboutSections.find((s) => s.key === "professional_bio");
  const learningSection = data.aboutSections.find((s) => s.key === "current_learning");

  const professionalBio = {
    title: bioSection?.title ?? "Professional Dreamer",
    content: bioSection?.content ?? "",
  };
  const currentLearningJourney = learningSection?.content ?? "";
  const cvInfo = data.cvInfo;
  const techStacks = data.techStacks.map((t) => ({ name: t.name, src: t.src }));
  const socialLinks = data.socialLinks.map((link) => ({
    href: link.url,
    icon: (iconMap[link.iconName] ?? Mail) as React.ComponentType<{ className?: string }>,
    label: link.label,
  }));
  const loves = data.loves.map((love) => ({
    main: { name: love.mainName, src: love.mainSrc },
    clubs: love.clubs,
  }));

  return (
    <SectionContainer
      id="about"
      className="w-full flex flex-col justify-center items-center py-16 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-14 mx-auto rounded-[40px] md:rounded-[80px] shadow-2xl bg-accent"
    >
      <div className="max-w-6xl w-full flex flex-col gap-8 md:gap-12">
        {/* Top row: bio, photo + socials, quote */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6 items-start">
          <BioCard title={professionalBio.title} content={professionalBio.content} />

          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4">
              <ProfilePhoto src={SITE_CONFIG.profileImage} />

              <div className="col-span-3 lg:col-span-1 grid grid-cols-5 md:grid-cols-3 lg:grid-cols-2 gap-2 md:gap-3 justify-items-center">
                {socialLinks.map((item, i) => (
                  <SocialButton
                    key={i}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    index={i}
                  />
                ))}
              </div>
            </div>

            <LearningQuote text={currentLearningJourney} />
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6 items-start">
          <CvDownloadCard cvInfo={cvInfo} />
          <TechStackCard techStacks={techStacks} />
          <LoveCard loves={loves} />
        </div>
      </div>
    </SectionContainer>
  );
};
