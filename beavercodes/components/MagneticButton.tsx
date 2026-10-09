"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/utils/math";

type Props = {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  strength?: number;
  className?: string;
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

/**
 * A button that leans toward the cursor, with an inner label that leans a
 * little further for depth, plus a liquid fill on hover.
 */
export default function MagneticButton({
  children,
  variant = "primary",
  strength = 0.35,
  className,
  href,
  type = "button",
  disabled,
  onClick,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 });
  const lx = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const ly = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
    lx.set(dx * strength * 0.35);
    ly.set(dy * strength * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
    lx.set(0);
    ly.set(0);
  };

  const base =
    "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-4 text-sm font-semibold tracking-wide transition-colors duration-500 disabled:opacity-60";
  const styles =
    variant === "primary"
      ? "bg-ember text-ink"
      : "border border-cream/20 text-cream hover:border-cream/60";
  const fill = variant === "primary" ? "bg-cream" : "bg-cream";

  const inner = (
    <>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 translate-y-full rounded-[50%_50%_0_0] transition-[transform,border-radius] duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:rounded-none",
          fill,
        )}
      />
      <motion.span
        style={{ x: lx, y: ly }}
        className={cn(
          "relative z-10 flex items-center gap-3 transition-colors duration-500",
          variant === "ghost" && "group-hover:text-ink",
        )}
      >
        {children}
      </motion.span>
    </>
  );

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={cn("inline-block", className)}
    >
      {href ? (
        <a href={href} onClick={onClick} className={cn(base, styles)} data-cursor="hover">
          {inner}
        </a>
      ) : (
        <button type={type} disabled={disabled} onClick={onClick} className={cn(base, styles)} data-cursor="hover">
          {inner}
        </button>
      )}
    </motion.div>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("h-4 w-4", className)} aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
