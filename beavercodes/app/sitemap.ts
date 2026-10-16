import type { MetadataRoute } from "next";
import { SITE } from "@/utils/site";
import { PROJECTS } from "@/utils/projects";
import { SERVICE_PAGES } from "@/utils/services";

/** /sitemap.xml — the home page, each service page and each project page. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...SERVICE_PAGES.map((s) => ({
      url: `${SITE.url}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...PROJECTS.map((p) => ({
      url: `${SITE.url}/work/${p.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
