"use client";

import { Theme } from "@/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

import {
  ACCENTS,
  DEFAULT_ACCENT,
  type AccentId,
} from "@/constants/config";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  accent: AccentId;
  setAccent: (accent: AccentId) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const findAccent = (id: AccentId) =>
  ACCENTS.find((a) => a.id === id) ?? ACCENTS[0];

// Theme-aware: vivid on dark, deeper on light so pale accents (lime/teal)
// stay readable on the warm-paper background.
const accentValue = (id: AccentId, theme: Theme) =>
  theme === "dark" ? findAccent(id).dark : findAccent(id).light;

/* ---- theme store ---- */
function getThemeSnapshot(): Theme {
  return (localStorage.getItem("theme") as Theme) ?? "dark";
}
function getThemeServerSnapshot(): Theme {
  return "dark";
}
function subscribeTheme(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener("theme-change", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("theme-change", handler);
  };
}

/* ---- accent store ---- */
function isAccentId(v: string | null): v is AccentId {
  return !!v && ACCENTS.some((a) => a.id === v);
}
function getAccentSnapshot(): AccentId {
  const stored = localStorage.getItem("accent");
  return isAccentId(stored) ? stored : DEFAULT_ACCENT;
}
function getAccentServerSnapshot(): AccentId {
  return DEFAULT_ACCENT;
}
function subscribeAccent(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener("accent-change", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("accent-change", handler);
  };
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot
  );
  const accent = useSyncExternalStore(
    subscribeAccent,
    getAccentSnapshot,
    getAccentServerSnapshot
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Apply the brand accent as a CSS variable so it flows through every
  // `text-accent` / `bg-accent` / `var(--accent)` usage on both themes.
  // Re-runs on theme change too, since light/dark carry different values.
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--accent",
      accentValue(accent, theme)
    );
  }, [accent, theme]);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    // Carry the resolved accent colour for the new theme so listeners that
    // can't read a transitioning `--accent` (e.g. the WebGL particle ball)
    // still get the destination value, not the pre-transition one.
    window.dispatchEvent(
      new CustomEvent("theme-change", {
        detail: { color: accentValue(accent, next) },
      })
    );
  }, [theme, accent]);

  const setAccent = useCallback(
    (next: AccentId) => {
      const color = accentValue(next, theme);
      localStorage.setItem("accent", next);
      document.documentElement.style.setProperty("--accent", color);
      // Dispatch the DESTINATION colour, not the live `--accent`: the root
      // has a 450ms `--accent` transition, so getComputedStyle would return a
      // mid-transition value and listeners would chase a stale target.
      window.dispatchEvent(
        new CustomEvent("accent-change", { detail: { color } })
      );
    },
    [theme]
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error("useThemeContext must be used within ThemeProvider");
  return ctx;
};
