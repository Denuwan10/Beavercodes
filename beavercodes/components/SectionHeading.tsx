"use client";

import { motion } from "framer-motion";
import RevealText from "./RevealText";
import { cn } from "@/utils/math";

type Props = {
  index: string;
  label: string;
  title: React.ReactNode[];
  intro?: string;
  className?: string;
};

/** Consistent section opener: numbered eyebrow, masked headline, intro copy. */
export default function SectionHeading({ index, label, title, intro, className }: Props) {
  return (
    <div className={cn("grid gap-8 md:grid-cols-12 md:items-end", className)}>
      <div className={intro ? "md:col-span-8" : "md:col-span-12"}>
        <motion.p
          className="eyebrow mb-6 flex items-center gap-3"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-ember">({index})</span>
          <span className="h-px w-10 bg-cream/20" />
          {label}
        </motion.p>
        <RevealText
          lines={title}
          className="text-[clamp(2.8rem,7vw,7.5rem)] font-extrabold leading-[0.9] tracking-[-0.045em]"
        />
      </div>
      {intro && (
        <motion.p
          className="max-w-sm text-mute md:col-span-4 md:justify-self-end md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {intro}
        </motion.p>
      )}
    </div>
  );
}

export function Serif({ children }: { children: React.ReactNode }) {
  return <em className="font-serif font-normal italic tracking-[-0.01em] text-ember">{children}</em>;
}
