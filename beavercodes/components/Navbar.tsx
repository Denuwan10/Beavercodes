"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";
import MagneticButton, { Arrow } from "./MagneticButton";
import { scrollToTarget, useLenis } from "@/hooks/useLenis";
import { experience, STORY, useExperience } from "@/utils/store";
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
  const siteMode = useExperience((s) => s.staticMode || s.progress >= STORY.revealAt - 0.06);
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
    const ids = LINKS.slice(1).map((l) => l.id);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActiveId(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    const onTop = () => {
      if (window.scrollY < (experience.get().landingY || 0) + window.innerHeight * 0.5) setActiveId("home");
    };
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, []);

  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else if (experience.get().loaded) lenis.start();
  }, [open, lenis]);

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

      {/* Mobile / tablet menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-ink/95 px-[var(--gutter)] pb-12 pt-28 backdrop-blur-xl lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="flex flex-col gap-2">
              {LINKS.map((l, i) => (
                <li key={l.id} className="overflow-hidden">
                  <motion.a
                    href={`#${l.id}`}
                    onClick={go(l.id)}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.25 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-baseline gap-4 text-[clamp(2.6rem,11vw,5rem)] font-extrabold leading-[1.05] tracking-tight"
                  >
                    <span className="eyebrow text-ember">0{i + 1}</span>
                    {l.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <a href="mailto:hello@beavercodes.com" className="mt-10 text-mute underline-offset-4 hover:underline">
              hello@beavercodes.com
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
