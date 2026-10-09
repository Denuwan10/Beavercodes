import { NextResponse } from "next/server";

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

/**
 * Contact form endpoint. Validates input and forwards it to CONTACT_WEBHOOK_URL
 * (Slack/Discord/Zapier/Make/your CRM). Swap the forward for Resend, Postmark
 * etc. if you prefer email delivery.
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

  const lead = {
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

  const hook = process.env.CONTACT_WEBHOOK_URL;
  if (hook) {
    try {
      const res = await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `New BeaverCodes enquiry from ${lead.name} (${lead.email}) — ${lead.projectType}\n${lead.company ? `Company: ${lead.company}\n` : ""}\n${lead.message}`,
          lead,
        }),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } catch (err) {
      console.error("[contact] forward failed", err);
      return NextResponse.json({ ok: false, error: "Could not deliver message" }, { status: 502 });
    }
  } else {
    console.info("[contact] new lead (set CONTACT_WEBHOOK_URL to forward):", lead);
  }

  return NextResponse.json({ ok: true });
}
