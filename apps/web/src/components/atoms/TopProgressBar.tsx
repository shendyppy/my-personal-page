"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

/**
 * App Router-native top loading bar — NProgress in spirit, but built on
 * Framer Motion + pathname detection so we get brand-gradient styling
 * (accent → primary) and reduced-motion support out of the box.
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

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="top-progress-bar"
          className="fixed top-0 left-0 right-0 z-[9999] h-[3px] origin-left bg-gradient-to-r from-accent to-primary shadow-[0_0_10px_rgba(99,102,241,0.6)]"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: progress / 100,
            opacity: 1,
          }}
          exit={{ opacity: 0 }}
          transition={{
            scaleX: {
              duration: progress === 100 ? 0.18 : progress > 50 ? 0.6 : 0.25,
              ease: progress === 100 ? "easeOut" : "easeOut",
            },
            opacity: { duration: 0.25 },
          }}
        />
      ) : null}
    </AnimatePresence>
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
