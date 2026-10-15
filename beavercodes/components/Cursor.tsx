"use client";

import { useEffect, useRef } from "react";

/**
 * Two-part cursor: a precise dot and a lagging ring. Elements opt in to
 * richer states with data attributes:
 *   data-cursor="hover"            → ring grows
 *   data-cursor="view" data-cursor-label="View"  → ring becomes a labelled disc
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.classList.add("has-custom-cursor");
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let mode = "";
    let visible = false;
    let raf = 0;

    const setMode = (next: string, text = "") => {
      if (next === mode) return;
      mode = next;
      ring.current?.setAttribute("data-mode", next);
      if (label.current) label.current.textContent = text;
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        pos.x = target.x;
        pos.y = target.y;
        dot.current?.style.setProperty("opacity", "1");
        ring.current?.style.setProperty("opacity", "1");
      }
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor], a, button, input, textarea, select, label");
      if (!el) return setMode("");
      const m = el.dataset.cursor ?? (el.matches("input, textarea") ? "text" : "hover");
      setMode(m, el.dataset.cursorLabel ?? "");
    };

    const onLeave = () => {
      visible = false;
      dot.current?.style.setProperty("opacity", "0");
      ring.current?.style.setProperty("opacity", "0");
    };

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.16;
      pos.y += (target.y - pos.y) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden [@media(pointer:fine)]:block">
      <div ref={dot} className="absolute left-0 top-0 opacity-0 transition-opacity duration-300">
        <div className="-ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full bg-ember" />
      </div>
      <div
        ref={ring}
        data-mode=""
        className="group absolute left-0 top-0 opacity-0 transition-opacity duration-300"
      >
        <div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cream/40 transition-[width,height,background-color,border-color] duration-500 ease-[var(--ease-out-expo)]
          h-9 w-9
          group-data-[mode=hover]:h-16 group-data-[mode=hover]:w-16 group-data-[mode=hover]:border-ember/70
          group-data-[mode=text]:h-7 group-data-[mode=text]:w-[2px] group-data-[mode=text]:rounded-none group-data-[mode=text]:border-ember
          group-data-[mode=view]:h-24 group-data-[mode=view]:w-24 group-data-[mode=view]:border-transparent group-data-[mode=view]:bg-ember"
        >
          <span
            ref={label}
            className="font-mono  opacity-0 transition-opacity duration-300 group-data-[mode=view]:opacity-100"
          />
        </div>
      </div>
    </div>
  );
}
