"use client";

import Logo from "./Logo";
import { useLenis } from "@/hooks/useLenis";

const SOCIALS = [
  { label: "LinkedIn", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "Behance", href: "#" },
];

const NAV = [
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const lenis = useLenis();
  return (
    <footer className="relative overflow-hidden bg-ink pt-24">
      <div className="container-x">
        <div className="grid gap-12 border-b border-cream/10 pb-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo className="[&_img]:h-14 [&>span]:text-2xl" />
            <p className="mt-6 max-w-xs text-mute">
              A digital workshop crafting websites, software, mobile apps and marketing that help businesses grow.
            </p>
          </div>
          <nav className="md:col-span-3" aria-label="Footer">
            <p className="eyebrow mb-5">Explore</p>
            <ul className="space-y-3">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-cream/80 transition-colors hover:text-ember">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-2">
            <p className="eyebrow mb-5">Follow</p>
            <ul className="space-y-3">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="text-cream/80 transition-colors hover:text-ember">
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
        <div className="flex flex-col justify-between gap-4 py-8 text-sm text-mute md:flex-row">
          <p>© {new Date().getFullYear()} BeaverCodes. All rights reserved.</p>
          <p>Build • Develop • Grow</p>
        </div>
      </div>
      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="translate-y-[18%] whitespace-nowrap text-center text-[19.5vw] font-extrabold leading-none tracking-[-0.06em] text-cream/[0.04]">
          BEAVERCODES
        </p>
      </div>
    </footer>
  );
}
