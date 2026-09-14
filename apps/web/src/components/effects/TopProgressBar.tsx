"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * App Router-native top loading bar — NProgress in spirit: pathname detection
 * plus a CSS-transitioned scaleX, with brand-gradient styling (accent →
 * primary). Reduced motion drops the transition.
 *
 * Why pathname detection (and not Next.js `useLinkStatus`):
 * `useLinkStatus` is a per-Link hook — it must be a child of <Link> and
 * only knows about that one navigation. For a global top bar we'd have
 * to migrate every <Link> in the codebase. Intercepting clicks on
 * <a href="/internal"> + watching pathname/searchParams is functionally
 * equivalent and stays decoupled from the Link API.
 */

const Bar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousLocation = useRef<string>("");
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const completionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const climbTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Click interception → start the bar for internal navigations.
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // Skip modified clicks (cmd/ctrl/shift) — they open new tabs.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;

      const link = (event.target as HTMLElement | null)?.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;
      if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (link.target === "_blank") return;
      if (link.hasAttribute("download")) return;

      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (
          url.pathname === window.location.pathname &&
          url.search === window.location.search
        ) {
          return;
        }
      } catch {
        return;
      }

      // Start: jump to 15%, then climb to 80% over ~600ms.
      setVisible(true);
      setProgress(15);
      if (climbTimer.current) clearTimeout(climbTimer.current);
      climbTimer.current = setTimeout(() => setProgress(80), 80);
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  // Pathname (or query) actually changed → finish the bar.
  useEffect(() => {
    const next = `${pathname}?${searchParams?.toString() ?? ""}`;
    if (previousLocation.current === "") {
      previousLocation.current = next;
      return;
    }
    if (next === previousLocation.current) return;
    previousLocation.current = next;

    setProgress(100);
    if (completionTimer.current) clearTimeout(completionTimer.current);
    completionTimer.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => setProgress(0), 300);
    }, 220);
  }, [pathname, searchParams]);

  const climb = progress === 100 ? 180 : progress > 50 ? 600 : 250;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 right-0 z-[9999] h-[3px] origin-left bg-gradient-to-r from-accent to-primary shadow-[0_0_10px_rgba(99,102,241,0.6)] motion-reduce:transition-none"
      style={{
        transform: `scaleX(${progress / 100})`,
        opacity: visible ? 1 : 0,
        transition: `transform ${climb}ms ease-out, opacity 250ms ease-out`,
      }}
    />
  );
};

/**
 * Public component. Wrapped in Suspense because `useSearchParams` requires
 * one in App Router (otherwise the entire page bails out of static
 * generation).
 */
export const TopProgressBar = () => (
  <Suspense fallback={null}>
    <Bar />
  </Suspense>
);
