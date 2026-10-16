/**
 * Portfolio projects — one list for the home page cards (components/Portfolio)
 * and the project pages (app/work/[slug]). Images live in /public/work:
 *   card shot:   /work/<image>-<width>.webp   (two widths)
 *   gallery:     /work/<slug>/<file>.webp
 *
 * These are showcase (concept) projects. When one becomes real client work,
 * set `kind` to "Client project" and update the facts accordingly.
 */

export type GalleryImage = { src: string; w: number; h: number; alt: string; caption: string };
export type Feature = { title: string; text: string };
export type StackGroup = { group: string; items: string[] };

export type Project = {
  slug: string;
  title: string;
  /** Short label on the card and page, e.g. "Web app · E-learning". */
  category: string;
  /** One sentence for the card. */
  summary: string;
  tags: string[];
  /** Stage behind the shot, tinted to the project's brand. */
  bg: string;
  /** Card shot base name in /public/work. */
  image: string;
  /** Width suffixes in the two card file names; default [800, 1600]. */
  widths?: [number, number];
  /** Actual pixel size [width, height] of the two card files (srcset, width/height). */
  shot: { sm: [number, number]; lg: [number, number] };
  /** Transparent cut-out that floats on the stage (e.g. phones). */
  cutout?: boolean;
  alt: string;

  // ---- Project page ----
  /** Full search title, brand included (used as an absolute title). */
  metaTitle: string;
  /** Search description, under ~155 characters. */
  metaDescription: string;
  /** Last significant content change (sitemap lastmod), YYYY-MM-DD. */
  updated: string;
  kind: "Concept project" | "Client project";
  year: string;
  industry: string;
  platforms: string[];
  services: string[];
  /** Typical build time for a project like this. */
  timeline: string;
  /** Opening paragraph under the title. */
  intro: string;
  challenge: string;
  solution: string;
  features: Feature[];
  stack: StackGroup[];
  /** What each step of our process meant for this project. */
  process: { step: string; text: string }[];
  /** What the product is designed to achieve. */
  goals: string[];
  gallery: GalleryImage[];
};

const g = (slug: string, file: string, w: number, h: number, alt: string, caption: string): GalleryImage => ({
  src: `/work/${slug}/${file}.webp`,
  w,
  h,
  alt,
  caption,
});

export const PROJECTS: Project[] = [
  {
    slug: "edupro",
    title: "EduPro",
    category: "Web app · E-learning",
    summary: "A student dashboard for online learning: courses, progress, calendar and achievements at a glance.",
    tags: ["Dashboard", "UI/UX", "React"],
    bg: "radial-gradient(90% 80% at 72% 18%, rgba(120,130,255,0.32), transparent 62%), linear-gradient(150deg, #24264a 0%, #12131f 75%)",
    image: "edupro",
    shot: { sm: [800, 533], lg: [1536, 1024] },
    alt: "EduPro e-learning dashboard with course cards, progress stats, a calendar and upcoming activities",
    metaTitle: "E-Learning Web App Case Study | EduPro | BeaverCodes",
    metaDescription:
      "Explore EduPro, an e-learning web app concept by BeaverCodes with student dashboards, course progress, calendars, achievements and responsive web technology.",
    updated: "2026-10-16",
    kind: "Concept project",
    year: "2026",
    industry: "Education & e-learning",
    platforms: ["Web (desktop & tablet)", "Responsive mobile web"],
    services: ["UI/UX design", "Web app development", "Design system"],
    timeline: "8–12 weeks",
    intro:
      "EduPro is a learning platform dashboard that gives every student one calm home base: what to study next, how far they've come and what's due — without hunting through menus.",
    challenge:
      "Online learners juggle courses, live classes, assignments and exams across different tools. When progress and deadlines are scattered, motivation drops and students miss what matters. The platform needed a single view that is genuinely useful every day, not just a list of courses.",
    solution:
      "We designed a dashboard around the student's day: a welcome area with a clear next step, at-a-glance stats, course cards with live progress, a calendar with colour-coded deadlines and an upcoming-activities list. Achievements and a learning streak reward consistency, so coming back feels good.",
    features: [
      { title: "Personal dashboard", text: "Enrolled and completed courses, learning time and average score, right at the top." },
      { title: "Course progress", text: "Every course card shows its status, instructor, lessons, duration and a live progress bar." },
      { title: "Calendar & deadlines", text: "A monthly calendar marks assignments, live classes and quizzes, with the next ones listed beside it." },
      { title: "Achievements & streaks", text: "Badges for milestones and a learning streak keep students motivated week after week." },
      { title: "Overall progress", text: "One ring shows the whole picture: completed, in progress and not started." },
      { title: "Everything one click away", text: "Courses, assignments, exams, certificates and messages live in a clear sidebar, with search and notifications on top." },
    ],
    stack: [
      { group: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
      { group: "Backend", items: ["Node.js (NestJS)", "PostgreSQL", "Prisma ORM", "REST API"] },
      { group: "Learning features", items: ["Video streaming (Mux)", "Calendar & reminders", "Role-based access (students, instructors, admins)"] },
      { group: "Payments & auth", items: ["Stripe", "Auth.js (email, Google)"] },
      { group: "Hosting & tools", items: ["Vercel", "AWS S3", "Figma", "PostHog analytics"] },
    ],
    process: [
      { step: "Discover", text: "Mapped a student's week — classes, deadlines, study time — to decide what belongs on the first screen." },
      { step: "Design", text: "Built a friendly design system: soft colours, clear status labels and cards that scan in seconds." },
      { step: "Develop", text: "A fast, responsive web app with secure roles for students, instructors and admins." },
      { step: "Grow", text: "Analytics on course completion and engagement to keep improving the learning experience." },
    ],
    goals: [
      "Show students their next step within seconds of logging in",
      "Make deadlines impossible to miss",
      "Reward consistent learning to improve course completion",
      "Scale from one course to a full catalogue",
    ],
    gallery: [
      g("edupro", "dashboard", 915, 445, "EduPro welcome banner with a Continue Learning button and four stat cards", "Welcome area with the next step and key stats"),
      g("edupro", "courses", 915, 320, "EduPro course cards with status labels and progress bars", "Course cards with live progress"),
      g("edupro", "calendar", 335, 760, "EduPro calendar with marked deadlines and an upcoming activities list", "Calendar and upcoming activities"),
      g("edupro", "progress", 915, 170, "EduPro overall progress ring and achievement badges", "Overall progress and achievements"),
    ],
  },
  {
    slug: "fingrow",
    title: "FinGrow",
    category: "Mobile app · Fintech",
    summary: "A micro-loan app for small businesses: apply in three steps, track repayments and pay by phone.",
    tags: ["iOS & Android", "Fintech", "UX flows"],
    bg: "radial-gradient(90% 80% at 28% 20%, rgba(70,180,110,0.28), transparent 62%), linear-gradient(150deg, #1a2e22 0%, #111712 75%)",
    image: "fingrow-phones",
    widths: [480, 808],
    cutout: true,
    shot: { sm: [480, 513], lg: [808, 863] },
    alt: "FinGrow mobile app on two phones: the home screen with an active loan overview, and the apply-for-a-loan screen",
    metaTitle: "Fintech Mobile App Case Study | FinGrow | BeaverCodes",
    metaDescription:
      "Explore FinGrow, a fintech mobile app concept designed for simple business lending, repayments, secure authentication and mobile-first user experiences.",
    updated: "2026-10-16",
    kind: "Concept project",
    year: "2026",
    industry: "Finance & micro-lending",
    platforms: ["iOS", "Android"],
    services: ["Mobile app design", "Mobile app development", "UX flows"],
    timeline: "12–16 weeks",
    intro:
      "FinGrow is a mobile app that makes small-business loans simple and friendly: apply in three steps, see exactly what you'll pay, and manage repayments from your phone.",
    challenge:
      "Small business owners often find loans intimidating — long forms, unclear costs and paperwork that takes days. Many use their phone for everything, so the experience had to be mobile-first, trustworthy and easy for first-time borrowers.",
    solution:
      "We designed a warm, human app with a clear home screen showing the active loan, next payment and due date. Loan products are explained in plain language, the application is a three-step flow with an instant monthly payment estimate, and paying takes a few taps with bank transfer, e-wallet or virtual account.",
    features: [
      { title: "Quick, secure sign-in", text: "Phone number and password, Face ID or Google — with a simple onboarding that explains the app." },
      { title: "Loan overview", text: "The active loan, repayment progress, next payment and due date on the home screen." },
      { title: "Loan products", text: "Business, working capital, personal and group loans, each with amount ranges and key benefits." },
      { title: "3-step application", text: "Details, documents and review — with an estimated monthly payment updated as you choose amount and tenure." },
      { title: "Easy payments", text: "Pay by bank transfer, e-wallet or virtual account, with a clear success receipt and transaction ID." },
      { title: "History & profile", text: "Every payment, disbursement and top-up in one history, plus documents, bank accounts and security settings." },
    ],
    stack: [
      { group: "Mobile", items: ["React Native", "Expo", "TypeScript"] },
      { group: "Backend", items: ["Node.js", "PostgreSQL", "REST API"] },
      { group: "Security", items: ["Biometric login (Face ID / fingerprint)", "OTP verification", "Encrypted storage", "JWT sessions"] },
      { group: "Integrations", items: ["Payment gateway (bank transfer, e-wallet, virtual account)", "Push notifications (Firebase)", "Document upload"] },
      { group: "Hosting & tools", items: ["AWS", "Figma", "App Store & Google Play release"] },
    ],
    process: [
      { step: "Discover", text: "Focused on first-time borrowers: what makes them hesitate, and what builds trust." },
      { step: "Design", text: "A friendly visual language, plain-language copy and a three-step flow that never feels like a form." },
      { step: "Develop", text: "One React Native codebase for iOS and Android, with bank-grade security on login and payments." },
      { step: "Grow", text: "Reminders before due dates and analytics on where applicants drop off, to keep improving the flow." },
    ],
    goals: [
      "Let a business owner apply for a loan in minutes",
      "Show the real monthly cost before they commit",
      "Make on-time repayment effortless",
      "Build trust with clear, friendly language",
    ],
    gallery: [
      g("fingrow", "all-screens", 1536, 1024, "Ten FinGrow app screens from onboarding to payment success", "The full app flow, from onboarding to payment"),
      g("fingrow", "onboarding", 600, 595, "FinGrow welcome and sign-in screens with Face ID and Google options", "Onboarding and sign-in"),
      g("fingrow", "loans", 580, 595, "FinGrow loan products list and the apply-for-a-loan form with monthly estimate", "Loan products and the application flow"),
      g("fingrow", "history", 600, 405, "FinGrow transaction history and loan details screens", "Transaction history and loan details"),
      g("fingrow", "payments", 880, 405, "FinGrow payment method, profile and payment successful screens", "Payments, profile and receipt"),
    ],
  },
  {
    slug: "harlow",
    title: "HARLOW",
    category: "E-commerce · Fashion",
    summary: "A modern fashion store: editorial homepage, category browsing and a product page built to convert.",
    tags: ["E-commerce", "Product pages", "Next.js"],
    bg: "radial-gradient(90% 80% at 70% 22%, rgba(150,175,135,0.28), transparent 62%), linear-gradient(150deg, #232a22 0%, #121511 75%)",
    image: "harlow",
    shot: { sm: [800, 450], lg: [1600, 900] },
    alt: "HARLOW fashion store: homepage with a Modern Essentials hero and categories, and an Essential Hoodie product page",
    metaTitle: "E-Commerce Website Case Study | HARLOW | BeaverCodes",
    metaDescription:
      "Explore HARLOW, an e-commerce website concept with editorial design, product discovery, Shopify integration and conversion-focused shopping experiences.",
    updated: "2026-10-16",
    kind: "Concept project",
    year: "2026",
    industry: "Fashion & retail",
    platforms: ["Web (desktop & mobile)"],
    services: ["E-commerce design", "Headless store development", "Conversion optimisation"],
    timeline: "8–10 weeks",
    intro:
      "HARLOW is an online store for a modern menswear label — a calm, editorial shopping experience that lets the clothes speak, and a product page designed to turn browsing into buying.",
    challenge:
      "Fashion shoppers decide in seconds. Cluttered stores, slow pages and unclear sizing lose sales and drive returns. The brand needed a premium look that still feels effortless to shop on any device.",
    solution:
      "We paired a magazine-style homepage with fast paths into each category, and built the product page around confident decisions: a large gallery, colour and size selection, a size guide, reviews, clear delivery and returns information, and a one-tap add to cart.",
    features: [
      { title: "Editorial homepage", text: "A full-bleed hero carousel and seasonal stories that set the tone of the brand." },
      { title: "Shop by category", text: "T-shirts, hoodies, pants, jackets and accessories, one tap away." },
      { title: "Featured products", text: "Product cards with prices, colour swatches and a quick wishlist heart." },
      { title: "Product page that converts", text: "Image gallery, colour and size selection, size guide, ratings and a clear add-to-cart button." },
      { title: "Trust built in", text: "Free shipping, easy returns and secure payment shown right where customers decide." },
      { title: "Cross-selling", text: "Product details in tabs, a 'Mix, Match, Elevate' look and 'You may also like' recommendations." },
    ],
    stack: [
      { group: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
      { group: "Commerce", items: ["Shopify (headless, Storefront API)", "Shopify Checkout", "Wishlist & recently viewed"] },
      { group: "Content & search", items: ["Sanity CMS (lookbooks & stories)", "Algolia product search"] },
      { group: "Performance & SEO", items: ["Image CDN", "Product structured data", "Core Web Vitals tuning"] },
      { group: "Hosting & tools", items: ["Vercel", "GA4 & Meta pixel", "Figma"] },
    ],
    process: [
      { step: "Discover", text: "Studied how customers shop for basics: fit, fabric and price come first." },
      { step: "Design", text: "A neutral, editorial style with generous imagery and a product page focused on one decision at a time." },
      { step: "Develop", text: "A headless Shopify store: the brand's own design with Shopify's reliable checkout and inventory." },
      { step: "Grow", text: "Search, product and conversion analytics to tune collections and campaigns." },
    ],
    goals: [
      "Feel premium without slowing shoppers down",
      "Help customers choose the right size first time",
      "Raise average order value with smart recommendations",
      "Load fast on mobile, where most fashion shopping happens",
    ],
    gallery: [
      g("harlow", "home", 785, 901, "HARLOW homepage with a Modern Essentials hero, categories and featured products", "Homepage: hero, categories and featured products"),
      g("harlow", "product", 786, 901, "HARLOW Essential Hoodie product page with gallery, colours, sizes and add to cart", "Product page built to convert"),
    ],
  },
  {
    slug: "beanory",
    title: "Beanory",
    category: "Website · Café",
    summary: "A warm website for a specialty coffee shop: menu, online ordering, table booking and newsletter.",
    tags: ["Website", "Online ordering", "Booking"],
    bg: "radial-gradient(90% 80% at 30% 18%, rgba(255,150,70,0.28), transparent 62%), linear-gradient(150deg, #3a2616 0%, #18110c 75%)",
    image: "beanory",
    shot: { sm: [800, 600], lg: [1448, 1086] },
    alt: "Beanory coffee shop website with a latte hero, signature drinks menu, testimonials and table booking",
    metaTitle: "Café Website Case Study | Beanory | BeaverCodes",
    metaDescription:
      "Explore Beanory, a café website concept featuring online ordering, table booking, menu browsing, local SEO and mobile-first design.",
    updated: "2026-10-16",
    kind: "Concept project",
    year: "2026",
    industry: "Food & hospitality",
    platforms: ["Web (desktop & mobile)"],
    services: ["Website design", "Website development", "Local SEO"],
    timeline: "4–6 weeks",
    intro:
      "Beanory is a website for a specialty coffee shop that feels as warm as the café itself — and does real work: showing the menu, taking orders and filling tables.",
    challenge:
      "Many cafés rely on social media alone, so customers can't easily find the menu, opening hours or a way to order. The shop wanted a site that captures its atmosphere and turns visitors into orders, bookings and regulars.",
    solution:
      "We built a rich, inviting site around the coffee: a hero with 'Order now' and 'Book a table', signature drinks with prices, a filterable menu, the café's story, real customer reviews, table booking and a newsletter that brings people back.",
    features: [
      { title: "Inviting hero", text: "A crafted coffee image with clear 'Order now' and 'Book a table' actions." },
      { title: "Signature drinks", text: "Featured drinks with descriptions, prices and a quick add-to-order button." },
      { title: "Filterable menu", text: "Hot coffee, iced drinks, non-coffee and pastries — easy to browse on a phone." },
      { title: "Story & reviews", text: "The café's story and customer testimonials that build trust with first-time visitors." },
      { title: "Table booking", text: "Reserve a table straight from the site, with confirmation by email." },
      { title: "Newsletter & local info", text: "A 'Coffee Circle' sign-up, plus location, opening hours and social links in the footer." },
    ],
    stack: [
      { group: "Frontend", items: ["Next.js", "React", "Tailwind CSS"] },
      { group: "Content", items: ["Sanity CMS (menu, prices, stories)"] },
      { group: "Orders & bookings", items: ["Online ordering (Square / Stripe)", "Table booking with email confirmation"] },
      { group: "Marketing", items: ["Newsletter (Mailchimp)", "Local SEO & Google Business Profile", "Google Maps"] },
      { group: "Hosting & tools", items: ["Netlify", "Figma"] },
    ],
    process: [
      { step: "Discover", text: "Learned what brings customers in — the coffee, the space and the people — and what stops them ordering online." },
      { step: "Design", text: "Warm photography, elegant serif headings and coffee tones that match the café." },
      { step: "Develop", text: "A fast site the owners update themselves: menu, prices and stories without a developer." },
      { step: "Grow", text: "Local SEO and a newsletter to turn first visits into regulars." },
    ],
    goals: [
      "Turn website visits into orders and bookings",
      "Let the owners update the menu themselves",
      "Show up in local searches for coffee nearby",
      "Bring customers back with a newsletter",
    ],
    gallery: [
      g("beanory", "hero", 880, 570, "Beanory homepage hero with a latte, Order Now and Book a Table buttons", "Homepage hero with order and booking actions"),
      g("beanory", "menu", 880, 486, "Beanory signature drinks with prices and add buttons", "Signature drinks and best sellers"),
      g("beanory", "story", 461, 1086, "Beanory menu filters, our story, testimonials, table booking and footer", "Menu, story, reviews and table booking"),
    ],
  },
];

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
