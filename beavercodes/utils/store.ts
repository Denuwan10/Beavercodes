"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny external store. The scroll progress changes on every scroll event, so
 * hot paths (3D frame loop, HUD) read `experience.get()` directly instead of
 * re-rendering React. Components that need coarse state (e.g. "has the
 * landing page been revealed?") subscribe through `useExperience(selector)`,
 * which only re-renders when the selected value changes.
 */
type Listener = () => void;

export function createStore<T extends object>(initial: T) {
  let state = initial;
  const listeners = new Set<Listener>();

  return {
    get: () => state,
    set(partial: Partial<T>) {
      let changed = false;
      for (const k in partial) {
        if (!Object.is(state[k], partial[k])) {
          changed = true;
          break;
        }
      }
      if (!changed) return;
      state = { ...state, ...partial };
      listeners.forEach((l) => l());
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export type ExperienceState = {
  /** Raw scroll progress of the pinned hero, 0 → 1 (drives HUD + UI). */
  progress: number;
  /**
   * Eased story time, 0 → 1. Produced by a scrubbed GSAP timeline with a
   * different ease per beat, so the camera breathes like a film dolly
   * (gentle holds between beats, an accelerating pull into the screen).
   */
  story: number;
  /** Normalised scroll velocity, 0 → 1 (|px/s| / 3000), smoothed. */
  velocity: number;
  /** 3D scene has rendered its first frame. */
  sceneReady: boolean;
  /** The beaver GLB has rendered (or is missing / failed), so it can't pop in later. */
  modelReady: boolean;
  /** Preloader has finished: scrolling is unlocked and the navbar shown. */
  loaded: boolean;
  /** Scroll position (px) at which the landing page is fully revealed. */
  landingY: number;
  /** The 3D intro is skipped (reduced motion, no WebGL). */
  staticMode: boolean;
};

export const experience = createStore<ExperienceState>({
  progress: 0,
  story: 0,
  velocity: 0,
  sceneReady: false,
  modelReady: false,
  loaded: false,
  landingY: 0,
  staticMode: false,
});

export function useExperience<S>(selector: (s: ExperienceState) => S): S {
  return useSyncExternalStore(
    experience.subscribe,
    () => selector(experience.get()),
    () => selector(experience.get()),
  );
}

/** Story beats (in story time) — single source of truth. */
export const STORY = {
  approachEnd: 0.25, // 0 → 0.25  full workspace, beaver coding, slow push-in
  focusEnd: 0.5, // 0.25 → 0.5 behind the shoulder, laptop becomes the hero
  portalStart: 0.52, // DOM site starts living on the laptop display
  diveEnd: 0.8, // 0.5 → 0.8 cinematic dive into the display
  revealAt: 0.8, // landing page fully owns the viewport
} as const;

/** Beat boundaries and eases used by the scrubbed GSAP story timeline. */
export const STORY_TIMELINE: Array<{ to: number; ease: string }> = [
  { to: 0.25, ease: "sine.inOut" }, // establishing → approach
  { to: 0.5, ease: "power2.inOut" }, // orbit behind the shoulder, settle on the laptop
  { to: 0.8, ease: "power3.in" }, // gather speed and get pulled into the screen
  { to: 1, ease: "power2.out" }, // land softly on the homepage
];
