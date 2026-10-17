import { NextResponse, type NextRequest } from "next/server";
import { enquirySchema } from "@/lib/enquiry-schema";
import { rateLimit } from "@/lib/rate-limit";
import { makeTicket } from "@/lib/ticket";
import { emailConfigured, sendEnquiryEmails } from "@/lib/email";
import { sendWhatsAppAlert, shouldAlert, whatsappConfigured } from "@/lib/whatsapp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  const limit = rateLimit(`enq:${clientIp(req)}`);
  if (!limit.ok) {
    return NextResponse.json(
      { detail: "Too many enquiries from this connection. Please call us or try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "Invalid request body." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message]));
    // Honeypot tripped → pretend success so bots learn nothing
    if (fieldErrors.website) return NextResponse.json({ ticket: makeTicket("standard"), email_sent: true, whatsapp_sent: false });
    return NextResponse.json({ detail: parsed.error.issues[0]?.message ?? "Please check the fields.", fieldErrors }, { status: 422 });
  }

  const enquiry = parsed.data;
  const ticket = makeTicket(enquiry.urgency);

  const [emailRes, waRes, hookRes] = await Promise.allSettled([
    emailConfigured() ? sendEnquiryEmails(enquiry, ticket) : Promise.resolve(false),
    whatsappConfigured() && shouldAlert(enquiry) ? sendWhatsAppAlert(enquiry, ticket) : Promise.resolve(false),
    process.env.ENQUIRY_WEBHOOK_URL
      ? fetch(process.env.ENQUIRY_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ticket, receivedAt: new Date().toISOString(), ...enquiry, website: undefined }),
          signal: AbortSignal.timeout(8000),
        }).then((r) => r.ok)
      : Promise.resolve(false),
  ]);

  for (const [name, r] of [["email", emailRes], ["whatsapp", waRes], ["webhook", hookRes]] as const) {
    if (r.status === "rejected") console.error(`[enquiry ${ticket}] ${name} failed:`, r.reason);
  }

  const email_sent = emailRes.status === "fulfilled" && emailRes.value === true;
  const whatsapp_sent = waRes.status === "fulfilled" && waRes.value === true;
  const webhook_sent = hookRes.status === "fulfilled" && hookRes.value === true;

  // Always log to server output so nothing is lost even if every channel is down
  console.info(`[enquiry] ${ticket} ${enquiry.urgency} ${enquiry.service} <${enquiry.email}> email=${email_sent} wa=${whatsapp_sent} hook=${webhook_sent}`);

  if (!email_sent && !webhook_sent && (emailConfigured() || process.env.ENQUIRY_WEBHOOK_URL)) {
    return NextResponse.json(
      { detail: "We couldn't deliver your enquiry right now. Please call or WhatsApp us directly.", ticket },
      { status: 502 },
    );
  }

  return NextResponse.json({ ticket, email_sent, whatsapp_sent });
}
