import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.23.8";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const RECIPIENT = "info@obiteljski-arhiv.com";
const SENDER = "Obiteljski Arhiv <info@obiteljski-arhiv.com>";

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const data = parsed.data;

    let subject: string;
    let html: string;
    let replyTo: string;

    if (data.type === "contact") {
      subject = `Nova poruka s kontakt forme — ${data.name}`;
      replyTo = data.email;
      html = `
        <h2>Nova poruka s kontakt forme</h2>
        <p><strong>Ime:</strong> ${escape(data.name)}</p>
        <p><strong>Email:</strong> ${escape(data.email)}</p>
        ${data.orderNumber ? `<p><strong>Broj narudžbe:</strong> ${escape(data.orderNumber)}</p>` : ""}
        <p><strong>Poruka:</strong></p>
        <p style="white-space:pre-wrap">${escape(data.message)}</p>
      `;
    } else {
      subject = `Nova prijava za partnerstvo — ${data.company}`;
      replyTo = data.email;
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

    const response = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: SENDER,
        to: [RECIPIENT],
        reply_to: replyTo,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Resend failed [${response.status}]: ${errorBody}`);
      return new Response(JSON.stringify({ error: "Email send failed", status: response.status, details: errorBody }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-contact-email error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
