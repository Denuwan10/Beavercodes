import type { Metadata } from "next";
import WorkHeader from "@/components/WorkHeader";
import Footer from "@/components/Footer";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import { SHARE_IMAGE, SITE } from "@/utils/site";
import { PRIVACY_UPDATED } from "@/utils/privacy";
import { GA_ID } from "@/utils/consent";

/**
 * Privacy policy. Written against what the site actually does (checked in the
 * code): the contact form (app/api/contact → email via the business mailbox),
 * hosting on Vercel, opt-in Google Analytics (components/Analytics.tsx, only
 * when NEXT_PUBLIC_GA_ID is set), self-hosted fonts, and plain links (no
 * embeds) to WhatsApp and social profiles. Update it when any of that changes.
 *
 * Legal name and address come from SITE.legal; while they are null those rows
 * are simply left out — never invent them.
 */

const TITLE = "Privacy Policy | BeaverCodes";
const DESCRIPTION =
  "How BeaverCodes collects, uses and protects personal information when you visit our website, contact us or use our services.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    type: "website",
    url: "/privacy-policy",
    siteName: SITE.name,
    locale: "en_US",
    title: TITLE,
    description: DESCRIPTION,
    images: [SHARE_IMAGE],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [SHARE_IMAGE] },
};

const updatedLabel = new Date(`${PRIVACY_UPDATED}T00:00:00Z`).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const email = (
  <a href={`mailto:${SITE.legal.privacyEmail}`} className="text-cream underline underline-offset-4 hover:text-ember">
    {SITE.legal.privacyEmail}
  </a>
);

/** Cookies and similar technologies — the complete list for this website. */
const COOKIES = [
  {
    name: "bc-consent (browser local storage)",
    provider: "BeaverCodes (first party)",
    purpose: "Remembers your analytics choice so we don't ask on every page.",
    type: "Strictly necessary",
    duration: "12 months, then we ask again",
  },
  {
    name: "_ga",
    provider: "Google Analytics (set on our domain)",
    purpose: "Distinguishes visitors so that visits can be counted. Only set if you accept analytics cookies.",
    type: "Analytics: needs your consent",
    duration: "Up to 2 years",
  },
  {
    name: "_ga_<container-id>",
    provider: "Google Analytics (set on our domain)",
    purpose: "Keeps track of the current visit (session). Only set if you accept analytics cookies.",
    type: "Analytics: needs your consent",
    duration: "Up to 2 years",
  },
];

type Section = { id: string; title: string; body: React.ReactNode };

const SECTIONS: Section[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <p>
          BeaverCodes is a software development company based in {SITE.country}, providing web development, software
          development, mobile application development and digital marketing services to clients worldwide.
        </p>
        <dl className="mt-5 grid gap-3 rounded-[20px] border border-cream/10 bg-coal/60 p-5 sm:grid-cols-[12rem_1fr]">
          {SITE.legal.name && (
            <>
              <dt className="text-mute">Registered legal name</dt>
              <dd>{SITE.legal.name}</dd>
            </>
          )}
          {SITE.legal.address && (
            <>
              <dt className="text-mute">Business address</dt>
              <dd>{SITE.legal.address}</dd>
            </>
          )}
          <dt className="text-mute">Privacy contact</dt>
          <dd>{email}</dd>
        </dl>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    body: (
      <>
        <p>
          <strong>Information you give us.</strong> When you use the contact form on our website we receive your name,
          email address, the type of project you choose and your message. If you contact us directly by email, WhatsApp or
          social media, we receive whatever you choose to send, such as your phone number, company name, project details
          and any attachments.
        </p>
        <p>
          <strong>Technical information.</strong> Like any website, our hosting provider receives technical information
          when you load a page: your IP address, browser and device type, the page requested, the referring website and
          the time of the request. This is used to deliver the website and keep it secure.
        </p>
        <p>
          <strong>Analytics information, only with your consent.</strong> If we have analytics switched on and you accept
          analytics cookies, Google Analytics collects information about how you use the website, such as pages visited,
          approximate location, device and browser type, referring website and interactions. See{" "}
          <a href="#analytics" className="text-cream underline underline-offset-4 hover:text-ember">Analytics</a>.
        </p>
        <p>We do not ask for sensitive personal information through the website.</p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use your information",
    body: (
      <>
        <p>We may use personal information to:</p>
        <ul>
          <li>respond to enquiries and discuss your project requirements;</li>
          <li>prepare quotations or proposals and provide the services you request;</li>
          <li>communicate with existing or potential clients and manage our business relationship with you;</li>
          <li>improve our website and services;</li>
          <li>maintain website security and prevent spam, misuse, fraud or abuse;</li>
          <li>meet legal or regulatory obligations; and</li>
          <li>establish, exercise or defend legal claims where necessary.</li>
        </ul>
        <p>
          We will not use personal information for purposes that are incompatible with those described in this policy
          unless permitted or required by applicable law.
        </p>
      </>
    ),
  },
  {
    id: "legal-bases",
    title: "Legal bases",
    body: (
      <>
        <p>
          Where data protection law requires us to identify a lawful basis, the basis depends on the circumstances. It may
          be:
        </p>
        <ul>
          <li>taking steps at your request before entering into a contract (for example, answering an enquiry or preparing a quote);</li>
          <li>performing a contract with you;</li>
          <li>complying with legal obligations;</li>
          <li>our legitimate interests (such as running and securing our website and business), where they are not overridden by your rights; or</li>
          <li>your consent, for example for analytics cookies.</li>
        </ul>
        <p>Where we rely on consent, you can withdraw it at any time.</p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and similar technologies",
    body: (
      <>
        <p>
          Our website does not set any cookies unless you accept analytics cookies. The complete list of cookies and
          similar technologies the website can use is below. Our fonts are served from our own website, so loading a
          page does not send your information to a font provider.
        </p>
        <div className="mt-5 overflow-x-auto rounded-[20px] border border-cream/10">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="bg-coal/80 text-mute">
              <tr>
                <th scope="col" className="p-3 font-semibold">Name</th>
                <th scope="col" className="p-3 font-semibold">Provider</th>
                <th scope="col" className="p-3 font-semibold">Purpose</th>
                <th scope="col" className="p-3 font-semibold">Type</th>
                <th scope="col" className="p-3 font-semibold">Duration</th>
              </tr>
            </thead>
            <tbody>
              {COOKIES.map((c) => (
                <tr key={c.name} className="border-t border-cream/10 align-top">
                  <td className="p-3 font-mono text-xs text-cream">{c.name}</td>
                  <td className="p-3">{c.provider}</td>
                  <td className="p-3">{c.purpose}</td>
                  <td className="p-3">{c.type}</td>
                  <td className="p-3">{c.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {GA_ID ? (
          <p>
            Analytics cookies are off by default and are only used after you click “Accept” in our cookie banner.
            “Reject” is just as easy, and you can change your choice at any time using “Cookie settings” in the website
            footer or here: <CookieSettingsButton className="text-cream underline underline-offset-4 hover:text-ember" />.
            You can also block or delete cookies in your browser settings.
          </p>
        ) : (
          <p>
            Analytics is currently switched off on this website, so no analytics cookies are used and no cookie banner is
            shown. If we switch it on, analytics cookies will stay off until you click “Accept” in a cookie banner, where
            “Reject” will be just as easy, and you will be able to change your choice at any time. You can also block or
            delete cookies in your browser settings.
          </p>
        )}
      </>
    ),
  },
  {
    id: "analytics",
    title: "Analytics",
    body: (
      <>
        <p>
          Our website is set up to use Google Analytics 4, provided by Google, to understand how visitors use the website
          and to improve its content and performance. It only runs if we have switched it on and you have accepted
          analytics cookies; if you reject them or make no choice, it is not loaded at all.
          {!GA_ID && " It is currently switched off."}
        </p>
        <p>
          When it runs, Google receives information such as your IP address, device and browser details and the pages you
          visit, and processes it under its own terms and privacy policy (
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-cream underline underline-offset-4 hover:text-ember">
            policies.google.com/privacy
          </a>
          ).
        </p>
      </>
    ),
  },
  {
    id: "contact-forms",
    title: "Contact forms and email",
    body: (
      <>
        <p>
          When you send our contact form, your message is passed through our website&apos;s server, hosted by Vercel, and
          delivered by email to our business mailbox, hosted by Hostinger. We may also send you an automatic email
          confirming that we received your message. If a message cannot be delivered, technical details of the attempt
          (which may include its content) may be recorded in our hosting provider&apos;s logs so that we can find and fix
          the problem.
        </p>
        <p>
          We use this information to respond to your enquiry and, where appropriate, to discuss or provide our services.
          We keep correspondence for as long as reasonably necessary to manage the enquiry or business relationship, and
          for legal, security, dispute-resolution or legitimate business purposes.
        </p>
      </>
    ),
  },
  {
    id: "third-party-services",
    title: "WhatsApp, social media and other third-party services",
    body: (
      <>
        <p>
          Our website links to WhatsApp and to our profiles on Facebook, Instagram and TikTok. These are plain links: we do
          not embed their widgets, buttons or tracking pixels on our website, so they receive nothing from us when you
          simply browse.
        </p>
        <p>
          If you choose to contact us or follow us through one of these services, that service collects and processes
          information independently of BeaverCodes, under its own privacy policy and terms. BeaverCodes does not control
          that processing.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Sharing personal information",
    body: (
      <>
        <p>We share personal information with service providers only where necessary to run our website and business:</p>
        <ul>
          <li><strong>Vercel</strong>: website hosting and delivery, including the contact form&apos;s server;</li>
          <li><strong>Hostinger</strong>: our business email;</li>
          <li><strong>Google</strong>: website analytics, only if you accept analytics cookies.</li>
        </ul>
        <p>We may also disclose information:</p>
        <ul>
          <li>when required by law;</li>
          <li>to protect our rights or property;</li>
          <li>to prevent fraud, abuse or security incidents;</li>
          <li>to professional advisers where necessary; or</li>
          <li>in connection with a business transaction, restructuring, acquisition or sale of assets, where legally permitted.</li>
        </ul>
      </>
    ),
  },
  {
    id: "international-processing",
    title: "International processing",
    body: (
      <p>
        Because BeaverCodes serves clients internationally and uses international service providers, personal information
        may be processed by BeaverCodes or its service providers in countries other than the one you live in, including
        {" "}{SITE.country} and the United States. Where data protection law sets requirements for international transfers,
        we will rely on appropriate safeguards or another lawful transfer mechanism.
      </p>
    ),
  },
  {
    id: "retention",
    title: "Data retention",
    body: (
      <>
        <p>
          We keep personal information only for as long as reasonably necessary for the purposes described in this policy.
          How long depends on the nature of the information, why it was collected, our ongoing relationship with you, legal
          and regulatory requirements, security needs, and the resolution of disputes or legal claims.
        </p>
        <p>When information is no longer needed, we take reasonable steps to delete it or dispose of it securely.</p>
      </>
    ),
  },
  {
    id: "security",
    title: "Data security",
    body: (
      <p>
        We use reasonable technical and organisational measures to protect personal information against unauthorised
        access, loss, misuse, alteration or disclosure. For example, our website is served only over encrypted HTTPS
        connections. However, no internet transmission or electronic storage system can be guaranteed to be completely
        secure.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your privacy rights",
    body: (
      <>
        <p>
          Depending on where you live and which data protection laws apply, you may have rights over your personal
          information, which can include the right to:
        </p>
        <ul>
          <li>access your personal information;</li>
          <li>correct inaccurate information;</li>
          <li>ask us to delete it;</li>
          <li>restrict certain processing;</li>
          <li>object to certain processing;</li>
          <li>data portability;</li>
          <li>withdraw consent, where processing relies on consent; and</li>
          <li>complain to a data protection authority.</li>
        </ul>
        <p>
          To exercise a right, email {email}. We may need to verify your identity before completing some requests.
        </p>
      </>
    ),
  },
  {
    id: "united-kingdom",
    title: "United Kingdom",
    body: (
      <p>
        If UK data protection law applies to our processing of your personal information, you have rights under that law,
        and you can complain to the UK Information Commissioner&apos;s Office (
        <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer" className="text-cream underline underline-offset-4 hover:text-ember">
          ico.org.uk
        </a>
        ) if you believe your personal information has not been handled in line with it.
      </p>
    ),
  },
  {
    id: "united-states",
    title: "United States",
    body: (
      <p>
        Privacy rights vary by state. Where a state privacy law applies to us, it may give you rights to access, correct
        or delete personal information, or to object to or limit certain uses and disclosures of it. We will comply with
        the requirements that apply to us based on our activities.
      </p>
    ),
  },
  {
    id: "sri-lanka",
    title: "Sri Lanka",
    body: (
      <p>
        Where Sri Lanka&apos;s Personal Data Protection Act, No. 9 of 2022 applies to our processing of personal
        information, we will handle that information in accordance with its requirements.
      </p>
    ),
  },
  {
    id: "children",
    title: "Children's privacy",
    body: (
      <p>
        Our website is intended for businesses and general audiences and is not directed at children. We do not knowingly
        request personal information from children. If you believe a child has provided personal information to us,
        please contact us so that we can review it and take appropriate action.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy from time to time to reflect changes to our services, technology, legal requirements or
        data practices. When we do, we will update the “Last updated” date at the top. Where required, we will give
        additional notice of material changes.
      </p>
    ),
  },
  {
    id: "contact-us",
    title: "Contact us",
    body: (
      <>
        <p>If you have questions about this policy or how BeaverCodes handles personal information, please contact:</p>
        <dl className="mt-5 grid gap-3 rounded-[20px] border border-cream/10 bg-coal/60 p-5 sm:grid-cols-[12rem_1fr]">
          <dt className="text-mute">Company</dt>
          <dd>BeaverCodes{SITE.legal.name && ` (${SITE.legal.name})`}</dd>
          <dt className="text-mute">Privacy email</dt>
          <dd>{email}</dd>
          {SITE.legal.address && (
            <>
              <dt className="text-mute">Business address</dt>
              <dd>{SITE.legal.address}</dd>
            </>
          )}
          <dt className="text-mute">Website</dt>
          <dd>
            <a href="/" className="text-cream underline underline-offset-4 hover:text-ember">
              {SITE.url.replace(/^https?:\/\//, "")}
            </a>
          </dd>
        </dl>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <WorkHeader backHref="/" backLabel="Home" />
      <main className="bg-ink pt-20">
        <article className="container-x pb-20 pt-12 md:pt-16">
          <nav aria-label="Breadcrumb" className="mb-10 font-mono text-xs uppercase tracking-[0.16em] text-mute">
            <ol className="flex flex-wrap items-center gap-2">
              <li><a href="/" className="hover:text-cream">Home</a></li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-cream">Privacy Policy</li>
            </ol>
          </nav>

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <header className="lg:col-span-12">
              <h1 className="text-[clamp(2.4rem,5.6vw,5.2rem)] font-extrabold leading-[1] tracking-[-0.04em]">Privacy Policy</h1>
              <p className="mt-6 text-mute">
                Last updated: <time dateTime={PRIVACY_UPDATED}>{updatedLabel}</time>
              </p>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-cream/85">
                BeaverCodes (“BeaverCodes”, “we”, “us” or “our”) respects your privacy and is committed to handling personal
                information responsibly. This policy explains what information we collect when you visit our website,
                contact us, request our services or interact with us through third-party services, and how we use it.
              </p>
            </header>

            {/* Contents */}
            <nav aria-label="Contents" className="lg:col-span-4">
              <div className="rounded-[20px] border border-cream/10 bg-coal/60 p-5 lg:sticky lg:top-28">
                <p className="eyebrow mb-4">Contents</p>
                <ol className="space-y-2 text-sm">
                  {SECTIONS.map((s, i) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="flex gap-3 text-cream/80 transition-colors hover:text-ember">
                        <span className="font-mono text-xs text-ember">{String(i + 1).padStart(2, "0")}</span>
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>

            {/* min-w-0: let the wide cookie table scroll inside its box on phones */}
            <div className="min-w-0 space-y-12 lg:col-span-8">
              {SECTIONS.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-28">
                  <h2 className="text-[clamp(1.5rem,2.6vw,2.1rem)] font-bold leading-tight tracking-tight">
                    <span className="mr-3 font-mono text-base text-ember">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </h2>
                  <div className="mt-4 space-y-4 leading-relaxed text-mute [&_li]:pl-1 [&_strong]:text-cream [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6">
                    {s.body}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </article>
      </main>
      <Footer base="/" />
    </>
  );
}
