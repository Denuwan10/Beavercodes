import { cn } from "@/utils/math";

/** Mascot artwork, trimmed to its bounds — width ÷ height. */
const MARK_RATIO = 661 / 395;

/**
 * BeaverCodes mascot mark (the beaver coding on a laptop). Size it with ONE
 * dimension class (e.g. `h-10`, or `w-1/2`); the other follows the artwork's
 * aspect ratio. Defaults to `h-8`. Source: public/brand/.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/beaver-mark.png"
      alt=""
      aria-hidden
      draggable={false}
      style={{ aspectRatio: MARK_RATIO }}
      className={cn("select-none object-contain", className ?? "h-8")}
    />
  );
}

/**
 * Mark + wordmark. The wordmark follows the logo ("Beaver" brown, "Codes"
 * second colour); "Codes" is cream rather than the logo's dark green so it
 * reads on the site's dark backgrounds.
 */
export default function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)} aria-label="BeaverCodes">
      <LogoMark className="h-9" />
      <span className="text-[1.15rem] font-extrabold tracking-[-0.02em]" aria-hidden>
        <span className="text-[#c9824f]">Beaver</span>
        <span className="text-cream">Codes</span>
      </span>
    </span>
  );
}
