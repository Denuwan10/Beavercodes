"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";
import { experience, useExperience } from "@/utils/store";

/** Never flash: show for at least this long. */
const MIN_TIME = 900;
/** Give up waiting for the 3D scene after this. */
const FAILSAFE = 9000;
/** How long the bar takes to sweep from 90% to full once the scene is ready. */
const FINISH_MS = 450;

const EASE = [0.16, 1, 0.3, 1] as const;

/** Status line under the bar, by time on screen. */
const STEPS = [
  { at: 0, label: "Setting up the desk" },
  { at: 900, label: "Powering the monitor" },
  { at: 2000, label: "Waking the beaver" },
];
const FINISH_LABEL = "Opening the workshop";

/**
 * Loading screen: a large "Ready To Build" over a wide progress bar, framed by
 * small corner details.
 *
 * Everything that moves continuously (bar fill, light sweep, glow) is a CSS
 * transform/opacity animation, so it runs on the compositor and keeps moving
 * even while the 3D scene compiles shaders on the main thread — no frozen bar.
 * The bar creeps toward 90% on its own and completes once the scene has drawn
 * its first frame; then the screen fades away and the page is unlocked.
 */
export default function Preloader() {
  // Wait for the scene's first frame *and* the beaver model, so nothing pops in
  // (or compiles shaders) after the curtain lifts.
  const ready = useExperience((s) => (s.sceneReady && s.modelReady) || s.staticMode);
  const [step, setStep] = useState(STEPS[0].label);
  const [finishing, setFinishing] = useState(false);
  const [done, setDone] = useState(false);
  const start = useRef(0);

  // Status labels on a timer (no per-frame React work).
  useEffect(() => {
    start.current = performance.now();
    const timers = STEPS.slice(1).map((s) => window.setTimeout(() => setStep(s.label), s.at));
    const failsafe = window.setTimeout(() => setFinishing(true), FAILSAFE);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(failsafe);
    };
  }, []);

  // Scene ready → finish (after the minimum time on screen).
  useEffect(() => {
    if (!ready || finishing) return;
    const wait = Math.max(0, MIN_TIME - (performance.now() - start.current));
    const t = window.setTimeout(() => setFinishing(true), wait);
    return () => clearTimeout(t);
  }, [ready, finishing]);

  // Bar completes, holds for a beat, then the screen fades out.
  useEffect(() => {
    if (!finishing) return;
    setStep(FINISH_LABEL);
    const t = window.setTimeout(() => setDone(true), FINISH_MS + 250);
    return () => clearTimeout(t);
  }, [finishing]);

  return (
    <AnimatePresence onExitComplete={() => experience.set({ loaded: true })}>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[90] overflow-hidden bg-ink text-cream"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          role="status"
          aria-live="polite"
          aria-label="Loading"
        >
          {/* Atmosphere: faint grid + warm glow behind the headline */}
          <div aria-hidden className="blueprint absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[80vmin] w-[110vmin] rounded-full will-change-transform [animation:preload-breathe_5s_ease-in-out_infinite]"
            style={{
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(closest-side, rgba(255,122,26,0.2), rgba(255,122,26,0.05) 55%, transparent)",
            }}
          />

          {/* Corner details */}
          <motion.div
            className="absolute inset-0 p-[var(--gutter)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-start justify-between">
              <Logo />
              <span className="eyebrow hidden text-mute sm:block">
                Build <span className="text-ember">•</span> Develop <span className="text-ember">•</span> Grow
              </span>
            </div>
            <div className="absolute inset-x-[var(--gutter)] bottom-[var(--gutter)] flex items-end justify-between">
              <span className="eyebrow text-mute">Loading the workshop</span>
              <span className="eyebrow hidden text-mute sm:block">© {new Date().getFullYear()} BeaverCodes</span>
            </div>
          </motion.div>

          {/* Centre: headline + bar */}
          <div className="absolute inset-0 flex items-center justify-center px-[var(--gutter)]">
            <motion.div className="flex w-[min(40rem,100%)] flex-col" exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.6, ease: EASE }}>
              <p className="text-center text-[clamp(2.75rem,8vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
                {/* CSS animations (globals.css), not framer-motion: they run
                    on the compositor, so the words don't stutter while the
                    3D scene loads in the background. */}
                {["Ready", "To"].map((w, i) => (
                  <span key={w} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                    <span className="preload-word inline-block" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
                      {w}&nbsp;
                    </span>
                  </span>
                ))}
                <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <em className="preload-word inline-block not-italic text-ember" style={{ animationDelay: "0.26s" }}>
                    Build
                  </em>
                </span>
              </p>

              <div className="preload-rise mt-[clamp(2rem,6vh,3.5rem)]">
                <div className="mb-3 flex h-4 items-baseline">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={step}
                      className="eyebrow text-mute"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.35 }}
                    >
                      {step}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-cream/10" aria-hidden>
                  {/* Fill: creeps to 90% (CSS), then a short transition to 100% when ready */}
                  <div
                    className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-[#c4561a] via-ember to-amber shadow-[0_0_14px_rgba(255,122,26,0.65)] will-change-transform"
                    style={
                      finishing
                        ? { transform: "scaleX(1)", transition: `transform ${FINISH_MS}ms cubic-bezier(0.16,1,0.3,1)` }
                        : { animation: "preload-fill 7s cubic-bezier(0.12,0.7,0.25,1) forwards" }
                    }
                  />
                  {/* Light sweeping along the bar */}
                  <span className="absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-transparent via-white/60 to-transparent mix-blend-overlay will-change-transform [animation:preload-sweep_1.6s_ease-in-out_infinite]" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
