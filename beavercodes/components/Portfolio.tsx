"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading, { Serif } from "./SectionHeading";
import ProjectShot from "./ProjectShot";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useLenis } from "@/hooks/useLenis";
import { useExperience } from "@/utils/store";
import { PROJECTS, type Project } from "@/utils/projects";

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty("--rx", `${-y * 5}deg`);
    e.currentTarget.style.setProperty("--ry", `${x * 7}deg`);
  };
  const onLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };

  return (
    // Desktop width is capped by the viewport *height* as well: the 16:10 preview
    // plus its caption (up to a two-line title) must fit between the navbar and
    // the progress line, or the pinned section clips them.
    <article
      id={`work-${p.slug}`}
      className="portfolio-card group w-full shrink-0 lg:w-[min(72vw,1040px,calc((100svh_-_20.5rem)_*_1.6))]"
    >
      {/* The whole card opens the project. An in-app link, so it opens as an
          overlay over this page (app/@modal) — the home page stays mounted
          and closing it returns here instantly. scroll={false}: keep our place. */}
      <Link
        href={`/work/${p.slug}`}
        scroll={false}
        className="block rounded-[28px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
      >
      <div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        data-cursor="view"
        data-cursor-label="View"
        className="pop-card relative aspect-[4/3] overflow-hidden rounded-[28px] [perspective:1200px] md:aspect-[16/10]"
        style={{ background: p.bg }}
      >
        <div aria-hidden className="blueprint absolute inset-0 opacity-60" />
        <div
          className="absolute inset-0 flex items-center justify-center px-[6%] pb-[5%] pt-[14%] transition-transform duration-[900ms] ease-[var(--ease-out-expo)] [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] group-hover:scale-[1.035] md:pt-[9%]"
        >
          <ProjectShot p={p} />
        </div>
        <div className="absolute left-6 top-6 flex items-center gap-3 md:left-8 md:top-8">
          <span className="rounded-full bg-ink/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-cream/80 backdrop-blur">
            {p.category}
          </span>
        </div>
        <span className="absolute right-6 top-6 font-mono text-xs text-cream/50 md:right-8 md:top-8">
          {String(i + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-8">
        {/* Hover underline: a real text underline (sits just under the baseline,
            clear of the next line) that fades in, instead of a background bar
            at the bottom of each line box, which cut into a wrapped second line. */}
        <h3 className="min-w-0 text-balance text-[clamp(1.5rem,2.4vw,2.3rem)] font-extrabold leading-[1.12] tracking-tight underline decoration-transparent decoration-2 underline-offset-[0.14em] transition-[text-decoration-color] duration-500 ease-out group-hover:decoration-ember md:flex-1">
          {p.title}
        </h3>
        <div className="max-w-md md:w-[42%] md:shrink-0">
          <p className="text-mute">{p.summary}</p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <ul className="flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <li key={t} className="font-mono text-[11px] uppercase tracking-wider text-cream/50">
                  · {t}
                </li>
              ))}
            </ul>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ember">
              View project
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </div>
        </div>
      </div>
      </Link>
    </article>
  );
}

export default function Portfolio() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  // The desktop pin (when active), so a card's scroll position can be worked out.
  const pin = useRef<{ st: ScrollTrigger; distance: () => number } | null>(null);
  const lenis = useLenis();
  const loaded = useExperience((s) => s.loaded);

  // Coming back from a project page ("/?work=<slug>" — a query, not a #hash,
  // so the browser doesn't jump before the intro is ready): once the
  // preloader is done, jump straight to that project's card. On desktop the
  // cards scroll sideways inside a pinned section, so the target is the scroll
  // position where that card sits in the middle of the screen, not its top.
  useEffect(() => {
    if (!loaded) return;
    const slug = new URLSearchParams(window.location.search).get("work");
    const card = slug && document.getElementById(`work-${slug}`);
    if (!card) return;
    const t = window.setTimeout(() => {
      let y: number;
      const p = pin.current;
      if (p) {
        const x = card.offsetLeft + card.offsetWidth / 2 - window.innerWidth / 2;
        const progress = Math.min(1, Math.max(0, x / p.distance()));
        y = p.st.start + progress * (p.st.end - p.st.start);
        // Put the track there now instead of letting the scrub catch up.
        p.st.animation?.progress(progress);
      } else {
        y = card.getBoundingClientRect().top + window.scrollY - 96;
      }
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
      // Tidy the address bar back to "/". Keep history.state: Next.js keeps
      // its router state there, and wiping it breaks the next in-app navigation.
      window.history.replaceState(window.history.state, "", window.location.pathname);
    }, 250);
    return () => window.clearTimeout(t);
  }, [loaded, lenis]);

  // Desktop: pinned horizontal gallery. Below lg: natural vertical scroll.
  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current;
      if (!el) return;
      const distance = () => el.scrollWidth - window.innerWidth;
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
      // The scroll distance is measured from the track's width. If that width
      // changes after the first measurement (layout settling, a resize the
      // browser didn't report, a hot reload), re-measure — otherwise the track
      // keeps scrolling past the last card into blank space.
      if (tween.scrollTrigger) pin.current = { st: tween.scrollTrigger, distance };

      let lastW = el.scrollWidth;
      let pending = 0;
      const ro = new ResizeObserver(() => {
        if (el.scrollWidth === lastW) return;
        lastW = el.scrollWidth;
        cancelAnimationFrame(pending);
        pending = requestAnimationFrame(() => ScrollTrigger.refresh());
      });
      ro.observe(el);

      // Gentle parallax on each preview while the track moves.
      gsap.utils.toArray<HTMLElement>(".portfolio-card").forEach((card) => {
        gsap.fromTo(card, { opacity: 0.55 }, {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            containerAnimation: tween,
            start: "left 90%",
            end: "left 40%",
            scrub: true,
          },
        });
      });

      return () => {
        pin.current = null;
        ro.disconnect();
        cancelAnimationFrame(pending);
      };
    });
    return () => mm.revert();
  }, []);

  return (
    // Desktop: room at the top for the fixed navbar and at the bottom for the
    // progress line, so cards never slide under either.
    <section id="portfolio" ref={section} className="relative overflow-hidden bg-ink py-[clamp(5rem,10vw,8rem)] lg:flex lg:h-svh lg:flex-col lg:justify-center lg:pb-[4.5rem] lg:pt-[6.5rem]">
      <div ref={track} className="flex flex-col gap-20 px-[var(--gutter)] lg:w-max lg:flex-row lg:items-center lg:gap-[6vw]">
        <div className="shrink-0 lg:w-[34vw]">
          <SectionHeading
            index="02"
            label="Portfolio"
            title={[
              "Built in",
              <>
                the <Serif>workshop.</Serif>
              </>,
            ]}
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-8 max-w-sm text-mute md:text-lg"
          >
            A look at the kinds of products we craft — each one engineered for performance and designed to grow with the business behind it.
          </motion.p>
          <p className="eyebrow mt-10 hidden items-center gap-3 lg:flex">
            Keep scrolling <span className="text-ember">→</span>
          </p>
        </div>
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.title} p={p} i={i} />
        ))}
        <div className="hidden w-[4vw] shrink-0 lg:block" />
      </div>
      <div className="absolute bottom-10 left-[var(--gutter)] right-[var(--gutter)] hidden h-px bg-cream/10 lg:block">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-ember" />
      </div>
    </section>
  );
}
