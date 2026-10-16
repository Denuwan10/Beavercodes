"use client";

import { GA_ID, openCookieSettings } from "@/utils/consent";

/** Reopens the cookie banner. Rendered only when analytics is configured. */
export default function CookieSettingsButton({ className }: { className?: string }) {
  if (!GA_ID) return null;
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Cookie settings
    </button>
  );
}
