import type { Metadata, Viewport } from "next";
import { Manrope, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://beavercodes.com"),
  title: "BeaverCodes — Build • Develop • Grow",
  description:
    "BeaverCodes builds websites, software, mobile apps and digital marketing that help businesses grow.",
  openGraph: {
    title: "BeaverCodes — Build • Develop • Grow",
    description: "A digital workshop crafting websites, software and apps that create real business impact.",
    type: "website",
  },
  // Icons and the share image come from app/icon.png, app/apple-icon.png and
  // app/opengraph-image.png (built from the mascot logo in public/brand/).
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0c0a09",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${instrument.variable} ${jetbrains.variable}`}>
      <body className="grain font-sans">
        <SmoothScroll>
          <Cursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
