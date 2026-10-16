import US from "country-flag-icons/react/3x2/US";
import GB from "country-flag-icons/react/3x2/GB";
import SG from "country-flag-icons/react/3x2/SG";
import LK from "country-flag-icons/react/3x2/LK";
import AU from "country-flag-icons/react/3x2/AU";
import NZ from "country-flag-icons/react/3x2/NZ";
import IN from "country-flag-icons/react/3x2/IN";
import AE from "country-flag-icons/react/3x2/AE";
import CA from "country-flag-icons/react/3x2/CA";

/** Countries BeaverCodes has clients in (confirmed by BeaverCodes). */
const COUNTRIES = [
  { name: "USA", Flag: US },
  { name: "UK", Flag: GB },
  { name: "Singapore", Flag: SG },
  { name: "Sri Lanka", Flag: LK },
  { name: "Australia", Flag: AU },
  { name: "New Zealand", Flag: NZ },
  { name: "India", Flag: IN },
  { name: "UAE", Flag: AE },
  { name: "Canada", Flag: CA },
];

/**
 * "Trusted by clients in" — an endless, slowly moving strip of flags and
 * country names between Portfolio and Process.
 *
 * Pure CSS: two identical lists side by side, each sliding left by its own
 * width (the `marquee` keyframes), so the loop is seamless. Pauses on hover;
 * stands still for reduced-motion users. Flags are inline SVG (emoji flags
 * don't render on Windows). The second copy is hidden from screen readers.
 */
export default function Countries() {
  return (
    <section aria-labelledby="countries-title" className="relative overflow-hidden border-y border-cream/10 bg-ink py-[clamp(2.5rem,5vw,4rem)]">
      <div className="container-x mb-[clamp(1.5rem,3vw,2.25rem)]">
        <h2 id="countries-title" className="eyebrow flex items-center gap-3">
          <span className="h-px w-10 bg-ember/60" />
          Trusted by clients in
        </h2>
      </div>

      <div className="group flex w-max [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 || undefined}
            className="flex shrink-0 animate-[marquee_42s_linear_infinite] items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none"
          >
            {COUNTRIES.map(({ name, Flag }) => (
              <li key={name} className="flex items-center">
                <span className="flex items-center gap-3 px-6 md:gap-4 md:px-10">
                  <Flag
                    aria-hidden
                    className="h-6 w-9 shrink-0 rounded-[4px] shadow-[0_6px_18px_-6px_rgba(0,0,0,0.8)] ring-1 ring-white/15 md:h-8 md:w-12"
                  />
                  <span className="whitespace-nowrap text-xl font-bold tracking-tight text-cream/85 md:text-3xl">{name}</span>
                </span>
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ember/70" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
