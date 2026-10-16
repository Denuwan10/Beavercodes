import { SITE, absoluteUrl } from "@/utils/site";
import { FAQ } from "@/utils/faq";
import { PROJECTS } from "@/utils/projects";
import { SERVICE_PAGES } from "@/utils/services";

/**
 * /llms.txt — a plain Markdown brief for AI assistants and answer engines
 * (the llmstxt.org convention): who BeaverCodes is, what it offers, how it
 * works and how to get in touch, in text they can quote without running the
 * site's JavaScript. Built from the same facts as the page and JSON-LD.
 */
export const dynamic = "force-static";

export function GET() {
  const body = `# ${SITE.name}

> ${SITE.summary}

- Website: ${absoluteUrl("/")}
- Email: ${SITE.email}
- Phone / WhatsApp: ${SITE.phone} (${SITE.whatsapp})
${SITE.socials.map((s) => `- ${s.label}: ${s.href}`).join("\n")}
- Tagline: ${SITE.tagline}
- Markets: worldwide, with a focus on Sri Lanka, the United States and the United Kingdom
- In numbers: ${SITE.stats.map((s) => `${s.value}${s.suffix} ${s.label.toLowerCase()}`).join(", ")}

## Services

${SERVICE_PAGES.map((s) => `- [${s.name}](${absoluteUrl(`/services/${s.slug}`)}): ${s.metaDescription} Includes: ${s.offers.map((o) => o.title).join(", ")}.`).join("\n")}

## How we work

${SITE.process.map((p, i) => `${i + 1}. **${p.name}** — ${p.text}`).join("\n")}

## Work (showcase projects)

${PROJECTS.map((p) => `- [${p.title}](${absoluteUrl(`/work/${p.slug}`)}) — ${p.category}. ${p.summary} Built with: ${p.stack.flatMap((s) => s.items).slice(0, 6).join(", ")}.`).join("\n")}

## Frequently asked questions

${FAQ.map(({ q, a }) => `### ${q}\n\n${a}`).join("\n\n")}

## Pages

- [Home](${absoluteUrl("/")}): services, sample work, process, about, contact and FAQ
- [Services](${absoluteUrl("/#services")})
- [Portfolio](${absoluteUrl("/#portfolio")})
- [About](${absoluteUrl("/#about")})
- [FAQ](${absoluteUrl("/#faq")})
- [Contact](${absoluteUrl("/#contact")})
- [Privacy Policy](${absoluteUrl("/privacy-policy")})
`;
  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
