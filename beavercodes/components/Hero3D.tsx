"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LandingHero from "./LandingHero";
import Preloader from "./Preloader";
import IntroHud from "./IntroHud";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { experience, STORY, STORY_TIMELINE, useExperience } from "@/utils/store";

gsap.registerPlugin(ScrollTrigger);

// The whole WebGL bundle (three, r3f, drei, postprocessing) is split out and
// only fetched on the client, after first paint.
const BeaverScene = dynamic(() => import("./BeaverScene"), { ssr: false });

/** How many viewport-heights of scrolling the cinematic intro lasts. */
const PIN_LENGTH = 4.2;

export default function Hero3D() {
  const profile = useDeviceTier();
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const portal = useRef<HTMLDivElement>(null);
  const canvasWrap = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);

  const staticMode = !!profile && (profile.reducedMotion || !profile.webgl);
  // Keep rendering until both the scroll and the (scrub-lagged) story are past the dive.
  const active = useExperience((s) => s.progress < 0.9 || s.story < 0.86);
  // The site starts "building itself" the moment it appears on the laptop display.
  const revealed = useExperience((s) => s.staticMode || s.story >= STORY.portalStart);

  // Pin the stage and translate scroll into story progress.
  useIsomorphicLayoutEffect(() => {
    if (!profile) return;
    if (staticMode) {
      experience.set({ staticMode: true, landingY: 0, progress: 1, story: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      // Story time is a scrubbed GSAP timeline: each beat gets its own ease,
      // and `scrub` adds inertia, so wheel ticks become a continuous dolly move.
      const story = { t: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        onUpdate: () => experience.set({ story: story.t }),
        scrollTrigger: {
          trigger: stage.current,
          start: "top top",
          end: () => `+=${window.innerHeight * PIN_LENGTH}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 1.1,
          // Created after device detection, so make sure it is measured before
          // every trigger further down the page.
          refreshPriority: 10,
          invalidateOnRefresh: true,
          onUpdate: (self) =>
            experience.set({
              progress: self.progress,
              velocity: Math.min(1, Math.abs(self.getVelocity()) / 3000),
            }),
          onRefresh: (self) =>
            experience.set({
              progress: self.progress,
              // Where "Home" lives: just after the reveal completes.
              landingY: Math.round(self.start + (self.end - self.start) * (STORY.revealAt + 0.06)),
            }),
        },
      });
      let from = 0;
      for (const beat of STORY_TIMELINE) {
        tl.to(story, { t: beat.to, ease: beat.ease, duration: beat.to - from });
        from = beat.to;
      }
        }, section);
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [profile, staticMode]);

  // When the 3D loop is paused past the intro, pin the portal to its final state.
  useEffect(() => {
    if (staticMode) return;
    const el = portal.current;
    const wrap = canvasWrap.current;
    if (!el || !wrap || active) return;
    el.style.transform = "none";
    el.style.visibility = "visible";
    el.style.opacity = "1";
    el.style.borderRadius = "0px";
    el.style.pointerEvents = "auto";
    el.style.filter = "none";
    wrap.style.opacity = "0";
    wrap.style.visibility = "hidden";
    if (flash.current) flash.current.style.opacity = "0";
  }, [active, staticMode]);

  if (staticMode) {
    return (
      <section id="home" ref={section} className="relative">
        <Preloader />
        <div className="relative h-svh w-full overflow-hidden">
          <LandingHero revealed />
        </div>
      </section>
    );
  }

  return (
    <section id="home" ref={section} className="relative" aria-label="BeaverCodes intro">
      <Preloader />
      <div ref={stage} className="relative h-svh w-full overflow-hidden bg-ink">
        <div ref={canvasWrap} className="absolute inset-0">
          {profile && (
            <BeaverScene
              tier={profile.tier}
              isTouch={profile.isTouch}
              active={active}
              portal={portal}
              canvasWrap={canvasWrap}
              flash={flash}
            />
          )}
        </div>

        <IntroHud />

        {/* The website, living on the laptop display until it becomes the page */}
        <div
          ref={portal}
          className="absolute left-0 top-0 h-full w-full origin-top-left overflow-hidden will-change-transform"
          style={{ visibility: "hidden", pointerEvents: "none", backfaceVisibility: "hidden" }}
        >
          <LandingHero revealed={revealed} />
        </div>

        {/* Light transition: a warm bloom of light as we pass through the glass */}
        <div
          ref={flash}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 opacity-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(255,214,170,0.95) 0%, rgba(255,140,60,0.55) 35%, rgba(255,122,26,0) 75%)",
          }}
        />
      </div>
    </section>
  );
}
