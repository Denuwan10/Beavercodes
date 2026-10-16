/**
 * Analytics consent (UK PECR / ICO guidance: analytics cookies need opt-in).
 *
 * Google Analytics only exists when NEXT_PUBLIC_GA_ID is set; it loads only
 * after the visitor clicks "Accept". The choice itself is kept in
 * localStorage (strictly necessary: it remembers the answer) and asked
 * again after CONSENT_MAX_AGE_DAYS.
 */

const id = process.env.NEXT_PUBLIC_GA_ID;
/** The GA4 Measurement ID, or null when analytics is not configured. */
export const GA_ID = id && /^G-[A-Z0-9]+$/.test(id) ? id : null;

export type Consent = "granted" | "denied";

export const CONSENT_KEY = "bc-consent";
const CONSENT_MAX_AGE_DAYS = 365;
const OPEN_EVENT = "bc:cookie-settings";

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const { value, at } = JSON.parse(raw) as { value?: string; at?: string };
    const age = (Date.now() - Date.parse(at ?? "")) / 86_400_000;
    if ((value !== "granted" && value !== "denied") || !(age < CONSENT_MAX_AGE_DAYS)) return null;
    return value;
  } catch {
    return null;
  }
}

export function writeConsent(value: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ value, at: new Date().toISOString() }));
  } catch {
    // Storage blocked: the choice applies to this page view only.
  }
}

/** Reopen the cookie banner (footer / privacy policy "Cookie settings"). */
export const openCookieSettings = () => window.dispatchEvent(new Event(OPEN_EVENT));
export const onOpenCookieSettings = (fn: () => void) => {
  window.addEventListener(OPEN_EVENT, fn);
  return () => window.removeEventListener(OPEN_EVENT, fn);
};

/** Remove Google Analytics cookies (_ga, _ga_<id>) after consent is withdrawn. */
export function clearAnalyticsCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.replace(/^www\./, "")}`];
  for (const c of document.cookie.split(";")) {
    const name = c.split("=")[0].trim();
    if (!/^_ga(_|$)/.test(name)) continue;
    for (const d of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
    }
  }
}
