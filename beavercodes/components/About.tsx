"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrubText from "./ScrubText";
import { LogoMark } from "./Logo";
import { OptionalImage, OptionalVideo } from "./OptionalMedia";
import { BRAND_MEDIA } from "@/utils/assets";

const VALUES = [
  { k: "Craft", v: "Every pixel and every function is built with care — the way a beaver places every branch." },
  { k: "Clarity", v: "Plain language, honest timelines and a team you can actually reach." },
  { k: "Impact", v: "We measure success by what changes for your business, not by lines of code." },
];

function Marquee() {
  const row = ["Build", "Develop", "Grow"];
  const items = Array.from({ length: 4 }).flatMap(() => row);
  return (
    <div className="relative flex overflow-hidden border-y border-cream/10 py-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      {[0, 1].map((k) => (
        <div key={k} aria-hidden={k === 1} className="flex shrink-0 animate-[marquee_28s_linear_infinite] items-center">
          {items.map((w, i) => (
            <span key={i} className="flex items-center">
              <span
                className={
                  i % 3 === 1
                    ? "px-8 font-serif text-[clamp(3rem,8vw,7rem)] italic text-ember"
                    : "px-8 text-[clamp(3rem,8vw,7rem)] font-extrabold tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(242,235,225,0.5)]"
                }
              >
                {w}
              </span>
              <span className="text-[clamp(1.5rem,3vw,2.5rem)] text-ember">•</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section id="about" ref={ref} className="relative overflow-hidden bg-ink pt-[clamp(6rem,14vw,12rem)]">
      <motion.div
        aria-hidden
        style={{ y: glowY, background: "radial-gradient(closest-side, rgba(255,122,26,0.18), transparent)" }}
        className="pointer-events-none absolute left-1/2 top-1/4 h-[70vh] w-[90vw] -translate-x-1/2 rounded-full blur-[100px]"
      />
      <div className="container-x relative">
        <p className="eyebrow mb-10 flex items-center gap-3">
          <span className="text-ember">(05)</span>
          <span className="h-px w-10 bg-cream/20" />
          About BeaverCodes
        </p>
        <ScrubText
          as="blockquote"
          text="We combine creativity, technology and strategy to build digital solutions that create real business impact."
          accent={["creativity", "technology", "strategy", "impact"]}
          className="max-w-6xl text-[clamp(2rem,4.8vw,4.6rem)] font-bold leading-[1.05] tracking-[-0.03em]"
        />

        {/* Meet the builder — the BeaverCodes mascot (Higgsfield render when available) */}
        <div className="mt-24 grid items-center gap-12 lg:grid-cols-12">
          <motion.div
            className="relative aspect-square overflow-hidden rounded-[32px] border border-cream/10 bg-coal lg:col-span-5"
            initial={{ clipPath: "inset(18% 18% 18% 18% round 32px)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0% round 32px)" }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div aria-hidden className="blueprint absolute inset-0" />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: "radial-gradient(circle at 50% 60%, rgba(255,122,26,0.28), transparent 65%)" }}
            />
            {/* The logo mascot is always there; a mascot render (if one is added) covers it. */}
            <div className="absolute inset-0 flex items-center justify-center">
              <LogoMark className="w-[62%]" />
            </div>
            <OptionalImage
              src={BRAND_MEDIA.mascot}
              alt="The BeaverCodes mascot: a beaver developer in a charcoal hoodie, typing"
              className="relative h-full w-full object-cover"
            />
            {/* Showreel (if present) plays over the still */}
            <OptionalVideo src={BRAND_MEDIA.showreel} poster={BRAND_MEDIA.mascot} className="absolute inset-0 z-[1] h-full w-full object-cover" />
            <span className="absolute bottom-5 left-5 z-[2] rounded-full bg-ink/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-cream/80 backdrop-blur">
              The builder
            </span>
          </motion.div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow text-ember">Why a beaver?</p>
            <h3 className="mt-5 text-[clamp(2rem,3.6vw,3.4rem)] font-extrabold leading-[1] tracking-[-0.035em]">
              Nature&apos;s original engineer — and our <span className="font-serif font-normal italic text-ember">patron saint</span> of craft.
            </h3>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute">
              Beavers plan before they build, use exactly the right materials, and make structures that reshape whole landscapes and last for generations. That is the standard we hold every website, app and system to.
            </p>
          </div>
        </div>

        <div className="mt-24 grid gap-10 border-t border-cream/10 pt-12 md:grid-cols-3 md:gap-12">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.k}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="eyebrow text-ember">{v.k}</p>
              <p className="mt-4 text-lg leading-relaxed text-cream/80">{v.v}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="mt-[clamp(5rem,10vw,9rem)]">
        <Marquee />
      </div>
    </section>
  );
}
