"use client";

import { motion } from "framer-motion";
import ScrubText from "./ScrubText";

const PILLARS = [
  {
    title: "Creative Thinking",
    text: "Ideas shaped around your brand and your customers — never pulled from a template.",
    icon: "M12 3a6 6 0 0 0-3.5 10.9V17h7v-3.1A6 6 0 0 0 12 3zM9.5 20h5",
  },
  {
    title: "Modern Technology",
    text: "Fast, secure, future-ready stacks that scale as your business does.",
    icon: "M4 6h16v10H4zM2 19h20M9 10l-2 2 2 2M15 10l2 2-2 2",
  },
  {
    title: "Reliable Solutions",
    text: "Tested, documented and delivered on time — engineered to last, like a well-built dam.",
    icon: "M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6zM8.5 12l2.5 2.5 4.5-5",
  },
  {
    title: "Long-Term Partnership",
    text: "We stay after launch — supporting, improving and growing alongside you.",
    icon: "M7 11l3-3 3 2 4-4M3 12l4 4 3-1 3 3 2-1 6-6M17 6h4v4",
  },
];

export default function WhyUs() {
  return (
    <section id="why" className="relative bg-ink py-[clamp(6rem,14vw,12rem)]">
      <div className="container-x grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span className="text-ember">(03)</span>
              <span className="h-px w-10 bg-cream/20" />
              Why BeaverCodes
            </p>
            <ScrubText
              as="h2"
              text="More Than A Digital Agency."
              accent={["Digital"]}
              className="text-[clamp(2.6rem,6vw,6rem)] font-extrabold leading-[0.95] tracking-[-0.035em]"
            />
            <ScrubText
              text="Beavers are nature's engineers — patient, precise, and building structures that last for generations. That is exactly how we approach every product we touch."
              className="mt-10 max-w-lg text-lg leading-relaxed text-cream md:text-xl"
            />
          </div>
        </div>

        <ul className="lg:col-span-6 lg:col-start-7">
          {PILLARS.map((p, i) => (
            <motion.li
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 1, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group relative border-t border-cream/10 last:border-b"
              data-cursor="hover"
            >
              <div
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-ember transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-y-100"
              />
              <div className="relative flex gap-6 px-2 py-10 transition-colors duration-500 group-hover:text-ink md:gap-10 md:px-6 md:py-12">
                <span className="font-mono text-sm text-ember transition-colors duration-500 group-hover:text-ink">
                  0{i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-6">
                    <h3 className="text-2xl font-bold tracking-tight transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-2 md:text-4xl">
                      {p.title}
                    </h3>
                    <svg viewBox="0 0 24 24" className="h-8 w-8 shrink-0 text-mute transition-all duration-700 group-hover:rotate-[-8deg] group-hover:text-ink" aria-hidden>
                      <path d={p.icon} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="mt-3 max-w-md text-mute transition-colors duration-500 group-hover:text-ink/80">{p.text}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
