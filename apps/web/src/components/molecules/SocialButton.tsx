import Link from "next/link";

import { Button } from "@/components/ui/button";

interface SocialButtonProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const SocialButton = ({ href, label, icon: IconComponent }: SocialButtonProps) => {
  return (
    <Button
      variant="outline"
      asChild
      aria-label={`Link to my ${label}`}
      className="size-14 md:size-16 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg flex items-center justify-center"
    >
      <Link href={href} target="_blank">
        <IconComponent className="size-6" />
      </Link>
    </Button>
  );
};
