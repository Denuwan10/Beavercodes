/**
 * Service pages (/services/<slug>) — each one targets a single search intent
 * (e.g. "web development company in Sri Lanka") with specific, useful content
 * and its own FAQ. Shared by the pages, the sitemap, /llms.txt and the links
 * from the home page's Services section.
 *
 * Keep it honest and specific: Google rewards pages that genuinely answer what
 * the searcher wants to know.
 */

export type ServicePage = {
  slug: string;
  /** Short name used in links and breadcrumbs. */
  name: string;
  /** <title> (~50–60 characters, main keyword first). */
  metaTitle: string;
  /** Meta description (~150–160 characters). */
  metaDescription: string;
  /** Search phrases this page is written for (main one first). */
  keywords: string[];
  h1: string;
  intro: string;
  /** What we build: specific deliverables. */
  offers: { title: string; text: string }[];
  /** Why choose us for this service. */
  reasons: { title: string; text: string }[];
  process: { step: string; text: string }[];
  stack: string[];
  /** Portfolio projects to link to (slugs from utils/projects.ts). */
  related: string[];
  faq: { q: string; a: string }[];
};

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: "web-development",
    name: "Web Development",
    metaTitle: "Web Development Company in Sri Lanka | BeaverCodes",
    metaDescription:
      "Custom website design and development in Sri Lanka — fast, mobile-friendly business websites, e-commerce stores and web apps built with Next.js and SEO in mind.",
    keywords: [
      "web development company in Sri Lanka",
      "website design Sri Lanka",
      "website development Sri Lanka",
      "e-commerce website development Sri Lanka",
      "Next.js developers Sri Lanka",
      "3D interactive website design",
    ],
    h1: "Web design and development for businesses in Sri Lanka and worldwide",
    intro:
      "BeaverCodes designs and builds fast, modern websites that turn visitors into customers — from business websites and online stores to custom web apps. Every site is mobile-first, search-friendly from day one, and built on Next.js, the same technology used by many of the world's fastest websites.",
    offers: [
      { title: "Business websites", text: "A professional site that explains what you do, builds trust and makes it easy to get in touch — designed around your brand, not a template." },
      { title: "E-commerce stores", text: "Online shops with product pages that sell, secure checkout, payments and inventory, built on Shopify or fully custom." },
      { title: "Web applications", text: "Customer portals, dashboards and booking systems — anything your customers or team log in to use." },
      { title: "Interactive & 3D websites", text: "Immersive, animated experiences (like this site's 3D intro) that make a brand memorable — without sacrificing speed." },
      { title: "CMS-powered sites", text: "Update text, images, menus and blog posts yourself, with an easy content editor and no developer needed." },
      { title: "Redesigns & speed-ups", text: "Bring an outdated or slow website up to modern standards, keeping your search rankings intact." },
    ],
    reasons: [
      { title: "Fast by default", text: "Speed affects both sales and Google rankings. We build for great Core Web Vitals scores on real phones." },
      { title: "SEO built in", text: "Clean structure, page titles, structured data, sitemaps and share previews are part of every build, not an extra." },
      { title: "Mobile-first", text: "Most visitors arrive on a phone, so we design for the small screen first and scale up." },
      { title: "You own everything", text: "Your code, content and domain are yours, with no lock-in." },
    ],
    process: [
      { step: "Discover", text: "We learn your business, customers and goals, and agree on the pages and features that matter." },
      { step: "Design", text: "Wireframes and a visual design you approve before any code is written." },
      { step: "Develop", text: "We build, test on real devices and connect forms, analytics and your content." },
      { step: "Launch & grow", text: "We launch, submit the site to Google and keep improving it with real data." },
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Shopify", "Sanity CMS", "Vercel", "Google Analytics 4"],
    related: ["harlow", "beanory", "edupro"],
    faq: [
      { q: "How much does a website cost in Sri Lanka?", a: "It depends on the number of pages, features and integrations. A focused business website costs far less than an online store or custom web app. After a short call we send a clear, itemised estimate, so you know the price before work starts." },
      { q: "How long does it take to build a website?", a: "A business website usually takes a few weeks; online stores and web apps take longer. You get a realistic timeline with your estimate." },
      { q: "Will my website work well on mobile phones?", a: "Yes. Every site we build is designed mobile-first and tested on real phones and tablets." },
      { q: "Can you help my website rank on Google?", a: "Yes. Technical SEO is built into every site, and our digital marketing service covers ongoing SEO and content." },
    ],
  },
  {
    slug: "software-development",
    name: "Software Development",
    metaTitle: "Custom Software Development in Sri Lanka | BeaverCodes",
    metaDescription:
      "Custom software development in Sri Lanka — business systems, ERP and CRM, SaaS platforms, APIs and integrations built around how your business actually works.",
    keywords: [
      "custom software development Sri Lanka",
      "software development company in Sri Lanka",
      "ERP and CRM development",
      "SaaS development",
      "business automation software",
    ],
    h1: "Custom software development built around how your business works",
    intro:
      "Off-the-shelf software makes you change how you work. BeaverCodes builds custom software that fits your process instead — from internal business systems and dashboards to SaaS products and integrations that connect the tools you already use.",
    offers: [
      { title: "Business management systems", text: "Orders, inventory, staff, scheduling and reporting in one system, replacing spreadsheets and manual work." },
      { title: "ERP & CRM", text: "Track customers, sales, operations and finances in software shaped around your workflow." },
      { title: "SaaS platforms", text: "Subscription products with accounts, roles, billing and dashboards, ready to grow with your users." },
      { title: "APIs & integrations", text: "Connect payment gateways, accounting tools, couriers and other systems so data flows automatically." },
      { title: "Automation", text: "Turn repetitive tasks — reports, reminders, data entry — into processes that run themselves." },
      { title: "Cloud & DevOps", text: "Secure hosting, backups and deployment pipelines so your software stays fast and reliable." },
    ],
    reasons: [
      { title: "Built for your process", text: "We map how your team really works before designing anything." },
      { title: "Secure by design", text: "Role-based access, encrypted data and regular backups as standard." },
      { title: "Scales with you", text: "Modern, well-documented architecture that's easy to extend as you grow." },
      { title: "Clear communication", text: "Plain language, short delivery cycles and a team you can reach." },
    ],
    process: [
      { step: "Discover", text: "Workshops to map your processes, users and the problems worth solving first." },
      { step: "Design", text: "Data model, user flows and screens agreed before development." },
      { step: "Develop", text: "Built in short cycles with working software to review every week or two." },
      { step: "Launch & grow", text: "Deployment, training and ongoing improvements based on how people use it." },
    ],
    stack: ["Node.js", "NestJS", "React", "TypeScript", "PostgreSQL", "Prisma", "REST & GraphQL APIs", "AWS", "Docker"],
    related: ["edupro", "fingrow"],
    faq: [
      { q: "What is custom software development?", a: "Software designed and built specifically for your business, instead of adapting your work to an off-the-shelf product. You get exactly the features you need and own the result." },
      { q: "Can you connect our existing tools?", a: "Usually, yes. We build integrations with payment gateways, accounting software, couriers, CRMs and most systems that offer an API." },
      { q: "How is the cost of custom software estimated?", a: "By scope: the number of features, user roles and integrations. We start with a discovery session and then give a phased, itemised estimate." },
      { q: "Who owns the software?", a: "You do — the code and data belong to your business." },
    ],
  },
  {
    slug: "mobile-app-development",
    name: "Mobile App Development",
    metaTitle: "Mobile App Development Company in Sri Lanka | BeaverCodes",
    metaDescription:
      "iOS and Android app development in Sri Lanka — cross-platform apps with React Native and Flutter, from design and development to App Store and Google Play launch.",
    keywords: [
      "mobile app development company in Sri Lanka",
      "iOS and Android app development Sri Lanka",
      "React Native app developers",
      "Flutter app development",
      "app development for small businesses",
    ],
    h1: "iOS and Android app development, from idea to App Store",
    intro:
      "BeaverCodes designs and builds mobile apps that people enjoy using — for customers, for your team, or as a product in its own right. We build cross-platform apps with React Native or Flutter, so one codebase runs on both iPhone and Android, saving time and cost.",
    offers: [
      { title: "Customer apps", text: "Loyalty, ordering, booking and account apps that keep customers coming back." },
      { title: "Business & staff apps", text: "Scheduling, field service and internal tools your team uses every day." },
      { title: "Fintech & e-commerce apps", text: "Secure payments, wallets and shopping with biometric login." },
      { title: "App design (UI/UX)", text: "Simple, friendly flows designed and tested before development." },
      { title: "Backend & APIs", text: "The servers, databases and admin panels behind your app." },
      { title: "Launch & maintenance", text: "App Store and Google Play publishing, updates and support." },
    ],
    reasons: [
      { title: "One codebase, two platforms", text: "React Native and Flutter cut cost and time compared with two separate native apps." },
      { title: "Design that's easy to use", text: "Clear flows tested with real users before they're built." },
      { title: "Secure", text: "Biometric login, encrypted storage and secure APIs as standard." },
      { title: "Store-ready", text: "We handle the App Store and Google Play submission process." },
    ],
    process: [
      { step: "Discover", text: "Define your users, the core features for version one and what success looks like." },
      { step: "Design", text: "Clickable prototypes you can try on your phone before development." },
      { step: "Develop", text: "Built and tested on real iOS and Android devices." },
      { step: "Launch & grow", text: "Store release, analytics and regular updates based on feedback." },
    ],
    stack: ["React Native", "Expo", "Flutter", "TypeScript", "Node.js", "Firebase", "PostgreSQL", "App Store Connect", "Google Play Console"],
    related: ["fingrow"],
    faq: [
      { q: "Should I build for iOS or Android first?", a: "With cross-platform development you don't have to choose — one codebase launches on both. We'll help you decide which features belong in the first version." },
      { q: "How much does it cost to build an app?", a: "It depends on features, integrations and the backend required. After a discovery call we give an itemised estimate, often starting with a focused first version." },
      { q: "Do you publish the app to the stores?", a: "Yes. We prepare and submit your app to the Apple App Store and Google Play, and help with listings and screenshots." },
      { q: "Can you add features after launch?", a: "Yes. Most apps grow in versions; we plan updates based on what users actually use." },
    ],
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    metaTitle: "Digital Marketing & SEO in Sri Lanka | BeaverCodes",
    metaDescription:
      "Digital marketing in Sri Lanka — SEO, social media marketing, Google and Meta ads and analytics that bring more customers to your website.",
    keywords: [
      "digital marketing agency in Sri Lanka",
      "SEO services Sri Lanka",
      "social media marketing Sri Lanka",
      "Google Ads management",
      "local SEO",
    ],
    h1: "Digital marketing and SEO that bring real customers",
    intro:
      "A great website only works if people find it. BeaverCodes helps businesses get found and chosen online — with search engine optimisation, social media, paid ads and clear analytics that show what's working.",
    offers: [
      { title: "SEO (search engine optimisation)", text: "Technical fixes, keyword research and content that help you rank on Google for the searches your customers make." },
      { title: "Local SEO", text: "Google Business Profile, local listings and reviews so you appear in 'near me' and map searches." },
      { title: "Social media marketing", text: "Content and campaigns for Facebook, Instagram and TikTok that build an audience." },
      { title: "Paid advertising", text: "Google Ads and Meta ads managed for leads and sales, not just clicks." },
      { title: "Analytics & reporting", text: "Google Analytics 4 and Search Console set up properly, with simple monthly reports." },
      { title: "Conversion optimisation", text: "Improve pages and forms so more visitors become enquiries." },
    ],
    reasons: [
      { title: "Website + marketing in one team", text: "We can fix the site and run the campaigns, so nothing falls between agencies." },
      { title: "Measured results", text: "Every campaign is tracked to enquiries and sales." },
      { title: "Honest advice", text: "No vanity metrics — we focus on what grows your business." },
      { title: "Local knowledge", text: "Strategies for customers in Sri Lanka and international markets." },
    ],
    process: [
      { step: "Discover", text: "Audit your website, search visibility, competitors and current marketing." },
      { step: "Design", text: "A plan: target keywords, channels, content and budget." },
      { step: "Develop", text: "Fix the technical basics, create content and launch campaigns." },
      { step: "Grow", text: "Monthly reporting and continuous improvement." },
    ],
    stack: ["Google Search Console", "Google Analytics 4", "Google Ads", "Meta Ads", "Google Business Profile", "Ahrefs / Semrush"],
    related: ["beanory", "harlow"],
    faq: [
      { q: "How long does SEO take to work?", a: "SEO builds over time. Technical fixes can help within weeks, while competitive rankings usually take several months of consistent content and links." },
      { q: "Can you guarantee first place on Google?", a: "No honest agency can guarantee rankings — Google decides. What we guarantee is the work: a technically sound site, the right keywords, quality content and clear reporting." },
      { q: "Do you manage social media accounts?", a: "Yes — content planning, posting and paid campaigns on Facebook, Instagram and TikTok." },
      { q: "Do I need a new website for SEO?", a: "Not always. We start with an audit; sometimes improving the existing site is enough." },
    ],
  },
];

export const getServicePage = (slug: string) => SERVICE_PAGES.find((s) => s.slug === slug);
