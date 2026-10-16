"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLenis } from "@/hooks/useLenis";
import MagneticButton, { Arrow } from "./MagneticButton";

/**
 * A project (or service) opened from the home page: a full-screen layer over the home
 * page, which stays mounted — and exactly where it was — underneath. Closing
 * (All work, ✕, Escape or the browser's Back) is just a history step back, so
 * the home page reappears instantly: no reload, no preloader, no intro.
 */
export default function ProjectOverlay({
  title,
  children,
  backLabel = "All work",
  closeLabel = "Close project",
  labelledBy = "project-title",
}: {
  title: string;
  children: React.ReactNode;
  /** The back button's text; service pages use "All services". */
  backLabel?: string;
  closeLabel?: string;
  /** id of the heading that names the dialog. */
  labelledBy?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const panel = useRef<HTMLDivElement>(null);
  /** A home-page section to scroll to once the overlay has closed. */
  const goTo = useRef<string | null>(null);

  const close = useCallback(() => router.back(), [router]);

  // Freeze the home page's scroll while open; on close, resume it and (if a
  // "#section" link closed us) scroll there.
  useEffect(() => {
    lenis?.stop();
    return () => {
      lenis?.start();
      const id = goTo.current;
      if (!id) return;
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (!el) return;
        if (lenis) lenis.scrollTo(el, { offset: -10, duration: 1.2 });
        else el.scrollIntoView({ behavior: "smooth" });
      });
    };
  }, [lenis]);

  // Focus the panel (keyboard + screen readers start inside it); Escape closes.
  useEffect(() => {
    panel.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  // Previous / next swap the project in place: start it from the top.
  useEffect(() => {
    panel.current?.scrollTo({ top: 0 });
  }, [pathname]);

  // "#section" links inside (e.g. Start a project → #contact): close first,
  // then scroll the home page there.
  const onClickCapture = (e: React.MouseEvent) => {
    const a = (e.target as HTMLElement).closest("a");
    const href = a?.getAttribute("href");
    if (!href || !href.startsWith("#") || href.length < 2) return;
    e.preventDefault();
    goTo.current = href.slice(1);
    close();
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      className="fixed inset-0 z-[70] bg-ink"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      onClickCapture={onClickCapture}
    >
      {/* data-lenis-prevent: this panel scrolls natively, not the page below. */}
      <div ref={panel} tabIndex={-1} data-lenis-prevent className="h-full overflow-y-auto overscroll-contain outline-none">
        <div className="sticky top-0 z-10 border-b border-cream/[0.06] bg-ink/80 backdrop-blur-xl">
          <div className="container-x flex h-16 items-center justify-between gap-4 md:h-20">
            <button
              type="button"
              onClick={close}
              className="group inline-flex items-center gap-2 text-sm text-cream/80 transition-colors hover:text-cream"
            >
              <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>
              {backLabel}
            </button>
            <span className="hidden truncate font-semibold tracking-tight sm:block">{title}</span>
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <MagneticButton href="#contact" className="[&_a]:py-3">
                  Start a project <Arrow />
                </MagneticButton>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label={closeLabel}
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 transition-colors hover:border-ember hover:text-ember"
              >
                <span className="absolute h-px w-4 rotate-45 bg-current" />
                <span className="absolute h-px w-4 -rotate-45 bg-current" />
              </button>
            </div>
          </div>
        </div>
        {children}
      </div>
    </motion.div>
  );
}
