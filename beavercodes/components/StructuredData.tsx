import { AREA_SERVED, SAME_AS, SHARE_IMAGE, SITE, absoluteUrl } from "@/utils/site";
import { SERVICE_PAGES } from "@/utils/services";
import { FAQ } from "@/utils/faq";

/**
 * Schema.org JSON-LD for the home page, as one linked @graph:
 *   Organization                       — who BeaverCodes is, contact, services
 *   WebSite + WebPage                  — the site and this page
 *   FAQPage                            — the visible FAQ (answer engines)
 * Lets Google show rich results and gives AI assistants unambiguous facts.
 */
export default function StructuredData() {
  const org = `${SITE.url}/#organization`;
  const website = `${SITE.url}/#website`;

  const graph = [
    {
      // Organization only: no street address is published, so not a
      // LocalBusiness (or its subtypes, e.g. ProfessionalService).
      "@type": "Organization",
      "@id": org,
      name: SITE.name,
      alternateName: SITE.alternateName,
      url: absoluteUrl("/"),
      // The official mascot logo (429×256 PNG; Google needs ≥112×112).
      logo: {
        "@type": "ImageObject",
        "@id": `${SITE.url}/#logo`,
        url: absoluteUrl("/brand/beaver-mark.png"),
        contentUrl: absoluteUrl("/brand/beaver-mark.png"),
        width: 429,
        height: 256,
        caption: SITE.name,
      },
      image: absoluteUrl(SHARE_IMAGE.url),
      email: SITE.email,
      telephone: SITE.phone,
      slogan: SITE.tagline,
      description: SITE.summary,
      // Where the business is based (country only — the verified fact) and who it serves.
      address: { "@type": "PostalAddress", addressCountry: SITE.countryCode },
      areaServed: AREA_SERVED,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: SITE.email,
        telephone: SITE.phone,
        url: SITE.whatsapp,
        availableLanguage: ["English"],
      },
      knowsAbout: SITE.services.flatMap((s) => [s.name, ...s.offers]),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: SERVICE_PAGES.map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": `${absoluteUrl(`/services/${s.slug}`)}#service`,
            name: s.name,
            description: s.metaDescription,
            serviceType: s.name,
            url: absoluteUrl(`/services/${s.slug}`),
            provider: { "@id": org },
          },
        })),
      },
      sameAs: SAME_AS,
    },
    {
      "@type": "WebSite",
      "@id": website,
      url: absoluteUrl("/"),
      name: SITE.name,
      alternateName: SITE.alternateName,
      description: SITE.description,
      publisher: { "@id": org },
      inLanguage: "en",
    },
    {
      "@type": "WebPage",
      "@id": `${SITE.url}/#webpage`,
      url: absoluteUrl("/"),
      name: `${SITE.name} — ${SITE.tagline}`,
      description: SITE.description,
      isPartOf: { "@id": website },
      about: { "@id": org },
      inLanguage: "en",
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE.url}/#faq`,
      mainEntity: FAQ.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here; escape "<" so no string can close the tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c"),
      }}
    />
  );
}
