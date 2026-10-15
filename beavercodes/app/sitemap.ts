import type { MetadataRoute } from "next";
import { SITE } from "@/utils/site";
import { PROJECTS } from "@/utils/projects";

/** /sitemap.xml — the home page (sections are #anchors) and each project page. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...PROJECTS.map((p) => ({
      url: `${SITE.url}/work/${p.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
