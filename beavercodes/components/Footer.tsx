"use client";

import Link from "next/link";
import Logo from "./Logo";
import { CHANNELS, SocialIcon } from "./Socials";
import { SITE } from "@/utils/site";
import { SERVICE_PAGES } from "@/utils/services";
import { useLenis } from "@/hooks/useLenis";
import CookieSettingsButton from "./CookieSettingsButton";
import { GA_ID } from "@/utils/consent";


const NAV = [
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
  { label: "FAQ", href: "#faq" },
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
          <div className="md:col-span-4">
            <Logo className="[&_img]:h-14 [&>span]:text-2xl" />
            <p className="mt-4 max-w-xs text-mute">
              A digital workshop crafting websites, software, mobile apps and marketing that help businesses grow.
            </p>
            <p className="mt-3 text-sm text-cream/70">Based in {SITE.country} · working with clients worldwide</p>
          </div>
          <nav className="md:col-span-2" aria-label="Footer">
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
              <li>
                <a href="/privacy-policy" className="text-cream/80 transition-colors hover:text-ember">
                  Privacy Policy
                </a>
              </li>
              {GA_ID && (
                <li>
                  <CookieSettingsButton className="text-cream/80 transition-colors hover:text-ember" />
                </li>
              )}
            </ul>
          </nav>
          <nav className="md:col-span-3" aria-label="Services">
            <p className="eyebrow mb-4">Services</p>
            <ul className="space-y-2">
              {SERVICE_PAGES.map((s) => (
                <li key={s.slug}>
                  {base ? (
                    <a href={`/services/${s.slug}`} className="text-cream/80 transition-colors hover:text-ember">
                      {s.name}
                    </a>
                  ) : (
                    // Home page: an in-app link, so the service opens as an
                    // overlay (app/@modal) and "All services" returns right here.
                    <Link href={`/services/${s.slug}`} scroll={false} className="text-cream/80 transition-colors hover:text-ember">
                      {s.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-3">
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
        </div>
        <div className="flex flex-col justify-between gap-4 py-6 text-sm text-mute md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} BeaverCodes. All rights reserved. · Build • Develop • Grow</p>
          <button
            onClick={() => (lenis ? lenis.scrollTo(0, { duration: 3 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
            className="eyebrow inline-flex items-center gap-2 self-start text-cream transition-colors hover:text-ember md:self-auto"
          >
            Back to the workshop ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
