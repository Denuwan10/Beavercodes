"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading, { Serif } from "./SectionHeading";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { cn } from "@/utils/math";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    n: "01",
    title: "Discover",
    text: "Understand business goals.",
    detail: "Workshops, research and a clear plan — we learn your customers, your market and what success looks like.",
  },
  {
    n: "02",
    title: "Design",
    text: "Create user experiences.",
    detail: "Wireframes, prototypes and a visual language that turns complex journeys into effortless ones.",
  },
  {
    n: "03",
    title: "Develop",
    text: "Build reliable solutions.",
    detail: "Clean, tested, scalable code shipped in short cycles, so you see real progress every week.",
  },
  {
    n: "04",
    title: "Grow",
    text: "Help businesses scale.",
    detail: "Launch, measure and iterate — performance, SEO and marketing that keep the momentum going.",
  },
];

export default function Process() {
  const list = useRef<HTMLOListElement>(null);
  const line = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = list.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        line.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 60%", end: "bottom 60%", scrub: 0.5 },
        },
      );
      el.querySelectorAll<HTMLElement>("[data-step]").forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 60%",
          end: "bottom 60%",
          toggleClass: { targets: step, className: "is-active" },
          onLeave: () => step.classList.add("is-passed"),
          onEnterBack: () => step.classList.remove("is-passed"),
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="process" className="relative overflow-hidden bg-coal py-[clamp(6rem,14vw,12rem)]">
      <div aria-hidden className="blueprint absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />
      <div className="container-x relative">
        <SectionHeading
          index="04"
          label="Process"
          title={[
            "How we",
            <>
              <Serif>build</Serif> together.
            </>,
          ]}
          intro="A simple, transparent process — four stages that take you from idea to growth without surprises."
        />

        <ol ref={list} className="relative mt-20 md:mt-28">
          {/* Track + animated progress line */}
          <div aria-hidden className="absolute bottom-0 left-[19px] top-0 w-px bg-cream/10 md:left-1/2">
            <div ref={line} className="h-full w-full origin-top bg-gradient-to-b from-ember to-amber" />
          </div>

          {STEPS.map((s, i) => {
            const right = i % 2 === 1;
            return (
              <li
                key={s.n}
                data-step
                className="group relative grid grid-cols-[40px_1fr] gap-6 pb-20 last:pb-0 md:grid-cols-2 md:gap-24 md:pb-32"
              >
                {/* Node */}
                <span
                  aria-hidden
                  className="absolute left-[19px] top-3 z-10 h-4 w-4 -translate-x-1/2 rounded-full border border-cream/30 bg-coal transition-all duration-700 group-[.is-active]:scale-125 group-[.is-active]:border-ember group-[.is-active]:bg-ember group-[.is-passed]:border-ember group-[.is-passed]:bg-ember md:left-1/2"
                >
                  <span className="absolute inset-[-8px] rounded-full bg-ember/30 opacity-0 blur-md transition-opacity duration-700 group-[.is-active]:opacity-100" />
                </span>

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-15% 0px" }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "col-start-2 md:col-start-auto",
                    right ? "md:col-start-2" : "md:text-right",
                  )}
                >
                  <span className="block font-sans text-[clamp(4rem,10vw,8.5rem)] font-extrabold leading-[0.8] tracking-tighter text-transparent transition-colors duration-700 [-webkit-text-stroke:1px_rgba(242,235,225,0.25)] group-[.is-active]:text-ember group-[.is-active]:[-webkit-text-stroke:0px] group-[.is-passed]:[-webkit-text-stroke:1px_rgba(255,122,26,0.6)]">
                    {s.n}
                  </span>
                  <h3 className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">{s.title}</h3>
                  <p className="mt-3 text-lg text-cream">{s.text}</p>
                  <p className={cn("mt-3 max-w-md text-mute", !right && "md:ml-auto")}>{s.detail}</p>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
