/**
 * Business facts in one place, shared by the page metadata, the structured
 * data (JSON-LD), the sitemap/robots files and /llms.txt — so search engines
 * and AI assistants all read the same, consistent description.
 *
 * Set NEXT_PUBLIC_SITE_URL to the live domain (e.g. on Netlify:
 * Site configuration → Environment variables), without a trailing slash.
 */
export const SITE = {
  name: "BeaverCodes",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://beavercodes.com").replace(/\/+$/, ""),
  email: "hello@beavercodes.com",
  /** WhatsApp / phone, shown as written; the link uses digits only. */
  phone: "+94 74 077 3291",
  whatsapp: "https://wa.me/94740773291",
  tagline: "Build • Develop • Grow",
  /** Where the business is based / serves (local SEO). */
  country: "Sri Lanka",
  countryCode: "LK",
  /** ~150–160 characters: used as the meta description. */
  description:
    "Web development company in Sri Lanka building fast websites, custom software and iOS/Android apps, plus SEO and digital marketing that grow businesses.",
  /** A fuller, plain-language summary for AI assistants and rich results. */
  summary:
    "BeaverCodes is a web, software and mobile app development company based in Sri Lanka, working with businesses in Sri Lanka and worldwide. It designs and builds modern websites, e-commerce stores, custom business software and iOS/Android apps, and runs digital marketing — SEO, social media, paid campaigns and analytics. Every project follows the same four steps: Discover, Design, Develop and Grow.",
  keywords: [
    "web development company in Sri Lanka",
    "website design Sri Lanka",
    "software development company in Sri Lanka",
    "mobile app development Sri Lanka",
    "digital marketing agency Sri Lanka",
    "SEO services Sri Lanka",
    "e-commerce website development",
    "custom software development",
    "iOS and Android app development",
    "Next.js developers",
    "3D interactive websites",
    "BeaverCodes",
  ],
  services: [
    {
      name: "Web Development",
      description: "Modern, responsive websites that create a powerful online presence.",
      offers: ["Marketing sites", "E-commerce", "Web apps", "CMS & SEO"],
    },
    {
      name: "Software Development",
      description: "Custom software solutions built around business needs.",
      offers: ["SaaS platforms", "ERP & CRM", "APIs & integrations", "Cloud & DevOps"],
    },
    {
      name: "Mobile App Development",
      description: "Beautiful mobile experiences for Android and iOS.",
      offers: ["iOS & Android apps", "React Native", "Flutter", "App Store launch"],
    },
    {
      name: "Digital Marketing",
      description: "Strategies that help businesses grow online.",
      offers: ["SEO", "Social media", "Paid campaigns", "Analytics"],
    },
  ],
  process: [
    { name: "Discover", text: "Understand business goals." },
    { name: "Design", text: "Create user experiences." },
    { name: "Develop", text: "Build reliable solutions." },
    { name: "Grow", text: "Help businesses scale." },
  ],
  /**
   * Official social profiles — shown in the footer and contact section, and
   * published as `sameAs` links that tie the brand together for Google and AI
   * assistants. (Tracking parameters from the share links removed.)
   */
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/share/18d38m2u52/" },
    { label: "Instagram", href: "https://www.instagram.com/beavercodes" },
    { label: "TikTok", href: "https://www.tiktok.com/@beavercodes" },
  ],
} as const;

/** Profile URLs for structured data (`sameAs`). */
export const SAME_AS = SITE.socials.map((s) => s.href);

export const absoluteUrl = (path = "/") => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
