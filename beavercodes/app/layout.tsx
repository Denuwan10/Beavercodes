import type { Metadata, Viewport } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Analytics from "@/components/Analytics";
import { SITE } from "@/utils/site";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

// The blue link in Google for the home page.
const TITLE = "BeaverCodes | Web, Software & Mobile App Development in Sri Lanka";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: TITLE, template: `%s | ${SITE.name}` },
  description: SITE.description,
  // No meta keywords: search engines ignore them.
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.name,
    locale: "en_US",
    title: TITLE,
    description: SITE.description,
  },
  // Icons and the share image come from app/icon.png, app/apple-icon.png and
  // app/opengraph-image.jpg (built from the mascot logo in public/brand/).
  twitter: { card: "summary_large_image", title: TITLE, description: SITE.description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // Paste the code from Google Search Console / Bing Webmaster Tools here
  // (or set the env vars) to verify ownership.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0a09",
  width: "device-width",
  initialScale: 1,
};

/**
 * `modal` is a parallel route slot: a project opened from a portfolio card
 * renders there, over the still-mounted home page (see app/@modal).
 */
export default function RootLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${jetbrains.variable}`}>
      <body className="grain font-sans">
        <SmoothScroll>
          <Cursor />
          {children}
          {modal}
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
