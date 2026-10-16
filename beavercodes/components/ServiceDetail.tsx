import Link from "next/link";
import MagneticButton, { Arrow } from "./MagneticButton";
import { SERVICE_PAGES, type ServicePage } from "@/utils/services";
import { PROJECTS } from "@/utils/projects";
import { SITE } from "@/utils/site";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow mb-5 flex items-center gap-3">
      <span className="h-px w-10 bg-ember/60" />
      {children}
    </p>
  );
}

/**
 * Everything on one service page — shared by the full page (/services/<slug>,
 * opened directly or from another page) and the overlay that opens over the
 * home page from its footer or Services section (app/@modal).
 *
 * mode "page":    links go to other pages ("/?section=contact" etc.).
 * mode "overlay": "#contact" closes the overlay and scrolls the home page
 *                 underneath; other services swap in place; related work opens
 *                 the project overlay, so Back steps return here, then home.
 */
export default function ServiceDetail({ s, mode }: { s: ServicePage; mode: "page" | "overlay" }) {
  const overlay = mode === "overlay";
  const related = s.related.map((slug) => PROJECTS.find((p) => p.slug === slug)).filter((p) => !!p);
  const others = SERVICE_PAGES.filter((x) => x.slug !== s.slug);
  const contactHref = overlay ? "#contact" : "/?section=contact";
  const TitleTag = overlay ? "h2" : "h1";

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="container-x pb-14 pt-12 md:pb-20 md:pt-16">
        {!overlay && (
          <nav aria-label="Breadcrumb" className="mb-10 font-mono text-xs uppercase tracking-[0.16em] text-mute">
            <ol className="flex flex-wrap items-center gap-2">
              <li><a href="/" className="hover:text-cream">Home</a></li>
              <li aria-hidden>/</li>
              <li><a href="/?section=services" className="hover:text-cream">Services</a></li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-cream">{s.name}</li>
            </ol>
          </nav>
        )}
        <Eyebrow>{s.name}</Eyebrow>
        <TitleTag
          id={overlay ? "service-title" : undefined}
          className="max-w-5xl text-[clamp(2.4rem,5.6vw,5.2rem)] font-extrabold leading-[1] tracking-[-0.04em]"
        >
          {s.h1}
        </TitleTag>
        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-mute md:text-xl">{s.intro}</p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="text-cream/80 underline-offset-4 hover:text-ember hover:underline">
            WhatsApp {SITE.phone}
          </a>
        </div>
      </section>

      {/* ---------- What we build ---------- */}
      <section className="bg-coal py-[clamp(3.5rem,7vw,6rem)]">
        <div className="container-x">
          <Eyebrow>What we build</Eyebrow>
          <h2 className="max-w-3xl text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
            {s.name} services
          </h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {s.offers.map((o, i) => (
              <li key={o.title} className="rounded-[20px] border border-cream/10 bg-ink/60 p-6 md:p-7">
                <span className="font-mono text-xs text-ember">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-xl font-bold tracking-tight">{o.title}</h3>
                <p className="mt-2 leading-relaxed text-mute">{o.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Why us + process ---------- */}
      <section className="container-x grid gap-14 py-[clamp(3.5rem,7vw,6rem)] lg:grid-cols-2 lg:gap-20">
        <div>
          <Eyebrow>Why BeaverCodes</Eyebrow>
          <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">Why work with us</h2>
          <ul className="mt-10 space-y-6">
            {s.reasons.map((r) => (
              <li key={r.title} className="flex gap-4">
                <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ember/15 text-xs text-ember">✓</span>
                <div>
                  <h3 className="text-lg font-bold">{r.title}</h3>
                  <p className="mt-1 leading-relaxed text-mute">{r.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Eyebrow>How it works</Eyebrow>
          <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">Our process</h2>
          <ol className="mt-10">
            {s.process.map((p, i) => (
              <li key={p.step} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-cream/10 py-5 last:border-b">
                <span className="font-mono text-sm text-ember">0{i + 1}</span>
                <div>
                  <h3 className="text-lg font-bold">{p.step}</h3>
                  <p className="mt-1 leading-relaxed text-mute">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Technology ---------- */}
      <section className="border-t border-cream/10 py-[clamp(3rem,6vw,5rem)]">
        <div className="container-x">
          <Eyebrow>Technology</Eyebrow>
          <h2 className="text-[clamp(1.8rem,3.4vw,2.8rem)] font-extrabold tracking-[-0.03em]">Tools we use</h2>
          <ul className="mt-8 flex flex-wrap gap-2">
            {s.stack.map((t) => (
              <li key={t} className="rounded-full border border-cream/15 bg-cream/[0.03] px-3.5 py-1.5 text-sm text-cream/90">{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Related work ---------- */}
      {related.length > 0 && (
        <section className="bg-coal py-[clamp(3.5rem,7vw,6rem)]">
          <div className="container-x">
            <Eyebrow>Related work</Eyebrow>
            <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">Examples of our work</h2>
            <ul className="mt-10 grid gap-4 md:grid-cols-3">
              {related.map((p) => {
                const className = "group block h-full rounded-[20px] border border-cream/10 bg-ink/60 p-6 transition-colors hover:border-ember/50";
                const body = (
                  <>
                    <span className="eyebrow">{p.category}</span>
                    <span className="mt-2 block text-2xl font-extrabold tracking-tight transition-colors group-hover:text-ember">{p.title}</span>
                    <span className="mt-2 block text-mute">{p.summary}</span>
                  </>
                );
                return (
                  <li key={p.slug}>
                    {overlay ? (
                      // Opens the project overlay on top; Back returns to this service.
                      <Link href={`/work/${p.slug}`} scroll={false} className={className}>
                        {body}
                      </Link>
                    ) : (
                      <a href={`/work/${p.slug}`} className={className}>
                        {body}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- FAQ ---------- */}
      <section className="container-x grid gap-12 py-[clamp(3.5rem,7vw,6rem)] lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">{s.name} questions</h2>
        </div>
        <div className="border-t border-cream/10 lg:col-span-7">
          {s.faq.map(({ q, a }) => (
            <details key={q} className="group border-b border-cream/10">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold transition-colors hover:text-ember [&::-webkit-details-marker]:hidden">
                <h3 className="font-semibold">{q}</h3>
                <span aria-hidden className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cream/15 transition-[transform,border-color] duration-300 group-open:rotate-45 group-open:border-ember">
                  <span className="absolute h-px w-3 bg-current" />
                  <span className="absolute h-3 w-px bg-current" />
                </span>
              </summary>
              <p className="max-w-2xl pb-6 pr-12 leading-relaxed text-mute">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------- CTA + other services ---------- */}
      <section className="container-x pb-16">
        <div className="pop-card pop-card-fill relative overflow-hidden rounded-[32px] px-6 py-14 text-center md:px-12 md:py-20">
          <h2 className="mx-auto max-w-3xl text-[clamp(2rem,4.6vw,4rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
            Ready to start your <span className="text-ember">{s.name.toLowerCase()}</span> project?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-cream/75">
            Tell us about your business and goals. We&apos;ll reply with ideas, a plan and an honest estimate.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-6">
            <MagneticButton href={contactHref}>
              Start a project <Arrow />
            </MagneticButton>
            <a href={`mailto:${SITE.email}`} className="text-cream/80 underline-offset-4 hover:text-ember hover:underline">{SITE.email}</a>
          </div>
        </div>
        <nav aria-label="Other services" className="mt-12">
          <p className="eyebrow mb-4">Other services</p>
          <ul className="flex flex-wrap gap-3">
            {others.map((o) => {
              const className = "inline-flex rounded-full border border-cream/15 px-4 py-2 text-sm text-cream/85 transition-colors hover:border-ember hover:text-ember";
              return (
                <li key={o.slug}>
                  {overlay ? (
                    // Swap in place: no new history entry, so closing still returns home.
                    <Link href={`/services/${o.slug}`} replace scroll={false} className={className}>
                      {o.name}
                    </Link>
                  ) : (
                    <a href={`/services/${o.slug}`} className={className}>
                      {o.name}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </section>
    </>
  );
}
