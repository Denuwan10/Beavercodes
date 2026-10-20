"use client";

import { motion } from "framer-motion";
import ScrubText from "./ScrubText";
import { SITE } from "@/utils/site";

const VALUES = [
  { k: "Craft", v: "Every pixel and function built with care." },
  { k: "Clarity", v: "Plain language, honest timelines, a team you can reach." },
  { k: "Impact", v: "Success measured by what changes for your business." },
];

/**
 * About — one compact block: the statement on the left, a short "why a
 * beaver" line and the three values on the right.
 */
export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-ink py-[clamp(4.5rem,9vw,8rem)]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-1/2 h-[60vh] w-[60vw] -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(255,122,26,0.12), transparent)" }}
      />
      <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          {/* The section's heading is the label (the statement below is a
              blockquote); the number stays outside it so it reads cleanly. */}
          <div className="eyebrow mb-8 flex items-center gap-3">
            <span className="text-ember">(04)</span>
            <span className="h-px w-10 bg-cream/20" />
            <h2>About BeaverCodes</h2>
          </div>
          <ScrubText
            as="blockquote"
            text="We combine creativity, technology and strategy to build digital solutions that create real business impact."
            accent={["creativity", "technology", "strategy", "impact"]}
            className="text-[clamp(1.9rem,3.6vw,3.4rem)] font-bold leading-[1.08] tracking-[-0.03em]"
          />
        </div>

        <motion.div
          className="lg:col-span-5 lg:pt-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-lg leading-relaxed text-mute">
            Like nature&apos;s original engineer, we plan before we build, choose the right materials, and make things that last.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-mute">
            {`${SITE.name}, also written as ${SITE.alternateName}, provides web development, custom software, mobile app development and digital marketing for businesses in ${SITE.country} and worldwide.`}
          </p>
          <dl className="mt-8">
            {VALUES.map((v) => (
              <div key={v.k} className="flex items-baseline gap-6 border-t border-cream/10 py-4 last:border-b">
                <dt className="eyebrow w-20 shrink-0 text-ember">{v.k}</dt>
                <dd className="text-cream/80">{v.v}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
