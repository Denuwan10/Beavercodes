"use client";

import { useEffect, useRef } from "react";
import { experience, storyToProgress } from "@/utils/store";
import { range } from "@/utils/math";

const CHAPTERS = [
  { n: "01", label: "The Workshop", line: ["A builder", "at work."], from: 0.0, to: 0.25 },
  { n: "02", label: "The Craft", line: ["Every line,", "crafted."], from: 0.25, to: 0.5 },
  { n: "03", label: "Into the Build", line: ["Step", "inside."], from: 0.5, to: 0.7 },
];

/**
 * Story overlay for the pinned intro: chapter titles, a scroll cue and a
 * progress rail. Styles are written straight to the DOM on scroll — no React
 * renders in the hot path.
 */
export default function IntroHud() {
  const root = useRef<HTMLDivElement>(null);
  const cue = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const titles = useRef<Array<HTMLDivElement | null>>([]);
  const labels = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const update = () => {
      const { story: p, progress } = experience.get();
      if (root.current) {
        const o = 1 - range(p, 0.64, 0.72);
        root.current.style.opacity = String(o);
        root.current.style.visibility = o <= 0 ? "hidden" : "visible";
      }
      if (cue.current) cue.current.style.opacity = String(1 - range(progress, 0.01, 0.06));
      if (bar.current) bar.current.style.transform = `scaleX(${range(progress, 0, storyToProgress(0.8))})`;
      CHAPTERS.forEach((c, i) => {
        const fadeIn = i === 0 ? 1 : range(p, c.from, c.from + 0.05);
        const fadeOut = 1 - range(p, c.to - 0.05, c.to);
        const o = Math.min(fadeIn, fadeOut);
        const el = titles.current[i];
        if (el) {
          el.style.opacity = String(o);
          el.style.transform = `translate3d(0, ${(1 - fadeIn) * 40 - (1 - fadeOut) * 40}px, 0)`;
        }
        const lb = labels.current[i];
        if (lb) lb.style.opacity = p >= c.from && (p < c.to || i === CHAPTERS.length - 1) ? "1" : "0.3";
      });
    };
    update();
    return experience.subscribe(update);
  }, []);

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 z-10" aria-hidden>
      {/* Chapter titles */}
      <div className="absolute bottom-[18vh] left-[var(--gutter)] md:bottom-[16vh]">
        {CHAPTERS.map((c, i) => (
          <div
            key={c.n}
            ref={(el) => {
              titles.current[i] = el;
            }}
            className="absolute bottom-0 left-0 w-[80vw] max-w-[640px] opacity-0 will-change-transform"
          >
            <p className="eyebrow mb-4 text-ember">
              {c.n} — {c.label}
            </p>
            {/* Decorative intro captions: paragraphs, not headings, so they
                don't clutter the page outline search engines read. */}
            <p className="text-[clamp(2.6rem,6.4vw,6rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-cream [text-shadow:0_4px_40px_rgba(0,0,0,0.6)]">
              {c.line[0]}
              <br />
              <em className="not-italic text-amber">{c.line[1]}</em>
            </p>
          </div>
        ))}
      </div>

      {/* Progress rail */}
      <div className="absolute bottom-8 left-[var(--gutter)] right-[var(--gutter)] flex items-center gap-6">
        <div className="hidden gap-6 md:flex">
          {CHAPTERS.map((c, i) => (
            <span
              key={c.n}
              ref={(el) => {
                labels.current[i] = el;
              }}
              className="eyebrow text-cream transition-opacity duration-500"
            >
              {c.n} {c.label}
            </span>
          ))}
        </div>
        <div className="relative h-px flex-1 bg-cream/15">
          <div ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-ember" />
        </div>
      </div>

      {/* Scroll cue */}
      <div ref={cue} className="absolute left-1/2 top-[calc(50%+min(28vh,260px))] flex -translate-x-1/2 flex-col items-center gap-3 md:top-auto md:bottom-20">
        <span className="flex h-10 w-6 justify-center rounded-full border border-cream/40 pt-2">
          <span className="h-2 w-[2px] animate-bounce rounded-full bg-ember" />
        </span>
        <span className="eyebrow text-cream/80">Scroll to enter the workshop</span>
      </div>

      {/* Vertical tagline */}
      <div className="absolute right-[var(--gutter)] top-1/2 hidden -translate-y-1/2 rotate-180 [writing-mode:vertical-rl] md:block">
        <span className="eyebrow">Build • Develop • Grow</span>
      </div>
    </div>
  );
}
