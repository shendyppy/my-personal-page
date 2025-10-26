import Image from "next/image";

import { TechStack } from "@/types";

interface TechStackItemProps {
  tech: TechStack;
}

export const TechStackItem = ({ tech }: TechStackItemProps) => {
  return (
    <div className="group relative bg-background/50 backdrop-blur-sm rounded-lg p-2 md:p-3 transition-all duration-300 hover:scale-110 hover:shadow-lg border border-border/50">
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
  );
};
