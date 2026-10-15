/**
 * Frequently asked questions — shown on the page (components/Faq.tsx) AND
 * published as FAQPage structured data, from this one list so the two always
 * match (Google ignores FAQ markup that isn't visible on the page).
 *
 * Answers lead with a direct one-sentence answer, which is the part answer
 * engines and AI assistants quote. Keep them accurate to how you work.
 */
export const FAQ: { q: string; a: string }[] = [
  {
    q: "What does BeaverCodes do?",
    a: "BeaverCodes designs and builds websites, custom business software and iOS/Android mobile apps, and runs digital marketing (SEO, social media, paid campaigns and analytics) to help businesses grow online.",
  },
  {
    q: "How much does a website or app cost?",
    a: "It depends on what you need. After a short discovery call we send a clear, itemised estimate for your project, so you know the cost before any work starts.",
  },
  {
    q: "How long does it take to build a website?",
    a: "A focused business website usually takes a few weeks; larger platforms, online stores and custom software take longer. You get a realistic timeline with the estimate, before the project starts.",
  },
  {
    q: "Do you build mobile apps for both iOS and Android?",
    a: "Yes. We build cross-platform apps with React Native or Flutter, so one codebase runs on both iOS and Android, and we handle the App Store and Google Play launch.",
  },
  {
    q: "Can you help my business show up on Google?",
    a: "Yes. Every site we build is fast and search-friendly from day one, and our digital marketing service covers SEO, content, social media, paid campaigns and analytics.",
  },
  {
    q: "Do you help after launch?",
    a: "Yes. Grow is the final step of our process: after launch we keep improving the product, track results and help the business scale.",
  },
  {
    q: "How do we start a project?",
    a: "Send a message through the contact form or email hello@beavercodes.com. Tell us where your business is today and where you want it to go, and we'll reply with ideas, a plan and an honest estimate.",
  },
];
