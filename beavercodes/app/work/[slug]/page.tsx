import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkHeader from "@/components/WorkHeader";
import Footer from "@/components/Footer";
import ProjectDetail from "@/components/ProjectDetail";
import { PROJECTS, getProject } from "@/utils/projects";
import { SITE, absoluteUrl } from "@/utils/site";

/**
 * Full project page — what you get opening /work/<slug> directly (a shared
 * link, a search result). From a portfolio card on the home page the same
 * content opens as an overlay instead (app/@modal/(.)work/[slug]).
 */
export const dynamicParams = false;
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  // Hand-written per project (utils/projects.ts); the layout template adds the brand.
  const title = p.metaTitle;
  const shareTitle = `${p.metaTitle} | ${SITE.name}`;
  const description = p.metaDescription;
  // 1200×630 JPEG: the share-preview size/format WhatsApp, Facebook, LinkedIn
  // and X all display reliably (WebP previews often don't show in WhatsApp).
  const image = { url: `/work/og/${p.slug}.jpg`, width: 1200, height: 630, alt: p.alt };
  return {
    title,
    description,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: {
      type: "article",
      url: `/work/${p.slug}`,
      siteName: SITE.name,
      locale: "en_US",
      title: shareTitle,
      description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: [image] },
  };
}

export default async function ProjectPage({ params }: Params) {
  const p = getProject((await params).slug);
  if (!p) notFound();

  // Project + breadcrumb structured data (rich results, AI assistants).
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${absoluteUrl(`/work/${p.slug}`)}#project`,
        name: `${p.title} — ${p.category}`,
        description: p.intro,
        url: absoluteUrl(`/work/${p.slug}`),
        image: absoluteUrl(`/work/${p.image}-${(p.widths ?? [800, 1600])[1]}.webp`),
        dateCreated: p.year,
        dateModified: p.updated,
        genre: p.industry,
        keywords: [...p.tags, ...p.stack.flatMap((s) => s.items)].join(", "),
        creator: { "@id": `${SITE.url}/#organization` },
        isPartOf: { "@id": `${SITE.url}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Work", item: absoluteUrl("/#portfolio") },
          { "@type": "ListItem", position: 3, name: p.title, item: absoluteUrl(`/work/${p.slug}`) },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <WorkHeader backHref={`/?work=${p.slug}`} />
      <main className="bg-ink pt-20">
        <ProjectDetail p={p} mode="page" />
      </main>
      <Footer base="/" />
    </>
  );
}
