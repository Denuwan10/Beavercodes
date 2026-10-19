"use client";

import { useEffect, useState } from "react";

export type Tier = "low" | "mid" | "high";

export type DeviceProfile = {
  tier: Tier;
  isTouch: boolean;
  reducedMotion: boolean;
  webgl: boolean;
  /** Integrated / software GPU: render the 3D at 1× resolution. */
  weakGpu: boolean;
};

/** WebGL support, plus the GPU's name when the browser exposes it. */
function detectGPU(): { webgl: boolean; renderer: string } {
  try {
    const c = document.createElement("canvas");
    // Same GPU preference as the 3D canvas, so dual-GPU laptops report the fast card.
    const opts = { powerPreference: "high-performance" } as const;
    const gl = (c.getContext("webgl2", opts) || c.getContext("webgl", opts)) as WebGLRenderingContext | null;
    if (!gl) return { webgl: false, renderer: "" };
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext(); // free the test context
    return { webgl: true, renderer };
  } catch {
    return { webgl: false, renderer: "" };
  }
}

/**
 * Integrated / software GPUs (Intel UHD/Iris, phone GPUs, SwiftShader…) can't
 * run the full post-processing stack smoothly at desktop resolution. Intel Arc
 * is a discrete card and Apple GPUs cope, so neither matches.
 */
const WEAK_GPU = /intel(?!.*\barc\b)|swiftshader|llvmpipe|software|microsoft basic|mali|adreno|powervr/i;

export function getDeviceProfile(): DeviceProfile {
  if (typeof window === "undefined") return { tier: "high", isTouch: false, reducedMotion: false, webgl: true, weakGpu: false };

  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const w = window.innerWidth;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;

  const gpu = detectGPU();
  const weakGpu = WEAK_GPU.test(gpu.renderer);

  let tier: Tier = "high";
  if (w < 768 || cores <= 4 || memory <= 3) tier = "low";
  else if (w < 1200 || isTouch || weakGpu) tier = "mid";

  return { tier, isTouch, reducedMotion, webgl: gpu.webgl, weakGpu };
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
