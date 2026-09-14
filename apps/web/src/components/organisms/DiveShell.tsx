"use client";

import { useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { CHAPTER_IDS, sectionId, type ChapterId } from "@/constants/dive";
import { dive } from "@/lib/dive/depth";
import { measureLanes } from "@/lib/dive/lanes";
import { scroller } from "@/lib/dive/scroll";

gsap.registerPlugin(ScrollTrigger);

type DiveShellProps = { beats: number[]; children: ReactNode };

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Scroll engine for the journey: Lenis smooth scroll wired into GSAP's ticker,
 * one scrubbed ScrollTrigger over <main> that feeds the depth store, hash →
 * chapter scrolling, and `data-chapter` on <html> for the CSS water fallback.
 */
export const DiveShell = ({ beats, children }: DiveShellProps) => {
  // Keyed on the joined values, not the array identity: a new `beats` array
  // literal on every render (the caller maps CHAPTERS inline) must not
  // re-run configure() — configure() notifies subscribers, so that would
  // fire on every render instead of only when the beats actually change.
  const beatsKey = beats.join(",");

  useEffect(() => {
    dive.configure(beats);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beatsKey]);

  useEffect(() => {
    const root = document.documentElement;
    const unsub = dive.subscribe((s) => {
      if (root.dataset.chapter !== s.chapter) root.dataset.chapter = s.chapter;
    });
    root.dataset.chapter = dive.get().chapter;
    return () => {
      unsub();
      delete root.dataset.chapter;
    };
  }, []);

  useEffect(() => {
    const main = document.getElementById("main-content");
    if (!main) return;

    let lenis: Lenis | null = null;
    let raf: ((t: number) => void) | null = null;

    if (!reduced()) {
      // `anchors`: in-page `#dive-*` links (the seafloor's BACK TO SURFACE)
      // scroll smoothly instead of jumping under Lenis.
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      raf = (t) => lenis?.raf(t * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    const trigger = ScrollTrigger.create({
      trigger: main,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => dive.set(self.progress),
    });

    // Lanes are layout: re-measure whenever ScrollTrigger re-measures (load,
    // resize) and once the webfonts have settled the text blocks.
    measureLanes();
    ScrollTrigger.addEventListener("refresh", measureLanes);
    document.fonts?.ready.then(measureLanes);

    scroller.install((id: ChapterId) => {
      const target = `#${sectionId(id)}`;
      if (lenis) lenis.scrollTo(target, { duration: 1.2 });
      else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    });

    const hash = window.location.hash.replace("#dive-", "") as ChapterId;
    if (CHAPTER_IDS.includes(hash)) {
      requestAnimationFrame(() => {
        if (lenis) lenis.scrollTo(`#${sectionId(hash)}`, { immediate: true });
        else document.getElementById(sectionId(hash))?.scrollIntoView();
      });
    }

    return () => {
      trigger.kill();
      ScrollTrigger.removeEventListener("refresh", measureLanes);
      scroller.install(() => {});
      if (raf) gsap.ticker.remove(raf);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
};
