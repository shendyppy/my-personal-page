"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./DiveScene.impl").then((m) => m.DiveSceneImpl), {
  ssr: false,
});

/**
 * Fixed full-viewport ocean behind the chapters. Never in the first-paint
 * bundle, and not even requested until the page has loaded and gone idle:
 * evaluating three.js during hydration held the hero's LCP paint back ~3.6 s
 * on a throttled phone. The CSS water colour stands in until it arrives.
 */
export const DiveScene = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idle = 0;
    const start = () => {
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(() => setReady(true), { timeout: 2000 })
        : window.setTimeout(() => setReady(true), 200);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, []);

  return ready ? <Scene /> : null;
};
