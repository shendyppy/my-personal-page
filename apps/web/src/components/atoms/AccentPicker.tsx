"use client";

import { ACCENTS } from "@/constants/config";
import { useThemeContext } from "@/app/providers/ThemeProvider";

interface AccentPickerProps {
  className?: string;
}

/**
 * Four brand-accent swatches. Clicking one writes the `--accent` CSS variable
 * live (persisted in localStorage via ThemeProvider) so every accent usage on
 * the page recolors instantly.
 */
export const AccentPicker = ({ className = "" }: AccentPickerProps) => {
  const { accent, theme, setAccent } = useThemeContext();

  return (
    <div className={`flex items-center gap-2 ${className}`} role="group" aria-label="Accent color">
      {ACCENTS.map((a) => {
        const active = accent === a.id;
        // Show the actual applied colour (theme-aware) so the swatch matches
        // what's on screen, not the vivid dark-only id.
        const swatch = theme === "dark" ? a.dark : a.light;
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => setAccent(a.id)}
            aria-label={`${a.label} accent`}
            aria-pressed={active}
            className={`size-3.5 cursor-pointer rounded-full transition-transform duration-200 hover:scale-125 ${
              active
                ? "ring-2 ring-offset-2 ring-offset-background scale-110"
                : "opacity-70 hover:opacity-100"
            }`}
            style={{
              backgroundColor: swatch,
              ...(active ? { boxShadow: `0 0 0 2px ${swatch}` } : {}),
            }}
          />
        );
      })}
    </div>
  );
};
