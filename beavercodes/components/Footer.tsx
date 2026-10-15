"use client";

import Logo from "./Logo";
import { CHANNELS, SocialIcon } from "./Socials";
import { useLenis } from "@/hooks/useLenis";


const NAV = [
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

/**
 * @param base prefix for the section links: "" on the home page (smooth
 *   in-page scroll), "/" on other pages (back to that section of the home page).
 */
export default function Footer({ base = "" }: { base?: string }) {
  const lenis = useLenis();
  return (
    <footer className="relative overflow-hidden bg-ink pt-12">
      {/* Big faint wordmark as a watermark behind the content, so the copyright
          row stays the last thing on the page.
          14.6vw: "BEAVERCODES" in Manrope ExtraBold is 6.54× its font size wide,
          so this fills ~95% of the width (vw includes the scrollbar).
          leading-[0.74] trims the line box to the caps so they sit flush. */}
      <p
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[3vw] select-none whitespace-nowrap text-center text-[14.6vw] font-extrabold leading-[0.74] tracking-[-0.06em] text-cream/[0.035]"
      >
        BEAVERCODES
      </p>
      <div className="container-x relative">
        <div className="grid gap-8 border-b border-cream/10 pb-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo className="[&_img]:h-14 [&>span]:text-2xl" />
            <p className="mt-4 max-w-xs text-mute">
              A digital workshop crafting websites, software, mobile apps and marketing that help businesses grow.
            </p>
          </div>
          <nav className="md:col-span-3" aria-label="Footer">
            <p className="eyebrow mb-4">Explore</p>
            <ul className="space-y-2">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a
                    // Other pages link back as "/?section=<id>" (not "/#id"),
                    // so the browser doesn't jump before the home intro is ready.
                    href={base ? `${base}?section=${n.href.slice(1)}` : n.href}
                    className="text-cream/80 transition-colors hover:text-ember"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-2">
            <p className="eyebrow mb-4">Follow</p>
            <ul className="space-y-2">
              {CHANNELS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-cream/80 transition-colors hover:text-ember"
                  >
                    <SocialIcon name={s.label} className="h-4 w-4" />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2 md:text-right">
            <button
              onClick={() => (lenis ? lenis.scrollTo(0, { duration: 3 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
              className="eyebrow inline-flex items-center gap-2 text-cream transition-colors hover:text-ember"
            >
              Back to the workshop ↑
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 py-6 text-sm text-mute md:flex-row">
          <p>© {new Date().getFullYear()} BeaverCodes. All rights reserved.</p>
          <p>Build • Develop • Grow</p>
        </div>
      </div>
    </footer>
  );
}
