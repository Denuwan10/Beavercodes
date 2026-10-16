/**
 * Business facts in one place, shared by the page metadata, the structured
 * data (JSON-LD), the sitemap/robots files and /llms.txt — so search engines
 * and AI assistants all read the same, consistent description.
 *
 * Set NEXT_PUBLIC_SITE_URL to the live domain (on Vercel: Project → Settings
 * → Environment Variables), without a trailing slash. The canonical host is
 * the apex domain; www redirects to it (next.config.ts).
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
  /** Verified figures (confirmed by BeaverCodes) — shown in the home hero. */
  stats: [
    { value: 50, suffix: "+", label: "Projects Delivered" },
    { value: 30, suffix: "+", label: "Happy Clients" },
    { value: 4, suffix: "", label: "Core Services" },
  ],
  /**
   * Social channels, shown in the footer and contact section. `profile: true`
   * marks a real profile page, published as Organization `sameAs`. The
   * Facebook link is a share link (it doesn't open for logged-out visitors),
   * so it stays a visible link only — replace it with the Page's own URL
   * (facebook.com/<page-name>) and set `profile: true` once known.
   */
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/share/1PzS3KuK2p/", profile: false },
    { label: "Instagram", href: "https://www.instagram.com/beavercodes", profile: true },
    { label: "TikTok", href: "https://www.tiktok.com/@beavercodes", profile: true },
  ],
  /**
   * Legal details for the privacy policy. `null` = not yet confirmed: the
   * policy leaves that row out. Never guess these.
   */
  legal: {
    name: null as string | null,
    address: null as string | null,
    /** Where privacy requests go — the verified business inbox. */
    privacyEmail: "hello@beavercodes.com",
  },
} as const;

/** Profile URLs for structured data (`sameAs`) — real profile pages only. */
export const SAME_AS = SITE.socials.filter((s) => s.profile).map((s) => s.href);

/** Markets served (structured data `areaServed`): worldwide, focus on these. */
export const AREA_SERVED = [
  { "@type": "Country", name: "Sri Lanka" },
  { "@type": "Country", name: "United States" },
  { "@type": "Country", name: "United Kingdom" },
  "Worldwide",
];

/** Default 1200×630 share card (app/opengraph-image.jpg) for pages without their own. */
export const SHARE_IMAGE = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "BeaverCodes logo: a beaver working on a laptop, with the BeaverCodes wordmark",
};

export const absoluteUrl = (path = "/") => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
