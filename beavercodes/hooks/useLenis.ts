"use client";

import { createContext, useContext } from "react";
import type Lenis from "lenis";

export const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

/** Scroll to a section id, or "home" (the revealed landing page). */
export function scrollToTarget(lenis: Lenis | null, target: string, landingY: number) {
  if (target === "home") {
    if (lenis) lenis.scrollTo(landingY, { duration: 2.2 });
    else window.scrollTo({ top: landingY, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(target);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.6, offset: -10 });
  else el.scrollIntoView({ behavior: "smooth" });
}
