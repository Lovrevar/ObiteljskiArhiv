import { z } from "zod";

/*
  Contact and partner form → email via Resend.
  Replaces the Lovable Cloud function `supabase/functions/send-contact-email`,
  which sent through Lovable's connector gateway. Needs RESEND_API_KEY in Vercel.
*/

const RESEND_URL = "https://api.resend.com/emails";
const RECIPIENT = process.env.CONTACT_RECIPIENT || "info@obiteljski-arhiv.com";
const SENDER = process.env.CONTACT_SENDER || "Obiteljski Arhiv <info@obiteljski-arhiv.com>";

const ContactSchema = z.object({
  type: z.literal("contact"),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  orderNumber: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().min(1).max(3000),
});

const PartnerSchema = z.object({
  type: z.literal("partner"),
  company: z.string().trim().min(1).max(160),
  contact: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(60).optional().default(""),
  message: z.string().trim().min(1).max(3000),
});

const BodySchema = z.discriminatedUnion("type", [ContactSchema, PartnerSchema]);

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

interface ApiRequest {
  method?: string;
  body?: unknown;
}

interface ApiResponse {
  status(code: number): ApiResponse;
  setHeader(name: string, value: string): void;
  json(body: unknown): void;
}

function parseBody(body: unknown) {
  if (typeof body !== "string") return body;
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("contact: RESEND_API_KEY is not set");
    return res.status(500).json({ error: "Email service not configured" });
  }

  const parsed = BodySchema.safeParse(parseBody(req.body));
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const data = parsed.data;

  let subject: string;
  let html: string;

  if (data.type === "contact") {
    subject = `Nova poruka s kontakt forme: ${data.name}`;
    html = `
      <h2>Nova poruka s kontakt forme</h2>
      <p><strong>Ime:</strong> ${escape(data.name)}</p>
      <p><strong>Email:</strong> ${escape(data.email)}</p>
      ${data.orderNumber ? `<p><strong>Broj narudžbe:</strong> ${escape(data.orderNumber)}</p>` : ""}
      <p><strong>Poruka:</strong></p>
      <p style="white-space:pre-wrap">${escape(data.message)}</p>
    `;
  } else {
    subject = `Nova prijava za partnerstvo: ${data.company}`;
    html = `
      <h2>Nova prijava za poslovno partnerstvo</h2>
      <p><strong>Tvrtka:</strong> ${escape(data.company)}</p>
      <p><strong>Kontakt osoba:</strong> ${escape(data.contact)}</p>
      <p><strong>Email:</strong> ${escape(data.email)}</p>
      ${data.phone ? `<p><strong>Telefon:</strong> ${escape(data.phone)}</p>` : ""}
      <p><strong>Poruka:</strong></p>
      <p style="white-space:pre-wrap">${escape(data.message)}</p>
    `;
  }

  try {
    const response = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ from: SENDER, to: [RECIPIENT], reply_to: data.email, subject, html }),
    });

    if (!response.ok) {
      console.error(`contact: Resend failed [${response.status}]: ${await response.text()}`);
      return res.status(502).json({ error: "Email send failed" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("contact: unexpected error", err);
    return res.status(500).json({ error: "Email send failed" });
  }
}
