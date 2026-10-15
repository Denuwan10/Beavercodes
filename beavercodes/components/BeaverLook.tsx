"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useExperience } from "@/utils/store";
import { cn } from "@/utils/math";

/**
 * Pre-rendered head-sweep frames, cut from the beaver video
 * (assets-src/beaver-sweep.mp4) ahead of time: one continuous left → right
 * turn, motion-interpolated to 3× the source frame rate, black background
 * keyed out (edges recoloured from the fur, no dark rim), and the log + grass
 * taken from a single frame and faded out at the sides, so only the beaver
 * moves. 148 small AVIFs (~3.9 MB in all; touch devices load every other one).
 *
 *   look-000  looking left (screen left)
 *   look-099  facing the viewer
 *   look-147  looking right
 */
const FRAME_COUNT = 148;
const CENTER = 99;
const LAST = FRAME_COUNT - 1;
/** Touch devices: seconds for one full look-around (left, then right). */
const AUTO_PERIOD = 8;
// ?v= busts browser caches whenever the frames are re-cut.
const frameUrl = (i: number) => `/beaver-sweep/look-${String(i).padStart(3, "0")}.avif?v=4`;

/**
 * The log under the beaver's feet is the same in every source frame, so it is
 * always drawn from the centre frame — otherwise each frame's own compression
 * noise there would flicker as the frames change. Below STATIC_FROM_ROW the
 * source is identical; the strip fades in from STATIC_FADE_FROM (just under
 * the claws) so there's no seam with the per-frame pixels above.
 */
const STATIC_FADE_FROM = 545;
const STATIC_FROM_ROW = 569;

/** The centre frame's log strip, faded in at the top, ready to stamp. */
function makeLogStrip(still: ImageBitmap) {
  const w = still.width;
  const h = still.height - STATIC_FADE_FROM;
  const strip = document.createElement("canvas");
  strip.width = w;
  strip.height = h;
  const sc = strip.getContext("2d")!;
  sc.drawImage(still, 0, STATIC_FADE_FROM, w, h, 0, 0, w, h);
  const fade = sc.createLinearGradient(0, 0, 0, STATIC_FROM_ROW - STATIC_FADE_FROM);
  fade.addColorStop(0, "rgba(0,0,0,0)");
  fade.addColorStop(1, "rgba(0,0,0,1)");
  // Fill the WHOLE strip: "destination-in" erases everything the fill doesn't
  // cover. The gradient ramps over the first rows, then stays fully opaque.
  sc.globalCompositeOperation = "destination-in";
  sc.fillStyle = fade;
  sc.fillRect(0, 0, w, h);
  return strip;
}

/** Frame position for a cursor x (0 = left edge, 1 = right edge of the window). */
const positionFor = (x: number) =>
  x <= 0.5 ? (x / 0.5) * CENTER : CENTER + ((x - 0.5) / 0.5) * (LAST - CENTER);

/**
 * Load order: the resting frame first, then frames spread evenly across the
 * sweep (every 16th, 8th, 4th, 2nd, then the rest) — so the beaver can turn
 * almost immediately and only gets smoother as the rest stream in.
 */
function loadOrder() {
  const seen = new Set([CENTER]);
  const order = [CENTER];
  for (const step of [16, 8, 4, 2, 1]) {
    for (let i = 0; i <= LAST; i += step) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  return order;
}

/**
 * The VR beaver turning its head to follow the cursor: cursor on the left →
 * looks left, on the right → looks right. When the cursor rests it eases back
 * to facing the viewer. On touch devices (no cursor) it looks around by
 * itself, slowly sweeping left and right.
 */
export default function BeaverLook({ className }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const frames = useRef<(ImageBitmap | undefined)[]>([]);
  const redraw = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);
  const loaded = useExperience((s) => s.loaded);
  const reduced = useReducedMotion();

  // Stream the frames in after the preloader, so they never compete with the
  // 3D scene. Touch devices (which play the turn by themselves) get every
  // other frame — half the download, and the cross-fade fills the gaps.
  // With reduced motion only the resting frame is needed.
  useEffect(() => {
    if (!loaded) return;
    const ctrl = new AbortController();
    const fine = window.matchMedia("(pointer: fine)").matches;
    const queue = reduced ? [CENTER] : fine ? loadOrder() : loadOrder().filter((i) => i % 2 === 0 || i === CENTER);
    const store = frames.current;

    const worker = async () => {
      while (queue.length && !ctrl.signal.aborted) {
        const i = queue.shift()!;
        try {
          const res = await fetch(frameUrl(i), { signal: ctrl.signal });
          const bmp = await createImageBitmap(await res.blob());
          if (ctrl.signal.aborted) {
            bmp.close();
            return;
          }
          store[i] = bmp;
          if (i === CENTER) setReady(true);
          redraw.current();
        } catch {
          if (ctrl.signal.aborted) return;
          // Browsers without AVIF support (e.g. Safari before 16): show the
          // resting frame as WebP instead of an empty space, and stop — the
          // other frames are AVIF too.
          if (i === CENTER) {
            queue.length = 0;
            try {
              const res = await fetch("/beaver-sweep/look-099.webp?v=4", { signal: ctrl.signal });
              store[CENTER] = await createImageBitmap(await res.blob());
              setReady(true);
              redraw.current();
            } catch {
              /* nothing more to try — the hero simply shows no beaver */
            }
            return;
          }
        }
      }
    };
    // A few requests in flight at once; the centre frame is first in line.
    for (let n = 0; n < 4; n++) worker();

    return () => {
      ctrl.abort();
      store.forEach((b) => b?.close());
      frames.current = [];
    };
  }, [loaded, reduced]);

  // Draw loop: ease toward the frame the cursor asks for, cross-fading between
  // neighbouring frames for a continuous turn, then sleep until the cursor
  // moves again (no work at all while idle).
  useEffect(() => {
    const c = canvas.current;
    if (!c || !ready) return;
    const ctx = c.getContext("2d")!;

    let target = CENTER;
    let current = CENTER;
    let drawnKey = "";
    let lastMove = 0;
    let lastT = 0;
    let visible = true;
    let raf = 0;
    let idleTimer = 0;
    let logStrip: HTMLCanvasElement | undefined;
    // Touch devices have no cursor to follow, so the turn plays by itself.
    const auto = !reduced && !window.matchMedia("(pointer: fine)").matches;
    let autoTime = 0;

    /** Nearest frame that has loaded so far. */
    const nearest = (i: number) => {
      const f = frames.current;
      for (let d = 0; d <= LAST; d++) {
        if (f[i - d]) return i - d;
        if (f[i + d]) return i + d;
      }
      return -1;
    };

    /** Closest loaded frame at or below / at or above i (-1 if none). */
    const below = (i: number) => {
      for (let j = i; j >= 0; j--) if (frames.current[j]) return j;
      return -1;
    };
    const above = (i: number) => {
      for (let j = i; j <= LAST; j++) if (frames.current[j]) return j;
      return -1;
    };

    const draw = (pos: number) => {
      const f = frames.current;
      // Blend between the loaded frames either side of pos — true neighbours
      // on desktop, every-other frames on touch devices — but never across a
      // gap still waiting for frames to stream in.
      const lo = below(Math.floor(pos));
      const hi = above(Math.ceil(pos));
      const close = lo >= 0 && hi >= 0 && hi - lo <= 2;
      const a = close ? lo : -1;
      const b = close ? hi : -1;
      const t = close && hi > lo ? (pos - lo) / (hi - lo) : 0;
      const fa = a >= 0 ? a : nearest(Math.round(pos));
      if (fa < 0) return;
      const blend = a >= 0 && b > a && t > 0.04 && t < 0.96 ? t : 0;
      const shown = blend ? a : t >= 0.96 && b >= 0 ? b : fa;
      const key = blend ? `${a}:${Math.round(blend * 12)}` : `${shown}`;
      if (key === drawnKey) return;
      const base = f[shown]!;
      if (c.width !== base.width || c.height !== base.height) {
        c.width = base.width;
        c.height = base.height;
      }
      ctx.clearRect(0, 0, c.width, c.height);
      if (blend) {
        // True linear blend: (1-t)·A + t·B, added together ("lighter" sums the
        // premultiplied pixels). Drawing B over A instead would stack the
        // semi-transparent edges and make them pulse darker on every blend.
        ctx.globalAlpha = 1 - blend;
        ctx.drawImage(base, 0, 0);
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = blend;
        ctx.drawImage(f[b]!, 0, 0);
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
      } else {
        ctx.drawImage(base, 0, 0);
      }
      // The log under the feet always comes from one frame.
      const still = f[CENTER];
      if (still) {
        logStrip ??= makeLogStrip(still);
        ctx.clearRect(0, STATIC_FROM_ROW, c.width, c.height - STATIC_FROM_ROW);
        ctx.drawImage(logStrip, 0, STATIC_FADE_FROM);
      }
      drawnKey = key;
    };

    const wake = () => {
      if (!raf && visible) {
        lastT = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    // New frames arriving may improve what's on screen right now.
    redraw.current = () => {
      drawnKey = "";
      wake();
    };

    function tick(now: number) {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.1, (now - lastT) / 1000);
      lastT = now;
      if (auto) {
        // No cursor (phones, tablets): look around by itself — centre → left
        // → centre → right on a slow sine, which eases at each end.
        autoTime += dt;
        const s = Math.sin((autoTime / AUTO_PERIOD) * Math.PI * 2);
        current = s < 0 ? CENTER + s * CENTER : CENTER + s * (LAST - CENTER);
        draw(current);
        raf = requestAnimationFrame(tick);
        return;
      }
      // Resting cursor: drift back to looking at the viewer.
      const goal = now - lastMove > 2500 ? CENTER : target;
      // Frame-rate independent easing (~same feel at 60 Hz and 120 Hz).
      current += (goal - current) * (reduced ? 1 : 1 - Math.exp(-dt * 9));
      if (Math.abs(goal - current) < 0.02) current = goal;
      draw(current);
      if (current !== goal) raf = requestAnimationFrame(tick);
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target = positionFor(Math.min(1, Math.max(0, e.clientX / window.innerWidth)));
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
    if (auto) wake();
    window.addEventListener("pointermove", onMove, { passive: true });
    io.observe(c);
    return () => {
      redraw.current = () => {};
      window.removeEventListener("pointermove", onMove);
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(idleTimer);
    };
  }, [ready, reduced]);

  return (
    <div className={cn("relative", className)} aria-hidden>
      <canvas
        ref={canvas}
        className={cn(
          "h-full w-full object-contain transition-opacity duration-1000 ease-out",
          ready ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
