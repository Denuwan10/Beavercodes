"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { SCREEN } from "@/utils/sceneLayout";
import { sceneState } from "@/utils/sceneState";
import { lerp, range, smoothstep } from "@/utils/math";
import { portalHalfSize } from "./CameraAnimation";
import { STORY } from "@/utils/store";

type Pt = { x: number; y: number };

/**
 * Projective transform that maps an element of size w×h onto an arbitrary
 * quad (TL, TR, BR, BL) — returned as a CSS matrix3d with origin 0 0.
 * (Heckbert, "Projective Mappings for Image Warping", square → quad.)
 */
function quadToMatrix3d(w: number, h: number, q: [Pt, Pt, Pt, Pt]) {
  const [p0, p1, p2, p3] = q;
  const dx1 = p1.x - p2.x;
  const dx2 = p3.x - p2.x;
  const dx3 = p0.x - p1.x + p2.x - p3.x;
  const dy1 = p1.y - p2.y;
  const dy2 = p3.y - p2.y;
  const dy3 = p0.y - p1.y + p2.y - p3.y;

  let a: number, b: number, d: number, e: number, g: number, hh: number;
  if (Math.abs(dx3) < 1e-6 && Math.abs(dy3) < 1e-6) {
    a = p1.x - p0.x;
    b = p2.x - p1.x;
    d = p1.y - p0.y;
    e = p2.y - p1.y;
    g = 0;
    hh = 0;
  } else {
    const den = dx1 * dy2 - dx2 * dy1;
    g = (dx3 * dy2 - dx2 * dy3) / den;
    hh = (dx1 * dy3 - dx3 * dy1) / den;
    a = p1.x - p0.x + g * p1.x;
    b = p3.x - p0.x + hh * p3.x;
    d = p1.y - p0.y + g * p1.y;
    e = p3.y - p0.y + hh * p3.y;
  }
  const c = p0.x;
  const f = p0.y;
  // Unit square → element pixels
  a /= w;
  d /= w;
  g /= w;
  b /= h;
  e /= h;
  hh /= h;
  const r = (v: number) => (Math.abs(v) < 1e-12 ? 0 : +v.toFixed(10));
  return `matrix3d(${r(a)},${r(d)},0,${r(g)},${r(b)},${r(e)},0,${r(hh)},0,0,1,0,${r(c)},${r(f)},0,1)`;
}

/**
 * The signature move: the real DOM website is projected onto the laptop
 * display every frame, so as the camera dives in, the page grows until it is
 * simply… the page. No hard cut, no video — the same live markup throughout.
 */
export default function ScreenPortalSync({
  portal,
  canvasWrap,
  flash,
  cssFilters = true,
}: {
  portal: React.RefObject<HTMLDivElement | null>;
  canvasWrap: React.RefObject<HTMLDivElement | null>;
  /** Overlay used for the light transition as we pass through the glass. */
  flash?: React.RefObject<HTMLDivElement | null>;
  /** Blur/brightness on the DOM site during the dive (skipped on low-end). */
  cssFilters?: boolean;
}) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const last = useRef({ filter: "" });

  const corners = useMemo(() => {
    const { hw, hh } = portalHalfSize(size.width / Math.max(1, size.height));
    const right = new Vector3(1, 0, 0);
    const at = (sx: number, sy: number) =>
      SCREEN.center.clone().addScaledVector(right, sx * hw).addScaledVector(SCREEN.up, sy * hh);
    return [at(-1, 1), at(1, 1), at(1, -1), at(-1, -1)];
  }, [size.width, size.height]);

  const tmp = useMemo(() => new Vector3(), []);

  useFrame(() => {
    const el = portal.current;
    const wrap = canvasWrap.current;
    if (!el) return;
    const p = sceneState.p;
    const W = size.width;
    const H = size.height;

    // Compare against the elements' current inline styles (not a remembered
    // value): Hero3D also writes these when the loop pauses past the intro,
    // and a stale copy left the canvas hidden after scrolling back up.
    const styleNum = (v: string, fallback: number) => (v === "" ? fallback : parseFloat(v));

    // Canvas fades out once the site owns the viewport.
    const canvasFade = 1 - range(p, STORY.revealAt, STORY.revealAt + 0.04);
    if (wrap && Math.abs(canvasFade - styleNum(wrap.style.opacity, 1)) > 0.001) {
      wrap.style.opacity = String(canvasFade);
      wrap.style.visibility = canvasFade <= 0.001 ? "hidden" : "visible";
    }

    // Light transition: a warm bloom that peaks as the glass fills the frame,
    // then clears to reveal the page.
    const flashO = smoothstep(range(p, 0.7, 0.785)) * (1 - smoothstep(range(p, 0.8, 0.88))) * 0.85;
    if (flash?.current && Math.abs(flashO - styleNum(flash.current.style.opacity, 0)) > 0.002) {
      flash.current.style.opacity = flashO.toFixed(3);
    }

    if (p < STORY.portalStart - 0.02) {
      if (el.style.visibility !== "hidden") {
        el.style.visibility = "hidden";
        el.style.pointerEvents = "none";
      }
      return;
    }
    if (el.style.visibility !== "visible") el.style.visibility = "visible";

    // Project portal corners to screen pixels.
    const pts = corners.map((c) => {
      tmp.copy(c).project(camera);
      return { x: (tmp.x * 0.5 + 0.5) * W, y: (-tmp.y * 0.5 + 0.5) * H };
    }) as [Pt, Pt, Pt, Pt];

    // Blend toward the exact viewport rectangle at the end of the dive.
    const f = smoothstep(range(p, STORY.diveEnd - 0.07, STORY.diveEnd));
    const full: [Pt, Pt, Pt, Pt] = [
      { x: 0, y: 0 },
      { x: W, y: 0 },
      { x: W, y: H },
      { x: 0, y: H },
    ];
    const q = pts.map((pt, i) => ({ x: lerp(pt.x, full[i].x, f), y: lerp(pt.y, full[i].y, f) })) as [Pt, Pt, Pt, Pt];

    const done = f > 0.999;
    el.style.transform = done ? "none" : quadToMatrix3d(W, H, q);
    el.style.opacity = String(smoothstep(range(p, STORY.portalStart, STORY.portalStart + 0.07)));
    const scale = Math.max(0.02, Math.hypot(q[1].x - q[0].x, q[1].y - q[0].y) / W);
    el.style.borderRadius = done ? "0px" : `${Math.min(80, (1 - f) * 6 / scale)}px`;
    el.style.pointerEvents = done ? "auto" : "none";

    // The site "comes into focus" as we pass through the display.
    if (cssFilters) {
      const haze = smoothstep(range(p, 0.64, 0.74)) * (1 - smoothstep(range(p, 0.75, STORY.diveEnd)));
      const filter = haze > 0.01 ? `blur(${(haze * 3).toFixed(2)}px) brightness(${(1 + haze * 0.35).toFixed(3)}) saturate(${(1 + haze * 0.2).toFixed(3)})` : "none";
      if (filter !== last.current.filter) {
        el.style.filter = filter;
        last.current.filter = filter;
      }
    }
  });

  return null;
}
