"use client";

import { Fragment } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/utils/math";

type Props = {
  /** Each string is rendered as its own masked line. */
  lines: React.ReactNode[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** When provided, animation is controlled externally instead of on view. */
  show?: boolean;
};

const container: Variants = {
  hidden: {},
  show: (delay: number) => ({ transition: { staggerChildren: 0.09, delayChildren: delay } }),
};

const line: Variants = {
  // Starts far enough down that nothing peeks out of the (padded) mask.
  hidden: { y: "140%", rotate: 2.5 },
  show: { y: "0%", rotate: 0, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
};

/** Masked line-by-line text reveal. */
export default function RevealText({ lines, as = "h2", className, lineClassName, delay = 0, show }: Props) {
  // All motion text elements share the same prop surface; narrow to one for JSX.
  const Tag = motion[as] as typeof motion.h2;
  const controlled = show !== undefined;
  return (
    <Tag
      className={className}
      variants={container}
      custom={delay}
      initial="hidden"
      {...(controlled
        ? { animate: show ? "show" : "hidden" }
        : { whileInView: "show", viewport: { once: true, margin: "-12% 0px" } })}
    >
      {lines.map((l, i) => (
        // The mask needs room for the glyphs, not just the line box: tight
        // headline leading clipped ascenders (b, d, k, l) and descenders
        // (g, p, y). The negative margins keep the line spacing unchanged.
        // The trailing space doesn't render between block lines, but keeps
        // the words apart in the text crawlers read ("deserves a", not "deservesa").
        <Fragment key={i}>
          <span className="-mb-[0.26em] -mt-[0.14em] block overflow-hidden pb-[0.26em] pt-[0.14em]">
            <motion.span variants={line} className={cn("block origin-top-left will-change-transform", lineClassName)}>
              {l}
            </motion.span>
          </span>{" "}
        </Fragment>
      ))}
    </Tag>
  );
}
