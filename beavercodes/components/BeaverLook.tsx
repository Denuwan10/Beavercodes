"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useExperience } from "@/utils/store";
import { cn } from "@/utils/math";

/**
 * Pre-rendered head-turn frames, cut out of assets-src/beaveranimate.mp4 ahead of
 * time (black background removed, rim light shaved) — so the browser only
 * downloads ~1.2 MB of small WebPs and never decodes or processes video.
 *
 *   look-00 … look-26  0.1 → 2.7 s: looking left → facing the viewer
 *   look-27 … look-40  2.75 → 3.4 s: facing the viewer → looking right
 */
const FRAME_COUNT = 41;
const CENTER = 26; // facing the viewer
const LAST = FRAME_COUNT - 1;
const frameUrl = (i: number) => `/beaver-look/look-${String(i).padStart(2, "0")}.webp`;

/** Frame index for a cursor position (0 = left edge, 1 = right edge of the window). */
const indexFor = (x: number) =>
  x <= 0.5 ? (x / 0.5) * CENTER : CENTER + ((x - 0.5) / 0.5) * (LAST - CENTER);

/** Download + decode every frame off the main thread (createImageBitmap on a blob). */
async function loadFrames(signal: AbortSignal) {
  return Promise.all(
    Array.from({ length: FRAME_COUNT }, async (_, i) => {
      const res = await fetch(frameUrl(i), { signal });
      return createImageBitmap(await res.blob());
    }),
  );
}

/**
 * The VR beaver from the hero video, turning its head to follow the cursor:
 * cursor on the left → looks left, on the right → looks right. When the cursor
 * rests (or on touch devices) it eases back to facing the viewer.
 */
export default function BeaverLook({ className }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [frames, setFrames] = useState<ImageBitmap[] | null>(null);
  const loaded = useExperience((s) => s.loaded);
  const reduced = useReducedMotion();

  // Fetch after the preloader, so the frames never compete with the 3D scene.
  useEffect(() => {
    if (!loaded) return;
    const ctrl = new AbortController();
    let got: ImageBitmap[] = [];
    loadFrames(ctrl.signal)
      .then((f) => {
        got = f;
        if (!ctrl.signal.aborted) setFrames(f);
      })
      .catch(() => {});
    return () => {
      ctrl.abort();
      got.forEach((b) => b.close());
    };
  }, [loaded]);

  // Draw loop: ease toward the frame the cursor asks for, then sleep until the
  // cursor moves again (no work at all while idle).
  useEffect(() => {
    const c = canvas.current;
    if (!c || !frames?.length) return;
    c.width = frames[0].width;
    c.height = frames[0].height;
    const ctx = c.getContext("2d")!;

    let target = CENTER;
    let current = CENTER;
    let drawn = -1;
    let lastMove = 0;
    let visible = true;
    let raf = 0;
    let idleTimer = 0;

    const draw = (i: number) => {
      if (i === drawn) return;
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.drawImage(frames[i], 0, 0);
      drawn = i;
    };
    const wake = () => {
      if (!raf && visible) raf = requestAnimationFrame(tick);
    };

    function tick(now: number) {
      raf = 0;
      if (!visible) return;
      // Resting cursor: drift back to looking at the viewer.
      const goal = now - lastMove > 2500 ? CENTER : target;
      current += (goal - current) * (reduced ? 1 : 0.14);
      if (Math.abs(goal - current) < 0.02) current = goal;
      draw(Math.round(current));
      if (current !== goal) raf = requestAnimationFrame(tick);
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target = indexFor(Math.min(1, Math.max(0, e.clientX / window.innerWidth)));
      lastMove = performance.now();
      wake();
      // Wake once more after the rest delay, to ease back to the centre.
      clearTimeout(idleTimer);
      idleTimer = window.setTimeout(wake, 2600);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });

    draw(CENTER);
    window.addEventListener("pointermove", onMove, { passive: true });
    io.observe(c);
    return () => {
      window.removeEventListener("pointermove", onMove);
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(idleTimer);
    };
  }, [frames, reduced]);

  return (
    <div className={cn("relative", className)} aria-hidden>
      <canvas
        ref={canvas}
        className={cn(
          "h-full w-full object-contain transition-opacity duration-1000 ease-out",
          frames ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
