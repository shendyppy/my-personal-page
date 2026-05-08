import { createElement, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type GradientTextProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/**
 * Brand-gradient text using accent → primary tokens. The default element is
 * <span> so this can be embedded inside any heading. Pass `as="h2"` etc. to
 * render a heading directly.
 */
export const GradientText = <T extends ElementType = "span">({
  as,
  className,
  children,
  ...rest
}: GradientTextProps<T>) => {
  const Component: ElementType = as ?? "span";
  return createElement(
    Component,
    {
      className: cn(
        "bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent",
        className
      ),
      ...rest,
    },
    children
  );
};
