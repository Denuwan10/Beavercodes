import type { Metadata } from "next";
import WorkHeader from "@/components/WorkHeader";
import Footer from "@/components/Footer";
import MagneticButton, { Arrow } from "@/components/MagneticButton";
import { SERVICE_PAGES } from "@/utils/services";
import { homeSection } from "@/utils/site";

/**
 * Branded 404 for unknown URLs (served with HTTP 404 by Next.js; noindex).
 * Gives the visitor somewhere useful to go instead of a dead end.
 */
export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for doesn't exist or has moved.",
  robots: { index: false, follow: true },
  // Don't inherit the home page's canonical.
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <>
      <WorkHeader backHref="/" backLabel="Home" />
      <main className="bg-ink pt-20">
        <section className="container-x pb-20 pt-16 md:pt-24">
          <p className="eyebrow mb-5 flex items-center gap-3">
            <span className="text-ember">404</span>
            <span className="h-px w-10 bg-ember/60" />
            Page not found
          </p>
          <h1 className="max-w-4xl text-[clamp(2.4rem,5.6vw,5.2rem)] font-extrabold leading-[1] tracking-[-0.04em]">
            This page wandered off the <span className="text-ember">workshop</span> floor.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-mute md:text-xl">
            The page you were looking for doesn&apos;t exist or has moved. Try one of these instead.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <MagneticButton href="/">
              Back to the home page <Arrow />
            </MagneticButton>
            <a href={homeSection("contact")} className="text-cream/80 underline-offset-4 hover:text-ember hover:underline">
              Contact us
            </a>
          </div>

          <nav aria-label="Useful pages" className="mt-16 grid gap-10 border-t border-cream/10 pt-10 sm:grid-cols-2">
            <div>
              <p className="eyebrow mb-4">Services</p>
              <ul className="flex flex-wrap gap-3">
                {SERVICE_PAGES.map((s) => (
                  <li key={s.slug}>
                    <a
                      href={`/services/${s.slug}`}
                      className="inline-flex rounded-full border border-cream/15 px-4 py-2 text-sm text-cream/85 transition-colors hover:border-ember hover:text-ember"
                    >
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-4">Explore</p>
              <ul className="flex flex-wrap gap-3">
                {[
                  ["Portfolio", homeSection("portfolio")],
                  ["About", homeSection("about")],
                  ["FAQ", homeSection("faq")],
                ].map(([label, href]) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="inline-flex rounded-full border border-cream/15 px-4 py-2 text-sm text-cream/85 transition-colors hover:border-ember hover:text-ember"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </section>
      </main>
      <Footer base="/" />
    </>
  );
}
