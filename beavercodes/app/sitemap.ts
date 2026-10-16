import type { MetadataRoute } from "next";
import { SITE } from "@/utils/site";
import { PROJECTS } from "@/utils/projects";
import { SERVICE_PAGES } from "@/utils/services";
import { PRIVACY_UPDATED } from "@/utils/privacy";

/**
 * Last significant change to the home page's content. Like the `updated`
 * fields on services, projects and the privacy policy, bump it by hand only
 * when the page's content really changes — not on every deploy, or search
 * engines learn to ignore lastmod.
 */
const HOME_UPDATED = "2026-10-16";

/**
 * /sitemap.xml — canonical, indexable pages only: the home page, each service
 * page, each project page and the privacy policy. (About, Contact and FAQ are
 * sections of the home page, not separate URLs; ?section= links are duplicates.)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE.url}/`, lastModified: HOME_UPDATED, changeFrequency: "monthly", priority: 1 },
    ...SERVICE_PAGES.map((s) => ({
      url: `${SITE.url}/services/${s.slug}`,
      lastModified: s.updated,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...PROJECTS.map((p) => ({
      url: `${SITE.url}/work/${p.slug}`,
      lastModified: p.updated,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    { url: `${SITE.url}/privacy-policy`, lastModified: PRIVACY_UPDATED, changeFrequency: "yearly", priority: 0.3 },
  ];
}
