"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RevealText from "./RevealText";
import MagneticButton, { Arrow } from "./MagneticButton";
import { SocialIcon, SocialRow } from "./Socials";
import { cn } from "@/utils/math";
import { SITE } from "@/utils/site";

const PROJECT_TYPES = ["Web Development", "Software Development", "Mobile App", "Digital Marketing", "Not sure yet"];

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

function Field({
  id,
  label,
  type = "text",
  required,
  error,
  textarea,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
  textarea?: boolean;
  autoComplete?: string;
}) {
  const shared =
    "peer w-full resize-none border-0 border-b bg-transparent px-0 pb-2.5 pt-6 text-base text-cream placeholder-transparent outline-none transition-colors duration-500 focus:ring-0 md:text-lg";
  return (
    <div className="group relative">
      {textarea ? (
        <textarea
          id={id}
          name={id}
          rows={3}
          placeholder={label}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className={cn(shared, error ? "border-red-400/70" : "border-cream/15")}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          placeholder={label}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className={cn(shared, error ? "border-red-400/70" : "border-cream/15")}
        />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-0.5 text-xs uppercase tracking-[0.18em] text-mute transition-all duration-300 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-0.5 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-[0.18em] peer-focus:text-ember md:peer-placeholder-shown:text-lg"
      >
        {label}
        {required && <span className="text-ember"> *</span>}
      </label>
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-ember transition-transform duration-700 ease-[var(--ease-out-expo)] peer-focus:scale-x-100"
      />
      {error && (
        <p id={`${id}-err`} className="mt-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

export default function Contact() {
  const [type, setType] = useState(PROJECT_TYPES[0]);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const next: Errors = {};
    if (!data.name?.trim()) next.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? "")) next.email = "Please enter a valid email.";
    if ((data.message ?? "").trim().length < 10) next.message = "A few more words about your project, please.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, projectType: type }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    // Compact contact: headline, intro and email on the left; the form on the right.
    <section id="contact" className="relative overflow-hidden bg-coal py-[clamp(4.5rem,9vw,8rem)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[15vw] -top-[15vh] h-[60vh] w-[50vw] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(255,122,26,0.16), transparent)" }}
      />
      <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        <aside className="lg:col-span-5">
          <p className="eyebrow mb-8 flex items-center gap-3">
            <span className="text-ember">(05)</span>
            <span className="h-px w-10 bg-cream/20" />
            Contact
          </p>
          <RevealText
            className="text-[clamp(2.4rem,4.8vw,4.5rem)] font-extrabold leading-[0.98] tracking-[-0.04em]"
            lines={[
              "Let's build",
              <>
                something <em className="not-italic text-ember">great.</em>
              </>,
            ]}
          />
          <p className="mt-6 max-w-sm text-mute md:text-lg">
            Tell us where your business is and where you want it to go. We&apos;ll reply with ideas, a plan and an honest estimate.
          </p>
          <div className="mt-8 space-y-1.5">
            <p className="eyebrow">Email</p>
            <a href="mailto:hello@beavercodes.com" className="text-xl font-semibold underline-offset-8 hover:text-ember hover:underline md:text-2xl">
              hello@beavercodes.com
            </a>
          </div>
          <div className="mt-6 space-y-1.5">
            <p className="eyebrow">WhatsApp</p>
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 text-xl font-semibold underline-offset-8 hover:text-ember hover:underline md:text-2xl"
            >
              <SocialIcon name="WhatsApp" className="h-6 w-6 text-ember" />
              {SITE.phone}
            </a>
          </div>
          <div className="mt-8">
            <p className="eyebrow mb-3">Follow us</p>
            <SocialRow />
          </div>
        </aside>

        <div id="contact-form" className="scroll-mt-28 lg:col-span-7 lg:pt-14">
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[320px] flex-col items-start justify-center gap-5 rounded-[28px] border border-ember/30 bg-ink/50 p-8 md:p-10"
                  role="status"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ember text-ink">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                      <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <h3 className="text-3xl font-bold md:text-4xl">Message received — the beaver is on it.</h3>
                  <p className="text-mute">We&apos;ll be in touch soon to talk about your project.</p>
                  <button onClick={() => setStatus("idle")} className="eyebrow text-ember underline-offset-4 hover:underline">
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-x-8 gap-y-6 md:grid-cols-2"
                >
                  <Field id="name" label="Name" required error={errors.name} autoComplete="name" />
                  <Field id="email" label="Email" type="email" required error={errors.email} autoComplete="email" />

                  <fieldset className="md:col-span-2">
                    <legend className="mb-4 text-xs uppercase tracking-[0.18em] text-mute">Project Type</legend>
                    <div className="flex flex-wrap gap-2">
                      {PROJECT_TYPES.map((t) => {
                        const active = t === type;
                        return (
                          <label
                            key={t}
                            className={cn(
                              "relative cursor-pointer rounded-full border px-5 py-2.5 text-sm transition-colors duration-500 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ember",
                              active ? "border-ember text-ink" : "border-cream/15 text-cream/80 hover:border-cream/40",
                            )}
                          >
                            <input
                              type="radio"
                              name="projectTypeChoice"
                              value={t}
                              checked={active}
                              onChange={() => setType(t)}
                              className="sr-only"
                            />
                            {active && (
                              <motion.span
                                layoutId="project-type"
                                className="absolute inset-0 rounded-full bg-ember"
                                transition={{ type: "spring", stiffness: 400, damping: 34 }}
                              />
                            )}
                            <span className="relative">{t}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="md:col-span-2">
                    <Field id="message" label="Tell us about your project" textarea required error={errors.message} />
                  </div>

                  {/* Honeypot */}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

                  <div className="flex flex-wrap items-center gap-6 md:col-span-2">
                    <MagneticButton type="submit" disabled={status === "sending"}>
                      {status === "sending" ? "Sending…" : "Send message"} <Arrow />
                    </MagneticButton>
                    {status === "error" && (
                      <p className="text-sm text-red-300" role="alert">
                        Sorry, your message couldn&apos;t be sent. Please email us at{" "}
                        <a href={`mailto:${SITE.email}`} className="underline">{SITE.email}</a> or{" "}
                        <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="underline">
                          WhatsApp {SITE.phone}
                        </a>
                        .
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-mute md:col-span-2">
                    We use the details you send to reply to your enquiry. See our{" "}
                    <a href="/privacy-policy" className="text-cream/80 underline underline-offset-4 hover:text-ember">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
