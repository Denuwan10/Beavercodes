"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LenisContext } from "@/hooks/useLenis";
import { experience } from "@/utils/store";

gsap.registerPlugin(ScrollTrigger);
// Don't re-measure every time the mobile URL bar shows/hides.
if (typeof window !== "undefined") ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Lenis drives the scroll; GSAP's ticker drives Lenis so ScrollTrigger,
 * the 3D scene and every scrubbed animation share one clock.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // The story always starts at the beginning.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const instance = new Lenis({
      lerp: reduced ? 1 : 0.085,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
      smoothWheel: !reduced,
      anchors: true, // in-page #links glide instead of jumping
    });

    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Hold the home page until the preloader has finished. Other pages (the
    // project pages) have no preloader, so they scroll straight away.
    const home = window.location.pathname === "/";
    if (home && !experience.get().loaded) instance.stop();
    const unsub = experience.subscribe(() => {
      if (experience.get().loaded && instance.isStopped) instance.start();
    });

    setLenis(instance);

    return () => {
      unsub();
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
