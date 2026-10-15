import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { SITE } from "@/utils/site";

/** Nodemailer needs Node.js (not the Edge runtime). */
export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  company?: string;
  projectType?: string;
  message?: string;
  website?: string; // honeypot
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Contact form endpoint.
 *
 * Delivery (set in the hosting provider's environment variables — never in code):
 *   Email through your own mailbox (e.g. Hostinger):
 *     SMTP_HOST  smtp.hostinger.com
 *     SMTP_PORT  465            (SSL; use 587 for STARTTLS)
 *     SMTP_USER  hello@beavercodes.com      (the mailbox)
 *     SMTP_PASS  that mailbox's password
 *     CONTACT_TO where enquiries go (defaults to SMTP_USER)
 *     CONTACT_AUTOREPLY  "true" to send the customer a confirmation email
 *   And/or CONTACT_WEBHOOK_URL (Slack, Discord, Zapier, Make…).
 *
 * If nothing is configured, or delivery fails, the visitor gets an error
 * (with the email and WhatsApp to use instead) — never a false "received".
 */
export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Bots fill hidden fields; pretend success.
  if (body.website) return NextResponse.json({ ok: true });

  const lead: Lead = {
    name: clip(body.name, 120),
    email: clip(body.email, 200),
    company: clip(body.company, 160),
    projectType: clip(body.projectType, 60),
    message: clip(body.message, 5000),
    receivedAt: new Date().toISOString(),
  };

  if (!lead.name || !EMAIL.test(lead.email) || lead.message.length < 10) {
    return NextResponse.json({ ok: false, error: "Please complete the required fields." }, { status: 422 });
  }

  const smtp = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  const hook = process.env.CONTACT_WEBHOOK_URL;
  if (!smtp && !hook) {
    console.error("[contact] no delivery configured (set SMTP_* or CONTACT_WEBHOOK_URL) — lead not delivered:", lead);
    return NextResponse.json({ ok: false, error: "Contact form is not configured" }, { status: 503 });
  }

  const results = await Promise.allSettled([
    smtp ? sendEmail(lead) : Promise.resolve(),
    hook ? sendWebhook(hook, lead) : Promise.resolve(),
  ]);
  const failures = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
  failures.forEach((f) => console.error("[contact] delivery failed:", f.reason));

  // Delivered if at least one configured channel succeeded.
  const configured = (smtp ? 1 : 0) + (hook ? 1 : 0);
  if (failures.length >= configured) {
    return NextResponse.json({ ok: false, error: "Could not deliver message" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

type Lead = { name: string; email: string; company: string; projectType: string; message: string; receivedAt: string };

async function sendEmail(lead: Lead) {
  const port = Number(process.env.SMTP_PORT || 465);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465, // 465 = SSL; 587 = STARTTLS
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  const from = `"${SITE.name} Website" <${process.env.SMTP_USER}>`;
  const to = process.env.CONTACT_TO || process.env.SMTP_USER!;

  const rows: [string, string][] = [
    ["Name", lead.name],
    ["Email", lead.email],
    ...(lead.company ? ([["Company", lead.company]] as [string, string][]) : []),
    ["Project type", lead.projectType || "—"],
  ];

  await transport.sendMail({
    from,
    to,
    // "Reply" in your mail app answers the customer directly.
    replyTo: { name: lead.name, address: lead.email },
    subject: `New enquiry from ${lead.name} — ${lead.projectType || "Website"}`,
    text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${lead.message}\n\n— Sent from the contact form on ${SITE.url}`,
    html: `<div style="font-family:Arial,sans-serif;font-size:15px;color:#17130f;max-width:600px">
  <h2 style="margin:0 0 16px;color:#d9560a">New website enquiry</h2>
  <table style="border-collapse:collapse;margin-bottom:16px">
    ${rows.map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#6b5f53">${esc(k)}</td><td style="padding:4px 0"><b>${esc(v)}</b></td></tr>`).join("")}
  </table>
  <div style="white-space:pre-wrap;line-height:1.5;padding:16px;background:#f7f2eb;border-radius:8px">${esc(lead.message)}</div>
  <p style="color:#6b5f53;font-size:13px;margin-top:16px">Hit Reply to answer ${esc(lead.name)} directly. Sent from the contact form on ${esc(SITE.url)}.</p>
</div>`,
  });

  // Optional confirmation to the customer. A failure here doesn't lose the
  // lead (it's already in your inbox), so it's only logged.
  if (process.env.CONTACT_AUTOREPLY === "true") {
    try {
      await transport.sendMail({
        from,
        to: lead.email,
        replyTo: to,
        subject: `We got your message — ${SITE.name}`,
        text: `Hi ${lead.name},\n\nThanks for reaching out to ${SITE.name}! We've received your message and will get back to you soon with ideas, a plan and an honest estimate.\n\nNeed us sooner? WhatsApp: ${SITE.phone} (${SITE.whatsapp})\n\n— The ${SITE.name} team\n${SITE.url}`,
        html: `<div style="font-family:Arial,sans-serif;font-size:15px;color:#17130f;max-width:600px;line-height:1.55">
  <p>Hi ${esc(lead.name)},</p>
  <p>Thanks for reaching out to <b>${SITE.name}</b>! We've received your message and will get back to you soon with ideas, a plan and an honest estimate.</p>
  <p>Need us sooner? Message us on <a href="${SITE.whatsapp}" style="color:#d9560a">WhatsApp (${esc(SITE.phone)})</a>.</p>
  <p>— The ${SITE.name} team<br><a href="${esc(SITE.url)}" style="color:#d9560a">${esc(SITE.url.replace(/^https?:\/\//, ""))}</a></p>
</div>`,
      });
    } catch (err) {
      console.error("[contact] auto-reply failed (enquiry was delivered):", err);
    }
  }
}

async function sendWebhook(url: string, lead: Lead) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `New BeaverCodes enquiry from ${lead.name} (${lead.email}) — ${lead.projectType}\n${lead.company ? `Company: ${lead.company}\n` : ""}\n${lead.message}`,
      lead,
    }),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}
