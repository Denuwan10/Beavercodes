import Link from "next/link";
import ProjectShot from "./ProjectShot";
import MagneticButton, { Arrow } from "./MagneticButton";
import { PROJECTS, type Project } from "@/utils/projects";
import { SITE } from "@/utils/site";
import { SERVICE_PAGES } from "@/utils/services";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow mb-5 flex items-center gap-3">
      <span className="h-px w-10 bg-ember/60" />
      {children}
    </p>
  );
}

/**
 * Everything about one project — shared by the full page (/work/<slug>,
 * opened directly) and the overlay that opens over the home page from a
 * portfolio card.
 *
 * mode "page":    links go to other pages ("/?section=contact" etc.).
 * mode "overlay": "#section" links (the overlay closes, then scrolls the home
 *                 page underneath), and previous/next swap the overlay in place.
 */
export default function ProjectDetail({ p, mode }: { p: Project; mode: "page" | "overlay" }) {
  const overlay = mode === "overlay";
  const index = PROJECTS.indexOf(p);
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const contactHref = overlay ? "#contact" : "/?section=contact";
  const TitleTag = overlay ? "h2" : "h1";
  // Service pages that list this project as an example of their work.
  const services = SERVICE_PAGES.filter((s) => s.related.includes(p.slug));
  const pill =
    "inline-flex rounded-full border border-cream/15 px-4 py-2 text-sm text-cream/85 transition-colors hover:border-ember hover:text-ember";

  const facts: [string, string][] = [
    ["Industry", p.industry],
    ["Platforms", p.platforms.join(" · ")],
    ["Services", p.services.join(" · ")],
    ["Typical timeline", p.timeline],
    ["Year", p.year],
  ];

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="container-x pb-12 pt-12 md:pb-16 md:pt-16">
        {!overlay && (
          <nav aria-label="Breadcrumb" className="mb-10 font-mono text-xs uppercase tracking-[0.16em] text-mute">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <a href="/" className="hover:text-cream">Home</a>
              </li>
              <li aria-hidden>/</li>
              <li>
                <a href={`/?work=${p.slug}`} className="hover:text-cream">Work</a>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-cream">{p.title}</li>
            </ol>
          </nav>
        )}

        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-5 flex flex-wrap items-center gap-3">
              <span className="text-ember">{p.category}</span>
              <span className="h-px w-8 bg-cream/20" />
              {p.kind} · {p.year}
            </p>
            <TitleTag
              id={overlay ? "project-title" : undefined}
              className="text-[clamp(3rem,8vw,7rem)] font-extrabold leading-[0.92] tracking-[-0.045em]"
            >
              {p.title}
            </TitleTag>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-mute lg:col-span-5 lg:pb-3">{p.intro}</p>
        </div>

        <div
          className="pop-card relative mt-12 aspect-[4/3] overflow-hidden rounded-[28px] md:aspect-[16/9]"
          style={{ background: p.bg }}
        >
          <div aria-hidden className="blueprint absolute inset-0 opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center p-[5%]">
            <ProjectShot p={p} priority sizes="(min-width: 1440px) 1300px, 94vw" />
          </div>
        </div>

        {/* Quick facts */}
        <dl className="mt-10 grid gap-x-8 gap-y-6 border-y border-cream/10 py-8 sm:grid-cols-2 lg:grid-cols-5">
          {facts.map(([k, v]) => (
            <div key={k}>
              <dt className="eyebrow mb-2">{k}</dt>
              <dd className="text-cream/90">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------- Challenge & solution ---------- */}
      <section className="container-x grid gap-12 py-[clamp(3.5rem,7vw,6rem)] lg:grid-cols-2 lg:gap-20">
        <div>
          <Eyebrow>The challenge</Eyebrow>
          <h2 className="text-[clamp(1.8rem,3vw,2.6rem)] font-bold leading-tight tracking-tight">What needed solving</h2>
          <p className="mt-5 text-lg leading-relaxed text-mute">{p.challenge}</p>
        </div>
        <div>
          <Eyebrow>Our solution</Eyebrow>
          <h2 className="text-[clamp(1.8rem,3vw,2.6rem)] font-bold leading-tight tracking-tight">How we approached it</h2>
          <p className="mt-5 text-lg leading-relaxed text-mute">{p.solution}</p>
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section className="bg-coal py-[clamp(3.5rem,7vw,6rem)]">
        <div className="container-x">
          <Eyebrow>Key features</Eyebrow>
          <h2 className="max-w-2xl text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
            What&apos;s inside <span className="text-ember">{p.title}</span>
          </h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {p.features.map((f, i) => (
              <li key={f.title} className="rounded-[20px] border border-cream/10 bg-ink/60 p-6 md:p-7">
                <span className="font-mono text-xs text-ember">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-xl font-bold tracking-tight">{f.title}</h3>
                <p className="mt-2 leading-relaxed text-mute">{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Gallery ---------- */}
      <section className="container-x py-[clamp(3.5rem,7vw,6rem)]">
        <Eyebrow>Gallery</Eyebrow>
        <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">A closer look</h2>
        <div className="mt-12 columns-1 gap-6 md:columns-2 [&>figure]:mb-6">
          {p.gallery.map((img) => (
            <figure key={img.src} className="break-inside-avoid">
              <a
                href={img.src}
                target="_blank"
                rel="noopener"
                className="block overflow-hidden rounded-[20px] border border-cream/10 bg-coal transition-colors hover:border-ember/50"
                data-cursor="view"
                data-cursor-label="Open"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  width={img.w}
                  height={img.h}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full"
                />
              </a>
              <figcaption className="mt-3 text-sm text-mute">{img.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------- Technology stack ---------- */}
      <section className="border-t border-cream/10 py-[clamp(3.5rem,7vw,6rem)]">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>Technology</Eyebrow>
            <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">Built with</h2>
            <p className="mt-5 max-w-sm text-mute">
              Proven, modern tools chosen for speed, security and easy growth — no lock-in to anything exotic.
            </p>
          </div>
          <div className="space-y-6 lg:col-span-8">
            {p.stack.map((s) => (
              <div key={s.group} className="grid gap-3 border-b border-cream/10 pb-6 sm:grid-cols-[11rem_1fr]">
                <h3 className="eyebrow pt-1.5">{s.group}</h3>
                <ul className="flex flex-wrap gap-2">
                  {s.items.map((t) => (
                    <li key={t} className="rounded-full border border-cream/15 bg-cream/[0.03] px-3.5 py-1.5 text-sm text-cream/90">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Process & goals ---------- */}
      <section className="bg-coal py-[clamp(3.5rem,7vw,6rem)]">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow>How we built it</Eyebrow>
            <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">The process</h2>
            <ol className="mt-10">
              {p.process.map((s, i) => (
                <li key={s.step} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-cream/10 py-5 last:border-b">
                  <span className="font-mono text-sm text-ember">0{i + 1}</span>
                  <div>
                    <h3 className="text-lg font-bold">{s.step}</h3>
                    <p className="mt-1 leading-relaxed text-mute">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:col-span-5">
            <Eyebrow>Designed to</Eyebrow>
            <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">Project goals</h2>
            <ul className="mt-10 space-y-4">
              {p.goals.map((goal) => (
                <li key={goal} className="flex gap-3 text-lg leading-snug">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ember/15 text-xs text-ember">
                    ✓
                  </span>
                  {goal}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Call to action ---------- */}
      <section className="container-x py-[clamp(4rem,8vw,7rem)]">
        <div
          className="pop-card relative overflow-hidden rounded-[32px] px-6 py-14 text-center md:px-12 md:py-20"
          style={{ background: p.bg }}
        >
          <h2 className="mx-auto max-w-3xl text-[clamp(2rem,4.6vw,4rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
            Want something like <span className="text-ember">{p.title}</span> for your business?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-cream/75">
            Tell us where your business is and where you want it to go. We&apos;ll reply with ideas, a plan and an honest estimate.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-6">
            <MagneticButton href={contactHref}>
              Start a project <Arrow />
            </MagneticButton>
            <a href={`mailto:${SITE.email}`} className="text-cream/80 underline-offset-4 hover:text-ember hover:underline">
              {SITE.email}
            </a>
          </div>
        </div>
      </section>

      {/* ---------- The services behind it (same pills as the service pages) ---------- */}
      {services.length > 0 && (
        <nav aria-label="Related services" className="container-x pb-12">
          <p className="eyebrow mb-4">Services behind this project</p>
          <ul className="flex flex-wrap gap-3">
            {services.map((s) => (
              <li key={s.slug}>
                {overlay ? (
                  // Opens the service overlay; Back returns to this project.
                  <Link href={`/services/${s.slug}`} scroll={false} className={pill}>
                    {s.name}
                  </Link>
                ) : (
                  <a href={`/services/${s.slug}`} className={pill}>
                    {s.name}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* ---------- Previous / next ---------- */}
      <nav aria-label="More projects" className="container-x grid gap-4 pb-16 sm:grid-cols-2">
        {[
          { label: "Previous project", q: prev, align: "text-left" },
          { label: "Next project", q: next, align: "sm:text-right" },
        ].map(({ label, q, align }) => {
          const className = `group rounded-[20px] border border-cream/10 p-6 transition-colors hover:border-ember/50 ${align}`;
          const body = (
            <>
              <span className="eyebrow">{label}</span>
              <span className="mt-2 block text-2xl font-extrabold tracking-tight transition-colors group-hover:text-ember">
                {q.title}
              </span>
              <span className="mt-1 block text-sm text-mute">{q.category}</span>
            </>
          );
          return overlay ? (
            // In the overlay, swap projects in place — no new history entry, so
            // Back / close still return straight to the home page.
            <Link key={label} href={`/work/${q.slug}`} replace scroll={false} className={className}>
              {body}
            </Link>
          ) : (
            // On the full page, a plain page load (a soft link would open the overlay).
            <a key={label} href={`/work/${q.slug}`} className={className}>
              {body}
            </a>
          );
        })}
      </nav>
    </>
  );
}
