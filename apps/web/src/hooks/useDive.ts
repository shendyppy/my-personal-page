"use client";
import { useSyncExternalStore } from "react";
import { dive, type DiveState } from "@/lib/dive/depth";

export const useDiveSnapshot = (): DiveState =>
  useSyncExternalStore(dive.subscribe, dive.get, dive.get);
