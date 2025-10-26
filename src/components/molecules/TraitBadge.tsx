import { Button } from "@/components/ui/button";
import { Trait } from "@/types";

interface TraitBadgeProps {
  trait: Trait;
  colorClasses: string;
  onClick?: () => void;
}

export const TraitBadge = ({ trait, colorClasses, onClick }: TraitBadgeProps) => {
  const Icon = trait.icon;

  return (
    <Button
      className={`flex items-center gap-1
        !py-[2px] !px-1 text-xs
        sm:px-3 sm:py-1.5 sm:text-sm
        md:px-4 md:py-2 md:text-base
        rounded-full font-medium animate-fadeIn select-none ${colorClasses}`}
      onClick={onClick}
    >
      <Icon className="size-4 sm:size-5" />
      {trait.label}
    </Button>
  );
};
