"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading, { Serif } from "./SectionHeading";
import MagneticButton, { Arrow } from "./MagneticButton";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

type Service = {
  title: string;
  lead: string;
  text: string;
  deliverables: string[];
  Visual: () => React.ReactElement;
};

/* ------------------------------ Visuals ------------------------------ */

function WebVisual() {
  return (
    <div className="w-full max-w-[520px] overflow-hidden rounded-2xl bg-[#f4ede3] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.7)]">
      <div className="flex items-center gap-1.5 bg-[#e6ddd0] px-4 py-3">
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
        ))}
        <span className="ml-3 h-4 flex-1 rounded-full bg-black/5" />
      </div>
      <div className="grid grid-cols-5 gap-4 p-6">
        <div className="col-span-3 space-y-3">
          {[0.35, 0.95, 0.75, 0.6].map((w, i) => (
            <motion.div
              key={i}
              className={i === 0 ? "h-2 rounded-full bg-ember" : i === 1 ? "h-7 rounded-md bg-[#14110f]" : "h-2.5 rounded-full bg-black/10"}
              initial={{ width: 0 }}
              whileInView={{ width: `${w * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.2 + i * 0.12, ease: EASE }}
            />
          ))}
          <motion.div
            className="mt-4 h-8 w-28 rounded-full bg-[#14110f]"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.8 }}
          />
        </div>
        <motion.div
          className="col-span-2 aspect-[4/5] rounded-xl bg-gradient-to-br from-[#ff9a4d] to-[#c4561a]"
          initial={{ scale: 0.6, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
        />
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`h-16 rounded-lg bg-black/[0.06] ${i === 0 ? "col-span-2" : i === 1 ? "col-span-2" : "col-span-1"}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 + i * 0.1, duration: 0.8, ease: EASE }}
          />
        ))}
      </div>
    </div>
  );
}

function SoftwareVisual() {
  const layers = [
    { label: "Interface", c: "bg-ember text-ink" },
    { label: "Business logic & APIs", c: "bg-[#2a221d] text-cream" },
    { label: "Data & cloud", c: "bg-[#1c1815] text-cream/80" },
  ];
  return (
    <div className="relative h-[340px] w-full max-w-[460px] [perspective:1200px]">
      {layers.map((l, i) => (
        <motion.div
          key={l.label}
          className={`absolute inset-x-0 mx-auto flex h-[150px] w-[88%] items-end rounded-2xl border border-cream/10 p-5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] ${l.c}`}
          style={{ top: 20 + i * 70, zIndex: 3 - i, transformStyle: "preserve-3d" }}
          initial={{ rotateX: 55, rotateZ: -35, y: 80, opacity: 0 }}
          whileInView={{ rotateX: 55, rotateZ: -35, y: 0, opacity: 1 }}
          whileHover={{ y: -14 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: i * 0.15, ease: EASE }}
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.2em]">{l.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

function MobileVisual() {
  return (
    <div className="flex items-end justify-center gap-6">
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className="relative aspect-[9/19] w-[150px] rounded-[2rem] bg-[#0d0b0a] p-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.75)] ring-1 ring-cream/10 md:w-[180px]"
          initial={{ y: 80, rotate: i ? 8 : -8, opacity: 0 }}
          whileInView={{ y: i ? -10 : 20, rotate: i ? 4 : -5, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.3, delay: i * 0.15, ease: EASE }}
        >
          <div className="absolute left-1/2 top-3 z-10 h-4 w-14 -translate-x-1/2 rounded-full bg-black" />
          <div className={`flex h-full flex-col gap-2 overflow-hidden rounded-[1.6rem] p-3 pt-10 ${i ? "bg-[#14110f]" : "bg-[#f4ede3]"}`}>
            {i === 0 ? (
              <>
                <span className="text-[10px] font-semibold text-black/50">Good morning</span>
                <span className="text-base font-extrabold leading-tight text-[#14110f]">Today&apos;s plan</span>
                <div className="flex aspect-square items-center justify-center rounded-2xl bg-ember">
                  <div className="h-1/2 w-1/2 rounded-full border-[6px] border-black/80 border-r-transparent" />
                </div>
                <div className="h-8 rounded-xl bg-black/[0.06]" />
                <div className="h-8 rounded-xl bg-black/[0.06]" />
              </>
            ) : (
              <>
                <span className="text-[10px] font-semibold text-white/50">Revenue</span>
                <span className="text-xl font-extrabold text-cream">$12,480</span>
                <div className="mt-2 flex h-20 items-end gap-1">
                  {[30, 50, 40, 70, 55, 85, 95].map((h, k) => (
                    <motion.i
                      key={k}
                      className="flex-1 rounded-sm"
                      style={{ background: k === 6 ? "#ff7a1a" : "rgba(255,255,255,0.15)" }}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.6 + k * 0.06, ease: EASE }}
                    />
                  ))}
                </div>
                <div className="mt-auto grid grid-cols-2 gap-2">
                  <div className="h-9 rounded-xl bg-ember" />
                  <div className="h-9 rounded-xl bg-white/10" />
                </div>
              </>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function MarketingVisual() {
  return (
    <div className="w-full max-w-[500px] rounded-2xl border border-cream/10 bg-[#1a1613] p-6 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.7)]">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">Organic traffic</span>
        <span className="rounded-full bg-ember/15 px-3 py-1 font-mono text-[11px] text-amber">SEO · Social · Ads</span>
      </div>
      <svg viewBox="0 0 400 180" className="h-auto w-full" aria-hidden>
        <defs>
          <linearGradient id="svc-mkt" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#ff7a1a" stopOpacity="0.4" />
            <stop offset="1" stopColor="#ff7a1a" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[40, 80, 120, 160].map((y) => (
          <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="rgba(242,235,225,0.06)" />
        ))}
        <motion.path
          d="M0 160 L50 150 L100 152 L150 128 L200 120 L250 92 L300 80 L350 44 L400 20 L400 180 L0 180 Z"
          fill="url(#svc-mkt)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
        />
        <motion.path
          d="M0 160 L50 150 L100 152 L150 128 L200 120 L250 92 L300 80 L350 44 L400 20"
          fill="none"
          stroke="#ff7a1a"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: EASE }}
        />
        <motion.circle
          cx="400"
          cy="20"
          r="6"
          fill="#ff7a1a"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.7, type: "spring" }}
        />
      </svg>
    </div>
  );
}

const SERVICES: Service[] = [
  {
    title: "Web Development",
    lead: "Websites that work as hard as you do.",
    text: "Modern responsive websites that create powerful online presence.",
    deliverables: ["Marketing sites", "E-commerce", "Web apps", "CMS & SEO"],
    Visual: WebVisual,
  },
  {
    title: "Software Development",
    lead: "Tools shaped around how you work.",
    text: "Custom software solutions built around business needs.",
    deliverables: ["SaaS platforms", "ERP & CRM", "APIs & integrations", "Cloud & DevOps"],
    Visual: SoftwareVisual,
  },
  {
    title: "Mobile Apps",
    lead: "In your customers' pockets.",
    text: "Beautiful mobile experiences for Android and iOS.",
    deliverables: ["iOS & Android", "React Native", "Flutter", "App Store launch"],
    Visual: MobileVisual,
  },
  {
    title: "Digital Marketing",
    lead: "Get found. Get chosen.",
    text: "Strategies that help businesses grow online.",
    deliverables: ["SEO", "Social media", "Paid campaigns", "Analytics"],
    Visual: MarketingVisual,
  },
];

/* ------------------------------ Section ------------------------------ */

export default function Services() {
  const list = useRef<HTMLDivElement>(null);

  // Desktop: cards pin and stack; each one recedes as the next slides over it.
  useIsomorphicLayoutEffect(() => {
    const el = list.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-service-card]", el);
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card.querySelector("[data-service-inner]"), {
          scale: 0.92,
          opacity: 0.35,
          filter: "blur(2px)",
          ease: "none",
          scrollTrigger: { trigger: next, start: "top 85%", end: "top 15%", scrub: true },
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="services" className="relative bg-ink py-[clamp(6rem,14vw,12rem)]">
      <div className="container-x">
        <SectionHeading
          index="01"
          label="Services"
          title={[
            "Four crafts,",
            <>
              one <Serif>workshop.</Serif>
            </>,
          ]}
          intro="From the first line of code to the first thousand customers. Everything your business needs to grow online, under one roof."
        />

        <div ref={list} className="mt-16 flex flex-col gap-6 md:mt-28 lg:gap-0">
          {SERVICES.map((s, i) => (
            <article
              key={s.title}
              data-service-card
              className="lg:sticky lg:mb-[10vh] lg:h-[78vh] lg:min-h-[560px] lg:last:mb-0"
              style={{ top: `calc(10vh + ${i * 22}px)` }}
            >
              <div
                data-service-inner
                className="group/card relative grid h-full origin-top overflow-hidden rounded-[32px] border border-cream/10 bg-coal will-change-transform lg:grid-cols-2"
                onPointerMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                  style={{ background: "radial-gradient(520px circle at var(--mx,50%) var(--my,50%), rgba(255,122,26,0.12), transparent 60%)" }}
                />
                <div className="relative flex flex-col p-8 md:p-12 lg:p-14">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-ember">0{i + 1}</span>
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-mute">
                      {String(i + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-10 text-[clamp(2.4rem,4.6vw,4.8rem)] font-extrabold leading-[0.92] tracking-[-0.04em] lg:mt-auto">
                    {s.title}
                  </h3>
                  <p className="mt-5 font-serif text-[clamp(1.4rem,2vw,2rem)] italic leading-tight text-amber">{s.lead}</p>
                  <p className="mt-4 max-w-md text-lg text-mute">{s.text}</p>
                  <ul className="mt-8 grid max-w-md grid-cols-2 gap-x-6 gap-y-3 border-t border-cream/10 pt-6">
                    {s.deliverables.map((d) => (
                      <li key={d} className="flex items-center gap-2 text-sm text-cream/80">
                        <span className="h-1 w-1 rounded-full bg-ember" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10">
                    <MagneticButton href="#contact" variant="ghost">
                      Start a {s.title.split(" ")[0].toLowerCase()} project <Arrow />
                    </MagneticButton>
                  </div>
                </div>
                <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden border-t border-cream/10 bg-[radial-gradient(ellipse_at_center,rgba(255,122,26,0.14),transparent_65%)] p-8 lg:border-l lg:border-t-0">
                  <div aria-hidden className="blueprint absolute inset-0 opacity-70" />
                  <div className="relative flex w-full justify-center transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover/card:scale-[1.03]">
                    <s.Visual />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
