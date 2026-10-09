"use client";

import { useEffect, useState } from "react";

export type Tier = "low" | "mid" | "high";

export type DeviceProfile = {
  tier: Tier;
  isTouch: boolean;
  reducedMotion: boolean;
  webgl: boolean;
};

function detectWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function getDeviceProfile(): DeviceProfile {
  if (typeof window === "undefined") return { tier: "high", isTouch: false, reducedMotion: false, webgl: true };

  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const w = window.innerWidth;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;

  let tier: Tier = "high";
  if (w < 768 || cores <= 4 || memory <= 3) tier = "low";
  else if (w < 1200 || isTouch) tier = "mid";

  return { tier, isTouch, reducedMotion, webgl: detectWebGL() };
}

/** Adaptive quality profile – mobile keeps the story, but drops the expensive bits. */
export function useDeviceTier() {
  const [profile, setProfile] = useState<DeviceProfile | null>(null);
  useEffect(() => {
    setProfile(getDeviceProfile());
  }, []);
  return profile;
}

export const QUALITY: Record<Tier, { dpr: [number, number]; particles: number; shadows: boolean; post: boolean; symbols: number }> = {
  low: { dpr: [1, 1.25], particles: 140, shadows: false, post: false, symbols: 8 },
  mid: { dpr: [1, 1.5], particles: 280, shadows: true, post: false, symbols: 12 },
  // dpr capped at 1.5: above that the post stack costs far more than it shows.
  high: { dpr: [1, 1.5], particles: 520, shadows: true, post: true, symbols: 18 },
};
