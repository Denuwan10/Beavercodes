import { SAME_AS, SITE, absoluteUrl } from "@/utils/site";
import { FAQ } from "@/utils/faq";

/**
 * Schema.org JSON-LD for the home page, as one linked @graph:
 *   Organization / ProfessionalService — who BeaverCodes is, contact, services
 *   WebSite + WebPage                  — the site and this page
 *   FAQPage                            — the visible FAQ (answer engines)
 * Lets Google show rich results and gives AI assistants unambiguous facts.
 */
export default function StructuredData() {
  const org = `${SITE.url}/#organization`;
  const website = `${SITE.url}/#website`;

  const graph = [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": org,
      name: SITE.name,
      url: absoluteUrl("/"),
      logo: { "@type": "ImageObject", url: absoluteUrl("/brand/beaver-mark.png") },
      image: absoluteUrl("/opengraph-image.png"),
      email: SITE.email,
      telephone: SITE.phone.replace(/\s/g, ""),
      slogan: SITE.tagline,
      description: SITE.summary,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: SITE.email,
        telephone: SITE.phone.replace(/\s/g, ""),
        url: SITE.whatsapp,
        availableLanguage: ["English"],
      },
      knowsAbout: SITE.services.flatMap((s) => [s.name, ...s.offers]),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: SITE.services.map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: s.name,
            description: s.description,
            serviceType: s.name,
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
