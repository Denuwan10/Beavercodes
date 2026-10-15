"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { cn } from "@/utils/math";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  text: string;
  /** Words (exact match, punctuation stripped) to render in the accent style. */
  accent?: string[];
  className?: string;
  as?: "p" | "h2" | "blockquote";
};

/** Words light up one by one as the paragraph scrolls through the viewport. */
export default function ScrubText({ text, accent = [], className, as: Tag = "p" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-word]"),
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 50%", scrub: 0.6 },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [text]);

  const words = text.split(" ");
  return (
    <div ref={ref}>
      <Tag className={cn(className)} aria-label={text}>
      {words.map((w, i) => {
        const clean = w.replace(/[^\w-]/g, "");
        const isAccent = accent.includes(clean);
        return (
          <span key={i} aria-hidden>
            <span data-word className={isAccent ? "text-ember" : undefined}>
              {w}
            </span>{" "}
          </span>
        );
      })}
      </Tag>
    </div>
  );
}
