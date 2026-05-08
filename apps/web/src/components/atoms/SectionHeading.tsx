import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { GradientText } from "./GradientText";

type SectionHeadingProps = {
  children: ReactNode;
  className?: string;
  /** Sub-heading rendered below the title. */
  subtitle?: ReactNode;
  /** Render the small accent divider after subtitle (used by Skills). */
  withDivider?: boolean;
};

/**
 * Composed heading for top-of-section titles. Used by every page section.
 * Wraps GradientText so the title and subtitle stay visually consistent.
 */
export const SectionHeading = ({
  children,
  className,
  subtitle,
  withDivider = false,
}: SectionHeadingProps) => (
  <div className={cn("relative text-center", className)}>
    <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
      <GradientText>{children}</GradientText>
    </h2>
    {subtitle ? (
      <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
        {subtitle}
      </p>
    ) : null}
    {withDivider ? (
      <div className="mt-3 w-24 h-1 bg-gradient-to-r from-accent to-primary mx-auto rounded-full" />
    ) : null}
  </div>
);
