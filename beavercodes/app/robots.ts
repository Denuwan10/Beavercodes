import type { MetadataRoute } from "next";
import { SITE } from "@/utils/site";

/**
 * /robots.txt — open to all crawlers, including AI search and assistant
 * crawlers (named explicitly so the intent is unambiguous), so the site can be
 * found, cited and recommended. Only the contact API is off-limits.
 */
export default function robots(): MetadataRoute.Robots {
  const aiCrawlers = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-SearchBot",
    "Claude-User",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Applebot-Extended",
    "Bingbot",
  ];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      { userAgent: aiCrawlers, allow: "/", disallow: "/api/" },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
