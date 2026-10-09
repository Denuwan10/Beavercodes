"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import RevealText from "./RevealText";
import MagneticButton, { Arrow } from "./MagneticButton";
import { cn } from "@/utils/math";

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
    "peer w-full resize-none border-0 border-b bg-transparent px-0 pb-3 pt-7 text-lg text-cream placeholder-transparent outline-none transition-colors duration-500 focus:ring-0";
  return (
    <div className="group relative">
      {textarea ? (
        <textarea
          id={id}
          name={id}
          rows={4}
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
        className="pointer-events-none absolute left-0 top-1 text-xs uppercase tracking-[0.18em] text-mute transition-all duration-300 peer-placeholder-shown:top-7 peer-placeholder-shown:text-lg peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-1 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-[0.18em] peer-focus:text-ember"
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

/** Large circular magnetic call-to-action that jumps to the form. */
function RoundCTA() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 16 });
  const sy = useSpring(y, { stiffness: 180, damping: 16 });
  return (
    <motion.a
      href="#contact-form"
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.4);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      data-cursor="hover"
      className="group relative flex h-[clamp(9rem,13vw,13rem)] w-[clamp(9rem,13vw,13rem)] items-center justify-center overflow-hidden rounded-full bg-ember text-ink"
    >
      <span className="absolute inset-0 scale-0 rounded-full bg-cream transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-100" />
      <span className="relative flex flex-col items-center gap-1 text-center font-semibold leading-tight">
        Let&apos;s talk
        <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" aria-hidden>
          <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </motion.a>
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
    <section id="contact" className="relative overflow-hidden bg-coal py-[clamp(6rem,14vw,12rem)]">
      <div
        aria-hidden
        className="absolute -right-[20vw] -top-[20vh] h-[80vh] w-[60vw] rounded-full blur-[140px]"
        style={{ background: "radial-gradient(closest-side, rgba(255,122,26,0.22), transparent)" }}
      />
      <div className="container-x relative">
        <p className="eyebrow mb-8 flex items-center gap-3">
          <span className="text-ember">(06)</span>
          <span className="h-px w-10 bg-cream/20" />
          Contact
        </p>
        <div className="relative">
          <RevealText
            className="text-[clamp(3rem,9vw,11rem)] font-extrabold leading-[0.88] tracking-[-0.05em]"
            lines={[
              "Let's Build",
              <span key="l2" className="block md:pl-[8vw]">
                Something <em className="font-serif font-normal italic tracking-[-0.02em] text-ember">Great</em>
              </span>,
              "Together.",
            ]}
          />
          <div className="mt-10 md:absolute md:bottom-[2%] md:right-0 md:mt-0">
            <RoundCTA />
          </div>
        </div>

        <div className="mt-20 grid gap-16 lg:grid-cols-12">
          <aside className="space-y-10 lg:col-span-4">
            <p className="max-w-sm text-lg text-mute">
              Tell us where your business is today and where you want it to go. We&apos;ll come back with ideas, a plan and an honest estimate.
            </p>
            <div className="space-y-2">
              <p className="eyebrow">Email</p>
              <a href="mailto:hello@beavercodes.com" className="text-2xl font-semibold underline-offset-8 hover:text-ember hover:underline">
                hello@beavercodes.com
              </a>
            </div>
            <div className="space-y-2">
              <p className="eyebrow">Services</p>
              <p className="text-cream/80">Web · Software · Mobile · Marketing</p>
            </div>
          </aside>

          <div id="contact-form" className="scroll-mt-28 lg:col-span-8">
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[420px] flex-col items-start justify-center gap-6 rounded-[28px] border border-ember/30 bg-ink/50 p-10"
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
                  className="grid gap-x-10 gap-y-8 md:grid-cols-2"
                >
                  <Field id="name" label="Name" required error={errors.name} autoComplete="name" />
                  <Field id="email" label="Email" type="email" required error={errors.email} autoComplete="email" />
                  <div className="md:col-span-2">
                    <Field id="company" label="Company" autoComplete="organization" />
                  </div>

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
                      {status === "sending" ? "Sending…" : "Let's Build Something Great Together"} <Arrow />
                    </MagneticButton>
                    {status === "error" && (
                      <p className="text-sm text-red-300" role="alert">
                        Something went wrong. Please email us directly at hello@beavercodes.com.
                      </p>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
