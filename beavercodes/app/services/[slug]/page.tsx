import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkHeader from "@/components/WorkHeader";
import Footer from "@/components/Footer";
import ServiceDetail from "@/components/ServiceDetail";
import { SERVICE_PAGES, getServicePage } from "@/utils/services";
import { AREA_SERVED, SHARE_IMAGE, SITE, absoluteUrl } from "@/utils/site";

/** One static page per service, each written for its own search intent. */
export const dynamicParams = false;
export function generateStaticParams() {
  return SERVICE_PAGES.map((s) => ({ slug: s.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const s = getServicePage((await params).slug);
  if (!s) return {};
  return {
    // Absolute: the page title is already written with the brand at the end.
    title: { absolute: s.metaTitle },
    description: s.metaDescription,
    keywords: s.keywords,
    alternates: { canonical: `/services/${s.slug}` },
    // A page-level openGraph replaces the layout's, so the share image (the
    // site's 1200×630 brand card) is set here explicitly.
    openGraph: {
      type: "website",
      url: `/services/${s.slug}`,
      siteName: SITE.name,
      locale: "en_US",
      title: s.metaTitle,
      description: s.metaDescription,
      images: [SHARE_IMAGE],
    },
    twitter: { card: "summary_large_image", title: s.metaTitle, description: s.metaDescription, images: [SHARE_IMAGE] },
  };
}

/**
 * Full service page — what you get opening /services/<slug> directly (a
 * search result, a shared link, another page). From the home page's footer or
 * Services section the same content opens as an overlay instead
 * (app/@modal/(.)services/[slug]), so going back lands exactly where you were.
 */
export default async function ServicePage({ params }: Params) {
  const s = getServicePage((await params).slug);
  if (!s) notFound();
  const url = absoluteUrl(`/services/${s.slug}`);

  // Service + FAQ + breadcrumb structured data.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: s.name,
        serviceType: s.name,
        description: s.metaDescription,
        url,
        provider: { "@id": `${SITE.url}/#organization` },
        areaServed: AREA_SERVED,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: s.name,
          itemListElement: s.offers.map((o) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: o.title, description: o.text },
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: s.faq.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl("/#services") },
          { "@type": "ListItem", position: 3, name: s.name, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <WorkHeader backHref="/?section=services" backLabel="All services" />

      <main className="bg-ink pt-20">
        <ServiceDetail s={s} mode="page" />
      </main>

      <Footer base="/" />
    </>
  );
}
