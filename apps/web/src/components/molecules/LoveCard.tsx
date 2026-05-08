import Image from "next/image";
import { ArrowBigRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { GradientText } from "@/components/atoms/GradientText";
import type { Love } from "@/types";

type LoveCardProps = {
  loves: Love[];
};

/**
 * "What I Love" card. Each row reveals a domino-animated cluster of clubs
 * on hover (desktop). On mobile the clubs are always visible alongside.
 */
export const LoveCard = ({ loves }: LoveCardProps) => (
  <Card className="col-span-1 lg:col-span-2 p-4 md:p-6 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl">
    <h4 className="text-right font-heading text-base md:text-lg lg:text-xl font-bold text-foreground mb-3 md:mb-4">
      <GradientText>What I Love</GradientText>
    </h4>

    <div className="flex flex-col gap-10">
      {loves.map((love, idx) => (
        <div
          key={idx}
          className="group relative flex justify-center items-center"
        >
          {/* Main category */}
          <div
            className="group relative bg-background/50 backdrop-blur-sm
              rounded-full p-2
              transition-all duration-500 ease-out
              md:group-hover:-translate-x-20 md:group-hover:scale-110 md:group-hover:shadow-lg border border-border/50"
          >
            <Image
              src={love.main.src}
              width={1000}
              height={1000}
              alt={love.main.name}
              className="size-8 sm:size-10 lg:size-12 transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {love.main.name}
            </div>
          </div>

          {/* Arrow + Clubs */}
          <div
            className="flex items-center gap-3 md:absolute left-1/2 -translate-x-[20%] animate-moveRight
                       md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-200"
          >
            <ArrowBigRight className="text-muted-foreground ml-3 md:ml-0 animate-moveRight" />

            <div className="flex flex-row items-center gap-3 md:gap-4">
              {love.clubs.map((club, i) => (
                <div
                  key={i}
                  style={{ transitionDelay: `${i * 120 + 200}ms` }}
                  className="md:opacity-0 md:translate-x-3
                    md:group-hover:opacity-100 md:group-hover:translate-x-0
                    transition-all duration-500 ease-out
                    relative bg-background/50 backdrop-blur-sm
                    rounded-full p-2
                    border border-border/50
                    hover:scale-110 hover:shadow-lg"
                >
                  <Image
                    src={club.src}
                    width={1000}
                    height={1000}
                    alt={club.name}
                    className="size-6 sm:size-8 md:size-10 transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {club.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </Card>
);
