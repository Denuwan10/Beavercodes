/**
 * Service pages (/services/<slug>) — each one targets a single search intent
 * (e.g. "web development company in Sri Lanka") with specific, useful content
 * and its own FAQ. Shared by the pages, the sitemap, /llms.txt and the links
 * from the home page's Services section.
 *
 * Keep it honest and specific: Google rewards pages that genuinely answer what
 * the searcher wants to know.
 */

/** An in-text link, rendered as its own sentence: before + link text + after. */
export type InlineLink = { before: string; text: string; href: string; after?: string };

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
  /** Hero illustration (public/services/<slug>-1200|720.webp, 4:3). */
  imageAlt: string;
  /** What we build: specific deliverables. */
  offers: { title: string; text: string; link?: InlineLink }[];
  /** Optional sentence under the "services" heading. */
  offersIntro?: string;
  /** Why choose us for this service. */
  reasons: { title: string; text: string; link?: InlineLink }[];
  /** Section headings written for this service's search intent (defaults are generic). */
  headings?: Partial<Record<"offers" | "reasons" | "process" | "stack" | "related" | "faq", string>>;
  process: { step: string; text: string }[];
  stack: string[];
  /** Portfolio projects to link to (slugs from utils/projects.ts). */
  related: string[];
  faq: { q: string; a: string }[];
  /** Last significant content change (sitemap lastmod), YYYY-MM-DD. */
  updated: string;
};

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: "web-development",
    name: "Web Development",
    updated: "2026-10-16",
    metaTitle: "Web Development Company in Sri Lanka & Worldwide | BeaverCodes",
    metaDescription:
      "BeaverCodes is a web development company in Sri Lanka building custom websites, e-commerce stores and web apps for clients worldwide. Request a quote.",
    /** Search phrases this page is written for (Phase 2 keyword map). */
    keywords: [
      "web development company",
      "web development services",
      "website development company",
      "custom web development",
      "web development company Sri Lanka",
      "web development services Sri Lanka",
    ],
    h1: "Web development company for businesses in Sri Lanka and worldwide",
    imageAlt: "A laptop and a smartphone showing the same responsive website design",
    intro:
      "BeaverCodes is a web development company based in Sri Lanka. We design and build fast, custom websites, online stores and web apps for businesses here and around the world — every one mobile-first, search-friendly from day one and built to turn visitors into enquiries.",
    headings: {
      offers: "Web development services we offer",
      reasons: "Why businesses choose BeaverCodes",
      process: "How we build your website",
      stack: "Technology we build with",
      related: "Web design and development examples",
      faq: "Web development FAQs",
    },
    offersIntro:
      "Every project is custom web development: designed around your brand, content and goals rather than a template, and built to grow with your business.",
    offers: [
      { title: "Business websites", text: "A professional site that explains what you do, builds trust and makes it easy to get in touch — designed around your brand, not a template." },
      { title: "E-commerce stores", text: "Online shops with product pages that sell, secure checkout, payments and inventory, built on Shopify or fully custom." },
      {
        title: "Web applications",
        text: "Customer portals, dashboards and booking systems — anything your customers or team log in to use.",
        link: { before: "For larger business systems, see our ", text: "custom software development", href: "/services/software-development", after: "." },
      },
      { title: "Interactive & 3D websites", text: "Immersive, animated experiences (like this site's 3D intro) that make a brand memorable — without sacrificing speed." },
      { title: "CMS-powered sites", text: "Update text, images, menus and blog posts yourself, with an easy content editor and no developer needed." },
      { title: "Redesigns & speed-ups", text: "Bring an outdated or slow website up to modern standards, keeping your search rankings intact." },
    ],
    reasons: [
      { title: "Fast by default", text: "Speed affects both sales and Google rankings. We build for great Core Web Vitals scores on real phones." },
      {
        title: "SEO built in",
        text: "Clean structure, page titles, structured data, sitemaps and share previews are part of every build, not an extra.",
        link: { before: "For ongoing rankings and content, add our ", text: "digital marketing and SEO", href: "/services/digital-marketing", after: " service." },
      },
      { title: "Mobile-first", text: "Most visitors arrive on a phone, so we design for the small screen first and scale up." },
      { title: "Clients in Sri Lanka and worldwide", text: "We work with businesses in Sri Lanka, the USA, the UK, Australia and beyond, with clear updates at every stage." },
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
      { q: "How much does website development cost in Sri Lanka?", a: "It depends on the number of pages, features and integrations. A focused business website costs far less than an online store or custom web app. After a short call we send a clear, itemised estimate, so you know the price before work starts." },
      { q: "How long does it take to build a website?", a: "A business website usually takes a few weeks; online stores and web apps take longer. You get a realistic timeline with your estimate." },
      { q: "Do you build custom websites or use templates?", a: "Custom. Each site is designed around your brand and content and built in code, which makes it faster and more flexible than a template. For online stores we can also build on Shopify when that suits you better." },
      { q: "Do you work with clients outside Sri Lanka?", a: "Yes. We're based in Sri Lanka and work with clients around the world, including the USA, the UK, Australia, Singapore, New Zealand, India, the UAE and Canada. Calls, design reviews and progress updates all happen online." },
      { q: "Can you redesign my existing website?", a: "Yes. We can bring an outdated or slow website up to modern standards while keeping your content and search rankings intact." },
      { q: "Can you help my website rank on Google?", a: "Yes. Technical SEO is built into every site, and our digital marketing service covers ongoing SEO and content." },
      { q: "Will my website work well on mobile phones?", a: "Yes. Every site we build is designed mobile-first and tested on real phones and tablets." },
    ],
  },
  {
    slug: "software-development",
    name: "Software Development",
    updated: "2026-10-16",
    metaTitle: "Custom Software Development Company in Sri Lanka | BeaverCodes",
    metaDescription:
      "Custom software development from Sri Lanka: ERP, CRM, integrations, automation and business dashboards for companies worldwide. Request a quote.",
    /** Search phrases this page is written for (Phase 2 keyword map). */
    keywords: [
      "custom software development",
      "custom software development company",
      "software development company",
      "software development services",
      "software development company Sri Lanka",
      "custom software development Sri Lanka",
    ],
    h1: "Custom software development built around how your business works",
    imageAlt: "Business software dashboards with charts, connected to databases",
    intro:
      "BeaverCodes is a software development company based in Sri Lanka, building custom software for businesses here and abroad. Off-the-shelf tools make you change how you work; we build systems that fit your process instead, from internal business systems and automation to integrations that connect the tools you already use.",
    headings: {
      offers: "What we build for your business",
      reasons: "What working with us looks like",
      process: "From workshop to working software",
      stack: "Our software stack",
      related: "Systems from our portfolio",
      faq: "Questions about custom software",
    },
    offersIntro:
      "Our software development services range from a single tool that removes a manual task to a full system your whole team runs on, always starting from how your business actually works.",
    offers: [
      { title: "Business management systems", text: "Orders, inventory, staff, scheduling and reporting in one system, replacing spreadsheets and manual work." },
      { title: "ERP & CRM", text: "Track customers, sales, operations and finances in software shaped around your workflow." },
      {
        title: "SaaS platforms",
        text: "Subscription products with accounts, roles, billing and dashboards, ready to grow with your users.",
        link: { before: "Need a marketing site for your product too? See ", text: "website development", href: "/services/web-development", after: "." },
      },
      {
        title: "APIs & integrations",
        text: "Connect payment gateways, accounting tools, couriers and other systems so data flows automatically.",
        link: { before: "Need an app for staff or customers on top? See ", text: "mobile app development", href: "/services/mobile-app-development", after: "." },
      },
      { title: "Automation", text: "Turn repetitive tasks — reports, reminders, data entry — into processes that run themselves." },
      { title: "Hosting & deployment", text: "Secure hosting and a reliable release setup, planned as part of the build so your software stays fast and available." },
    ],
    reasons: [
      { title: "Built for your process", text: "We map how your team really works before designing anything." },
      { title: "Security planned in", text: "Who can see what, how data is protected and how it is backed up are decided from the start, not added later." },
      { title: "Scales with you", text: "Modern, well-documented architecture that's easy to extend as you grow." },
      { title: "Clear communication", text: "Plain language, short delivery cycles and a team you can reach." },
    ],
    process: [
      { step: "Discover", text: "Workshops to map your processes, users and the problems worth solving first." },
      { step: "Design", text: "Data model, user flows and screens agreed before development." },
      { step: "Develop", text: "Built in short cycles, with working software for you to review along the way." },
      { step: "Launch & grow", text: "Deployment, handover and improvements based on how people actually use it." },
    ],
    stack: ["Node.js", "NestJS", "React", "TypeScript", "PostgreSQL", "Prisma", "REST & GraphQL APIs", "AWS", "Docker"],
    related: ["edupro", "fingrow"],
    faq: [
      { q: "What is custom software development?", a: "Software designed and built specifically for your business, instead of adapting your work to an off-the-shelf product. You get exactly the features you need and own the result." },
      { q: "When is custom software better than off-the-shelf tools?", a: "When your team works around the software instead of with it: copying data between tools, keeping key information in spreadsheets, or paying for features you don't use while missing the ones you need. Custom software fits your process and grows with it." },
      { q: "Can you connect our existing tools?", a: "Usually, yes. We build integrations with payment gateways, accounting software, couriers, CRMs and most systems that offer an API." },
      { q: "How is the cost of custom software estimated?", a: "By scope: the number of features, user roles and integrations. We start with a discovery session and then give a phased, itemised estimate." },
      { q: "Can a Sri Lanka-based team build software for a company abroad?", a: "Yes. We work with companies in Sri Lanka and overseas. Discovery workshops, demos and reviews all happen online, so your team can follow progress wherever it is." },
      { q: "Who owns the software and the data?", a: "You do. The code and the data belong to your business, with no lock-in." },
    ],
  },
  {
    slug: "mobile-app-development",
    name: "Mobile App Development",
    updated: "2026-10-16",
    metaTitle: "Mobile App Development in Sri Lanka | iOS & Android | BeaverCodes",
    metaDescription:
      "Mobile app development for iOS and Android. A Sri Lanka-based app development company building React Native and Flutter apps for clients worldwide.",
    /** Search phrases this page is written for (Phase 2 keyword map). */
    keywords: [
      "mobile app development",
      "mobile app development company",
      "mobile app development services",
      "app development company",
      "mobile app development company Sri Lanka",
      "mobile app development Sri Lanka",
    ],
    h1: "Mobile app development for iOS and Android, from idea to App Store",
    imageAlt: "Two smartphones showing a clean mobile app interface",
    intro:
      "BeaverCodes is a mobile app development company in Sri Lanka. We design and build apps people enjoy using, for your customers, your team or as a product of its own, and get them ready for the App Store and Google Play. With React Native or Flutter, one codebase runs on both iPhone and Android, saving time and cost.",
    headings: {
      offers: "Apps we design and build",
      reasons: "Why build your app with BeaverCodes",
      process: "How your app goes from idea to launch",
      stack: "App development tools",
      related: "App design and development example",
      faq: "Mobile app questions",
    },
    offersIntro:
      "Our mobile app development services cover the whole journey: what the first version should do, how it looks and feels, the backend behind it, and getting it ready for the stores.",
    offers: [
      { title: "Customer apps", text: "Loyalty, ordering, booking and account apps that keep customers coming back." },
      { title: "Business & staff apps", text: "Scheduling, field service and check-in apps your team carries in their pocket." },
      { title: "Fintech & e-commerce apps", text: "Payments, wallets and shopping, with security options such as biometric login." },
      { title: "App design (UI/UX)", text: "Simple, friendly screens and flows, designed and agreed before development." },
      {
        title: "Backend & APIs",
        text: "The servers, databases and admin panels behind your app.",
        link: { before: "For larger back-office systems, see our ", text: "custom software development", href: "/services/software-development", after: "." },
      },
      { title: "Launch & new versions", text: "Preparing builds and store listings for the App Store and Google Play, then new versions as your app grows." },
    ],
    reasons: [
      { title: "One codebase, two platforms", text: "React Native and Flutter cut cost and time compared with two separate native apps." },
      { title: "Design that's easy to use", text: "Clear flows designed around how people actually use their phones." },
      { title: "Security planned in", text: "Login, data storage and APIs are planned for each app, with biometric login and encryption where they're needed." },
      { title: "Store-ready", text: "We prepare your app for the App Store and Google Play review process." },
    ],
    process: [
      { step: "Discover", text: "Define your users, the core features for version one and what success looks like." },
      { step: "Design", text: "App screens and key flows designed and agreed before development starts." },
      { step: "Develop", text: "Built and tested on real iOS and Android devices." },
      { step: "Launch & grow", text: "Store release, analytics and new versions based on feedback." },
    ],
    stack: ["React Native", "Expo", "Flutter", "TypeScript", "Node.js", "Firebase", "PostgreSQL", "App Store Connect", "Google Play Console"],
    related: ["fingrow"],
    faq: [
      { q: "How much does mobile app development cost in Sri Lanka?", a: "It depends on features, integrations and the backend required. After a discovery call we give an itemised estimate, often starting with a focused first version." },
      { q: "How long does it take to build an app?", a: "It depends on the features, the backend and the integrations it needs. A focused first version is quicker to launch, and you get a realistic timeline with your estimate." },
      { q: "Should I build for iOS or Android first?", a: "With cross-platform development you don't have to choose — one codebase launches on both. We'll help you decide which features belong in the first version." },
      { q: "Cross-platform or native: which is right for my app?", a: "We build cross-platform apps with React Native or Flutter, which suit most business and customer apps and save time and cost. If your idea needs something cross-platform can't do well, we'll tell you before you commit." },
      { q: "Do you publish the app to the App Store and Google Play?", a: "Yes. We help prepare your builds, listing and screenshots and guide the app through Apple and Google's review." },
      { q: "Can you add features after launch?", a: "Yes. Most apps grow in versions; we plan updates based on what users actually use." },
      { q: "Can my app connect to my existing website or system?", a: "Usually, yes. Apps can connect to your website, online store or business software through APIs, so customers and staff see the same information everywhere." },
    ],
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    updated: "2026-10-16",
    metaTitle: "Digital Marketing Agency in Sri Lanka | SEO Services | BeaverCodes",
    metaDescription:
      "BeaverCodes is a digital marketing agency in Sri Lanka offering SEO services, social media, Google and Meta ads and analytics for businesses worldwide.",
    /** Search phrases this page is written for (Phase 2 keyword map). */
    keywords: [
      "digital marketing agency",
      "digital marketing services",
      "SEO services",
      "SEO company",
      "digital marketing agency Sri Lanka",
      "SEO services Sri Lanka",
    ],
    h1: "Digital marketing agency focused on real customers, not clicks",
    imageAlt: "A rising growth chart surrounded by search, social media and local map icons",
    intro:
      "BeaverCodes is a digital marketing agency based in Sri Lanka, helping businesses at home and abroad get found and chosen online. A great website only works if people find it, so we combine SEO, social media, paid ads and clear analytics that show what's working.",
    headings: {
      offers: "How we grow your visibility",
      reasons: "What makes our approach different",
      process: "Our SEO and marketing process",
      stack: "Tools we work with",
      related: "Websites built with SEO in mind",
      faq: "SEO and digital marketing FAQs",
    },
    offersIntro:
      "Our digital marketing services start with an audit of where you stand today, then focus on the channels most likely to bring you enquiries.",
    offers: [
      { title: "SEO (search engine optimisation)", text: "Technical fixes, keyword research and content that help you rank on Google for the searches your customers make." },
      { title: "Local SEO", text: "Google Business Profile and local listings so you appear in 'near me' and map searches." },
      { title: "Social media marketing", text: "Content and campaigns for platforms like Facebook, Instagram and TikTok that build an audience." },
      { title: "Paid advertising", text: "Google Ads and Meta ads managed for leads and sales, not just clicks." },
      { title: "Analytics & reporting", text: "Google Analytics 4 and Search Console set up properly, with simple, regular reports." },
      { title: "Conversion optimisation", text: "Improve pages and forms so more visitors become enquiries." },
    ],
    reasons: [
      {
        title: "Website + marketing in one team",
        text: "We can fix the site and run the campaigns, so nothing falls between agencies.",
        link: { before: "Need a new site first? See our ", text: "web development services", href: "/services/web-development", after: "." },
      },
      { title: "Tracking from day one", text: "Campaigns are set up to measure enquiries and sales, not just traffic." },
      { title: "Honest advice", text: "No vanity metrics — we focus on what grows your business." },
      { title: "Sri Lanka and international markets", text: "Strategies for customers in Sri Lanka and for reaching new markets abroad." },
    ],
    process: [
      { step: "Discover", text: "Audit your website, search visibility, competitors and current marketing." },
      { step: "Design", text: "A plan: target keywords, channels, content and budget." },
      { step: "Develop", text: "Fix the technical basics, create content and launch campaigns." },
      { step: "Grow", text: "Regular reporting and continuous improvement." },
    ],
    stack: ["Google Search Console", "Google Analytics 4", "Google Ads", "Meta Ads", "Google Business Profile"],
    related: ["beanory", "harlow"],
    faq: [
      { q: "What do your SEO services include?", a: "Technical fixes, keyword research, on-page improvements and content, plus local SEO through Google Business Profile where it matters. As an SEO company that also builds websites, we can fix site problems ourselves instead of only reporting them." },
      { q: "How long does SEO take to work?", a: "SEO builds over time. Technical fixes can help within weeks, while competitive rankings usually take several months of consistent content and links." },
      { q: "Can you guarantee first place on Google?", a: "No honest agency can guarantee rankings — Google decides. What we guarantee is the work: a technically sound site, the right keywords, quality content and clear reporting." },
      { q: "How much do digital marketing services cost?", a: "It depends on the channels, the amount of work involved and, for paid campaigns, your advertising budget. After an audit we recommend a plan and give you a clear estimate." },
      { q: "Do you offer local SEO for businesses in Sri Lanka?", a: "Yes. We set up and improve your Google Business Profile and local listings so you show up in map results and 'near me' searches in your area." },
      { q: "Can you market my business to customers outside Sri Lanka?", a: "Yes. Our strategies cover customers in Sri Lanka and abroad, with keyword research and content planned for the countries you want to reach." },
      { q: "Do I need a new website for SEO?", a: "Not always. We start with an audit; sometimes improving the existing site is enough." },
    ],
  },
];

export const getServicePage = (slug: string) => SERVICE_PAGES.find((s) => s.slug === slug);
