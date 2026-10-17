import { SERVICE_LABEL, type Enquiry } from "./enquiry-schema";

/**
 * WhatsApp alert to the owner's phone. Supports the Meta WhatsApp Cloud API
 * (template message — required for business-initiated chats) or Twilio.
 */
export function whatsappConfigured() {
  const p = process.env.WHATSAPP_PROVIDER ?? "meta";
  if (!process.env.WHATSAPP_ALERT_TO) return false;
  if (p === "twilio") return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM);
  return Boolean(process.env.META_WA_TOKEN && process.env.META_WA_PHONE_NUMBER_ID);
}

export function shouldAlert(e: Enquiry) {
  const mode = process.env.WHATSAPP_ALERT_ON ?? "emergency";
  return mode === "all" || e.urgency === "emergency";
}

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
// WhatsApp template params cannot contain newlines/tabs or 4+ consecutive spaces
const clean = (s: string) => s.replace(/[\n\r\t]+/g, " ").replace(/\s{4,}/g, "   ").trim() || "-";

export async function sendWhatsAppAlert(e: Enquiry, ticket: string) {
  const to = process.env.WHATSAPP_ALERT_TO!.replace(/\D/g, "");
  const who = clean(`${e.name}${e.company ? ` (${e.company})` : ""}`);
  const contact = clean([e.phone, e.email].filter(Boolean).join(" · "));
  const summary = clean(clip(`${SERVICE_LABEL[e.service]}${e.machine ? ` · ${e.machine}` : ""} — ${e.message}`, 300));
  const head = e.urgency === "emergency" ? "🚨 EMERGENCY BREAKDOWN" : "New enquiry";

  if ((process.env.WHATSAPP_PROVIDER ?? "meta") === "twilio") {
    const sid = process.env.TWILIO_ACCOUNT_SID!;
    const body = new URLSearchParams({
      From: process.env.TWILIO_WHATSAPP_FROM!,
      To: `whatsapp:+${to}`,
      Body: `${head} · ${ticket}\n${who}\n${contact}\n\n${summary}`,
    });
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Twilio ${res.status}: ${await res.text()}`);
    return true;
  }

  const base = process.env.META_WA_API_BASE ?? "https://graph.facebook.com/v21.0";
  const res = await fetch(`${base}/${process.env.META_WA_PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.META_WA_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: process.env.META_WA_TEMPLATE ?? "emergency_enquiry",
        language: { code: process.env.META_WA_TEMPLATE_LANG ?? "en" },
        components: [
          {
            type: "body",
            parameters: [ticket, who, contact, summary].map((text) => ({ type: "text", text })),
          },
        ],
      },
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Meta WhatsApp ${res.status}: ${await res.text()}`);
  return true;
}
