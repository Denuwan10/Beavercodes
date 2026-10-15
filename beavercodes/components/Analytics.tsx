import Script from "next/script";

/**
 * Google Analytics 4. Off until NEXT_PUBLIC_GA_ID (your "G-XXXXXXX"
 * Measurement ID, from analytics.google.com → Admin → Data streams) is set in
 * Vercel's environment variables. Loaded after the page is interactive, so it
 * never slows the first paint.
 *
 * Page views: GA4's "Enhanced measurement" (on by default) also records the
 * in-app navigations, e.g. opening a project.
 */
export default function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
