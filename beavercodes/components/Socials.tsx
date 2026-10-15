import { SITE } from "@/utils/site";
import { cn } from "@/utils/math";

type Network = "Facebook" | "Instagram" | "TikTok" | "WhatsApp";

/** Simple line icons, drawn in the current text colour. */
export function SocialIcon({ name, className }: { name: Network; className?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    className: cn("h-5 w-5", className),
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "Facebook":
      return (
        <svg {...common}>
          <path d="M15 3.5h-2.2A3.8 3.8 0 0 0 9 7.3V10H6.5v3.5H9v7h3.5v-7h2.6l.5-3.5h-3.1V7.6c0-.6.4-1 1-1H15z" />
        </svg>
      );
    case "Instagram":
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
        </svg>
      );
    case "TikTok":
      return (
        <svg {...common}>
          <path d="M14 3.5v11.2a3.3 3.3 0 1 1-3.3-3.3" />
          <path d="M14 3.5c.4 2.6 2.2 4.4 4.8 4.6" />
        </svg>
      );
    case "WhatsApp":
      return (
        <svg {...common}>
          <path d="M4 20l1.2-3.6A8.3 8.3 0 1 1 8 19.1L4 20z" />
          <path d="M9.3 8.6c.2-.4.5-.4.8-.4h.4c.2 0 .4.1.5.4l.6 1.4c.1.2 0 .4-.1.6l-.4.5c-.1.2-.1.3 0 .5.5.9 1.3 1.6 2.2 2.1.2.1.4.1.5-.1l.5-.6c.1-.2.4-.2.6-.1l1.4.7c.2.1.3.3.3.5v.4c0 .6-.6 1.2-1.4 1.3-2.4.2-5.7-2.7-6.3-5.1-.2-.8 0-1.5.4-2.1z" />
        </svg>
      );
  }
}

/** Every channel, WhatsApp included. */
export const CHANNELS: { label: Network; href: string }[] = [
  ...SITE.socials.map((s) => ({ label: s.label as Network, href: s.href })),
  { label: "WhatsApp", href: SITE.whatsapp },
];

/** A row of round icon links (contact section, mobile menu). */
export function SocialRow({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-2.5", className)}>
      {CHANNELS.map((c) => (
        <li key={c.label}>
          <a
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={c.label === "WhatsApp" ? `Chat with us on WhatsApp (${SITE.phone})` : `BeaverCodes on ${c.label}`}
            title={c.label}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/15 text-cream/80 transition-colors hover:border-ember hover:text-ember"
          >
            <SocialIcon name={c.label} />
          </a>
        </li>
      ))}
    </ul>
  );
}
