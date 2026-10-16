"use client";

import { useEffect, useState } from "react";
import { animate, cubicBezier, motion } from "framer-motion";
import RevealText from "./RevealText";
import BeaverLook from "./BeaverLook";
import MagneticButton, { Arrow } from "./MagneticButton";

const STATS = [
  { value: 50, suffix: "+", label: "Projects Delivered" },
  { value: 30, suffix: "+", label: "Happy Clients" },
  { value: 4, suffix: "", label: "Core Services" },
];

function CountUp({ to, run, delay = 0 }: { to: number; run: boolean; delay?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) {
      setV(0);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.8,
      delay,
      ease: easeOutExpo,
      onUpdate: (n) => setV(Math.round(n)),
    });
    return () => controls.stop();
  }, [run, to, delay]);
  return <>{v}</>;
}

const easeOutExpo = cubicBezier(0.16, 1, 0.3, 1);

const fade = (show: boolean, delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: show ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
  transition: { duration: 1, delay: show ? delay : 0, ease: easeOutExpo },
});

/**
 * The real homepage hero. It is first seen *on the laptop display* inside the
 * 3D scene, then becomes the full page — same markup throughout.
 */
export default function LandingHero({ revealed }: { revealed: boolean }) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-ink text-cream">
      {/* Atmosphere — a single warm glow, nothing else competing with the type */}
      <div
        aria-hidden
        className="absolute -bottom-[35vh] -right-[20vw] h-[85vh] w-[75vw] rounded-full opacity-60 blur-[140px]"
        style={{ background: "radial-gradient(closest-side, rgba(255,122,26,0.4), rgba(255,122,26,0.06) 60%, transparent)" }}
      />

      <div className="container-x relative z-10 flex h-full w-full flex-col pb-[clamp(1.25rem,4vh,3rem)] pt-24 sm:pt-28">
        <div className="grid flex-1 items-center gap-y-6 lg:grid-cols-12 lg:gap-x-10">
          {/* The VR beaver: turns its head to follow the cursor */}
          <motion.div
            {...fade(revealed, 0.3)}
            className="mx-auto h-[min(20vh,12rem)] w-full max-w-[22rem] max-lg:[@media(max-height:700px)]:h-[15vh] lg:col-span-5 lg:mx-0 lg:h-[min(68vh,40rem)] lg:max-w-none"
          >
            <BeaverLook className="h-full w-full" />
          </motion.div>

          <div className="flex flex-col justify-center lg:col-span-7">
          <RevealText
            as="h1"
            show={revealed}
            delay={0.1}
            className="text-[clamp(2.4rem,4.4vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.04em]"
            lines={[
              "Your business deserves",
              <>
                a <em className="not-italic text-ember">stronger</em> digital future.
              </>,
            ]}
          />

          <motion.p
            {...fade(revealed, 0.45)}
            className="mt-[clamp(1.25rem,3.5vh,2.25rem)] max-w-[34ch] text-base leading-relaxed text-mute md:text-lg"
          >
            Web design, software and mobile app development in Sri Lanka, crafted to help your business grow.
          </motion.p>

          <motion.div {...fade(revealed, 0.6)} className="mt-[clamp(1.75rem,4.5vh,3rem)] flex flex-wrap items-center gap-x-8 gap-y-4">
            <MagneticButton href="#contact">
              Start a project <Arrow />
            </MagneticButton>
            <a
              href="#portfolio"
              data-cursor="hover"
              className="group inline-flex items-center gap-2 text-sm text-cream/70 transition-colors duration-300 hover:text-cream md:text-base"
            >
              View our work
              <span className="h-px w-6 bg-current transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:w-10" />
            </a>
          </motion.div>
          </div>
        </div>

        {/* Proof, kept quiet: one hairline row of small figures */}
        {/* Phones: one compact 3-column row (number above label) — wrapping onto
            two rows pushed the stats past the bottom of the screen. */}
        <motion.dl
          {...fade(revealed, 0.75)}
          className="hairline grid grid-cols-3 gap-3 border-t pt-4 sm:flex sm:flex-wrap sm:gap-x-10 sm:gap-y-3 sm:pt-5 md:gap-x-16"
        >
          {STATS.map((s, i) => (
            <div key={s.label} className="flex flex-col-reverse gap-1 sm:flex-row-reverse sm:items-baseline sm:justify-end sm:gap-3">
              <dt className="text-xs leading-tight text-mute sm:text-sm">{s.label}</dt>
              <dd className="text-xl font-semibold tabular-nums tracking-tight md:text-2xl">
                <CountUp to={s.value} run={revealed} delay={0.9 + i * 0.12} />
                <span className="text-ember">{s.suffix}</span>
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </div>
  );
}
