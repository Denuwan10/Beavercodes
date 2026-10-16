"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";
import MagneticButton, { Arrow } from "./MagneticButton";
import { SocialRow } from "./Socials";
import { scrollToTarget, useLenis } from "@/hooks/useLenis";
import { experience, STORY, storyToProgress, useExperience } from "@/utils/store";
import { cn } from "@/utils/math";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "portfolio", label: "Portfolio" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const lenis = useLenis();
  const siteMode = useExperience((s) => s.staticMode || s.progress >= storyToProgress(STORY.revealAt - 0.06));
  const loaded = useExperience((s) => s.loaded);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");

  // Solid + blurred once the landing hero has scrolled away.
  useEffect(() => {
    const onScroll = () => {
      const { landingY, staticMode } = experience.get();
      const threshold = (staticMode ? 0 : landingY) + window.innerHeight * 0.6;
      setSolid(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section in view.
  useEffect(() => {
    // Active = the last section whose top has passed 40% of the viewport.
    // "faq" (after Contact, no menu link) is tracked too, so reading the FAQ
    // highlights nothing rather than leaving "Contact" lit.
    const ids = [...LINKS.slice(1).map((l) => l.id), "faq"];
    const onScroll = () => {
      const vh = window.innerHeight;
      if (window.scrollY < (experience.get().landingY || 0) + vh * 0.5) return setActiveId("home");
      let current = "home";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= vh * 0.4) current = id;
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else if (experience.get().loaded) lenis.start();
  }, [open, lenis]);

  // Arriving from another page with "/#<id>" (or the older "/?section=<id>"):
  // hold at the top while the intro loads (SmoothScroll resets any early
  // browser jump; the preloader covers it), then jump to that section. A
  // jump, not a glide — gliding would play the whole 3D intro on the way.
  // ("#work/<slug>", a specific project card, is handled by Portfolio.)
  useEffect(() => {
    if (!loaded || !lenis) return;
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const id = new URLSearchParams(window.location.search).get("section") ?? (hash && !hash.includes("/") ? hash : null);
    const el = id ? document.getElementById(id) : null;
    if (!el) return;
    const t = window.setTimeout(() => {
      lenis.scrollTo(el, { immediate: true, force: true, offset: -10 });
      // Keep history.state (Next.js router state lives there).
      window.history.replaceState(window.history.state, "", window.location.pathname);
    }, 250);
    return () => window.clearTimeout(t);
  }, [loaded, lenis]);

  // Escape closes the menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToTarget(lenis, id, experience.get().landingY);
  };

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={loaded ? { y: 0, opacity: 1 } : { y: -24, opacity: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-700",
          solid ? "border-b border-cream/[0.06] bg-ink/70 backdrop-blur-xl" : "border-b border-transparent",
        )}
      >
        <nav className="container-x flex h-20 items-center justify-between" aria-label="Primary">
          <a href="#home" onClick={go("home")} aria-label="BeaverCodes home" data-cursor="hover">
            <Logo />
          </a>

          <AnimatePresence mode="wait">
            {siteMode ? (
              <motion.div
                key="site"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-8"
              >
                <ul className="hidden items-center gap-1 rounded-full border border-cream/10 bg-ink/40 p-1 backdrop-blur-md lg:flex">
                  {LINKS.map((l) => (
                    <li key={l.id}>
                      <a
                        href={`#${l.id}`}
                        onClick={go(l.id)}
                        className={cn(
                          "relative block rounded-full px-4 py-2 text-sm transition-colors duration-300",
                          activeId === l.id ? "text-ink" : "text-cream/70 hover:text-cream",
                        )}
                      >
                        {activeId === l.id && (
                          <motion.span
                            layoutId="nav-pill"
                            className="absolute inset-0 rounded-full bg-cream"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                        <span className="relative">{l.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="hidden md:block">
                  <MagneticButton href="#contact" onClick={() => setOpen(false)} className="[&_a]:py-3">
                    Let&apos;s Talk <Arrow />
                  </MagneticButton>
                </div>
                <button
                  onClick={() => setOpen((o) => !o)}
                  className="relative flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 lg:hidden"
                  aria-label={open ? "Close menu" : "Open menu"}
                  aria-expanded={open}
                  aria-controls="mobile-menu"
                >
                  <span className={cn("absolute h-px w-5 bg-cream transition-transform duration-500", open ? "rotate-45" : "-translate-y-1")} />
                  <span className={cn("absolute h-px w-5 bg-cream transition-transform duration-500", open ? "-rotate-45" : "translate-y-1")} />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="skip"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={go("home")}
                className="eyebrow rounded-full border border-cream/20 px-4 py-2 text-cream/80 transition-colors hover:border-ember hover:text-ember"
              >
                Skip intro ↓
              </motion.button>
            )}
          </AnimatePresence>
        </nav>
      </motion.header>

      {/* Mobile / tablet menu: a plain list right under the header — big tap
          rows, the current section highlighted, and the main action at the
          bottom within thumb reach. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink px-[var(--gutter)] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-24 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <ul className="border-t border-cream/10">
              {LINKS.map((l, i) => {
                const active = activeId === l.id;
                return (
                  <motion.li
                    key={l.id}
                    className="border-b border-cream/10"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.05 + i * 0.045, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <a
                      href={`#${l.id}`}
                      onClick={go(l.id)}
                      aria-current={active ? "location" : undefined}
                      className={cn(
                        "group flex items-center gap-4 py-4 text-[1.75rem] font-bold leading-tight tracking-tight transition-colors duration-200",
                        active ? "text-ember" : "text-cream active:text-ember",
                      )}
                    >
                      <span className={cn("w-6 font-mono text-xs", active ? "text-ember" : "text-mute")}>
                        0{i + 1}
                      </span>
                      <span className="flex-1">{l.label}</span>
                      <Arrow
                        className={cn(
                          "h-5 w-5 transition-transform duration-200 group-active:translate-x-1",
                          active ? "text-ember" : "text-cream/35",
                        )}
                      />
                    </a>
                  </motion.li>
                );
              })}
            </ul>

            <motion.div
              className="mt-auto space-y-5 pt-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <a
                href="#contact"
                onClick={go("contact")}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-ember px-6 py-4 text-base font-semibold text-paper transition-colors active:bg-ember-deep"
              >
                Start a project <Arrow />
              </a>
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 text-sm text-mute">
                <a href="mailto:hello@beavercodes.com" className="underline-offset-4 hover:underline">
                  hello@beavercodes.com
                </a>
                <SocialRow />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
