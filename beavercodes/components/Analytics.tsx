"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import {
  GA_ID,
  clearAnalyticsCookies,
  onOpenCookieSettings,
  readConsent,
  writeConsent,
  type Consent,
} from "@/utils/consent";

/**
 * Google Analytics 4, behind an opt-in cookie banner.
 *
 * Off until NEXT_PUBLIC_GA_ID (your "G-XXXXXXX" Measurement ID, from
 * analytics.google.com → Admin → Data streams) is set in Vercel's environment
 * variables — without it, neither GA nor the banner is rendered. With it, the
 * GA script is loaded only after the visitor accepts; "Reject" is as easy as
 * "Accept", and the choice can be changed from "Cookie settings" in the footer.
 *
 * Page views: GA4's "Enhanced measurement" (on by default) also records the
 * in-app navigations, e.g. opening a project.
 */
export default function Analytics() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!GA_ID) return;
    const saved = readConsent();
    setConsent(saved);
    if (!saved) setOpen(true);
    return onOpenCookieSettings(() => setOpen(true));
  }, []);

  if (!GA_ID) return null;

  const choose = (value: Consent) => {
    const withdrawn = consent === "granted" && value === "denied";
    writeConsent(value);
    setConsent(value);
    setOpen(false);
    if (withdrawn) {
      // GA is already running on this page: switch it off, remove its cookies
      // and reload so nothing else is sent.
      (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true;
      clearAnalyticsCookies();
      window.location.reload();
    }
  };

  return (
    <>
      {consent === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}
      {open && (
        <section
          aria-label="Cookie preferences"
          className="fixed inset-x-4 bottom-4 z-[80] rounded-[20px] border border-cream/10 bg-coal/95 p-5 text-sm text-cream shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:left-6 sm:right-auto sm:max-w-md md:bottom-6"
        >
          <p className="font-semibold">Analytics cookies</p>
          <p className="mt-2 leading-relaxed text-mute">
            We&apos;d like to use Google Analytics cookies to understand how visitors use this site, so we can improve it.
            They stay off unless you accept. You can change your choice any time under “Cookie settings” in the footer.{" "}
            <a href="/privacy-policy#cookies" className="text-cream underline underline-offset-4 hover:text-ember">
              Privacy Policy
            </a>
          </p>
          {/* Equal weight on purpose: rejecting is as easy as accepting. */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {(
              [
                ["denied", "Reject"],
                ["granted", "Accept"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => choose(value)}
                aria-pressed={consent === value}
                className="rounded-full border border-cream/25 px-4 py-2.5 font-semibold transition-colors hover:border-ember hover:text-ember"
              >
                {label}
              </button>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
