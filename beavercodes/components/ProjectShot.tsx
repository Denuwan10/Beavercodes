import type { Project } from "@/utils/projects";
import { cn } from "@/utils/math";

/**
 * A project's main design shot, fitted inside its container at its own aspect
 * ratio. Framed shots get rounded corners and a card shadow; transparent
 * cut-outs (phones) float with a shadow that follows their shape.
 */
export default function ProjectShot({
  p,
  sizes = "(min-width: 1024px) 66vw, 92vw",
  priority,
  className,
}: {
  p: Project;
  sizes?: string;
  /** Above-the-fold image: load immediately instead of lazily. */
  priority?: boolean;
  className?: string;
}) {
  const [sm, lg] = p.widths ?? [800, 1600];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/work/${p.image}-${lg}.webp`}
      srcSet={`/work/${p.image}-${sm}.webp ${sm}w, /work/${p.image}-${lg}.webp ${lg}w`}
      sizes={sizes}
      alt={p.alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      draggable={false}
      className={cn(
        "block h-auto max-h-full w-auto max-w-full",
        p.cutout
          ? "[filter:drop-shadow(0_30px_40px_rgba(0,0,0,0.55))_drop-shadow(0_8px_12px_rgba(0,0,0,0.35))]"
          : "rounded-[14px] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)] ring-1 ring-white/10",
        className,
      )}
    />
  );
}
