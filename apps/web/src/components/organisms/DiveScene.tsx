"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./DiveScene.impl").then((m) => m.DiveSceneImpl), {
  ssr: false,
});

/** Fixed full-viewport ocean behind the chapters. Never in the first-paint bundle. */
export const DiveScene = () => <Scene />;
