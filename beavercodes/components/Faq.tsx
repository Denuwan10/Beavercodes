import { FAQ } from "@/utils/faq";

/**
 * FAQ — native <details> rows, so every answer is in the server HTML (readable
 * by search engines and AI crawlers without JavaScript) and the open/close
 * works with no script at all. The same list feeds the FAQPage JSON-LD.
 */
export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative bg-ink py-[clamp(4.5rem,9vw,8rem)]">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-8 flex items-center gap-3">
            <span className="text-ember">(05)</span>
            <span className="h-px w-10 bg-cream/20" />
            FAQ
          </p>
          <h2
            id="faq-title"
            className="text-[clamp(2.4rem,4.8vw,4.5rem)] font-extrabold leading-[0.98] tracking-[-0.04em]"
          >
            Questions, <em className="not-italic text-ember">answered.</em>
          </h2>
          <p className="mt-6 max-w-sm text-mute md:text-lg">
            The things businesses usually ask before we start. Anything else?{" "}
            <a href="#contact" className="text-cream underline underline-offset-4 hover:text-ember">
              Just ask.
            </a>
          </p>
        </div>

        <div className="border-t border-cream/10 lg:col-span-7">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group border-b border-cream/10">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold transition-colors hover:text-ember md:text-xl [&::-webkit-details-marker]:hidden">
                <h3 className="font-semibold">{q}</h3>
                <span
                  aria-hidden
                  className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cream/15 transition-[transform,border-color] duration-300 group-open:rotate-45 group-open:border-ember"
                >
                  <span className="absolute h-px w-3 bg-current" />
                  <span className="absolute h-3 w-px bg-current" />
                </span>
              </summary>
              <p className="max-w-2xl pb-6 pr-12 leading-relaxed text-mute">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
