import nodemailer, { type Transporter } from "nodemailer";
import { site } from "@/config/site";
import { SERVICE_LABEL, type Enquiry } from "./enquiry-schema";

let transporter: Transporter | null = null;

export function emailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.ENQUIRY_TO_EMAIL);
}

function getTransporter() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT ?? 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: (process.env.SMTP_SECURE ?? String(port === 465)) === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function row(label: string, value: string) {
  if (!value) return "";
  return `<tr><td style="padding:8px 12px;color:#64748b;font:11px/1.4 ui-monospace,Menlo,monospace;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:8px 12px;color:#0f172a;font:14px/1.5 -apple-system,Segoe UI,Roboto,sans-serif">${esc(value)}</td></tr>`;
}

function shell(title: string, inner: string) {
  return `<!doctype html><html><body style="margin:0;background:#f1f5f9;padding:24px">
<table role="presentation" width="100%" style="max-width:620px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
<tr><td style="background:#0f172a;padding:20px 24px;color:#fff;font:600 16px -apple-system,Segoe UI,Roboto,sans-serif">${esc(site.name)}<div style="font:11px ui-monospace,Menlo,monospace;letter-spacing:.2em;color:#94a3b8;margin-top:4px;text-transform:uppercase">${esc(title)}</div></td></tr>
<tr><td style="padding:24px">${inner}</td></tr>
<tr><td style="padding:16px 24px;border-top:1px solid #e2e8f0;color:#94a3b8;font:12px -apple-system,Segoe UI,Roboto,sans-serif">${esc(site.name)} · ${esc(site.phone)} · ${esc(site.email)}</td></tr>
</table></body></html>`;
}

export async function sendEnquiryEmails(e: Enquiry, ticket: string) {
  const t = getTransporter();
  const from = process.env.ENQUIRY_FROM_EMAIL ?? process.env.SMTP_USER!;
  const to = process.env.ENQUIRY_TO_EMAIL!.split(",").map((s) => s.trim()).filter(Boolean);
  const emergency = e.urgency === "emergency";

  const banner = emergency
    ? `<div style="background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;border-radius:12px;padding:12px 16px;font:600 14px -apple-system,Segoe UI,Roboto,sans-serif;margin-bottom:16px">⚡ EMERGENCY BREAKDOWN — call the customer back now${e.phone ? `: <a href="tel:${esc(e.phone.replace(/\s/g, ""))}" style="color:#b91c1c">${esc(e.phone)}</a>` : ""}</div>`
    : "";

  const internal = shell(
    `New enquiry · ${ticket}`,
    `${banner}<table role="presentation" width="100%" style="border-collapse:collapse">
${row("Ticket", ticket)}${row("Urgency", emergency ? "EMERGENCY" : "Standard")}${row("Service", SERVICE_LABEL[e.service])}
${row("Name", e.name)}${row("Company", e.company)}${row("Email", e.email)}${row("Phone", e.phone)}${row("Machine", e.machine)}${row("Catalogue ref", e.figure)}
</table>
<div style="margin-top:16px;padding:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;color:#0f172a;font:14px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;white-space:pre-wrap">${esc(e.message)}</div>`,
  );

  const jobs: Promise<unknown>[] = [
    t.sendMail({
      from,
      to,
      replyTo: `${e.name} <${e.email}>`,
      subject: `${emergency ? "🚨 EMERGENCY · " : ""}[${ticket}] ${SERVICE_LABEL[e.service]} — ${e.company || e.name}`,
      html: internal,
      text: `Ticket ${ticket}\nUrgency: ${e.urgency}\nService: ${SERVICE_LABEL[e.service]}\nName: ${e.name}\nCompany: ${e.company}\nEmail: ${e.email}\nPhone: ${e.phone}\nMachine: ${e.machine}\n\n${e.message}`,
      priority: emergency ? "high" : "normal",
    }),
  ];

  if ((process.env.SEND_CUSTOMER_ACK ?? "true") === "true") {
    jobs.push(
      t.sendMail({
        from,
        to: e.email,
        replyTo: to[0],
        subject: `We've received your enquiry — ${ticket}`,
        html: shell(
          "Enquiry received",
          `<p style="font:15px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#0f172a;margin:0 0 12px">Hi ${esc(e.name.split(" ")[0])},</p>
<p style="font:15px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#334155;margin:0 0 12px">Thanks for contacting ${esc(site.name)}. Your enquiry is logged as <strong>${ticket}</strong> and has been routed to an engineer.</p>
<p style="font:15px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#334155;margin:0 0 12px">${
            emergency
              ? "Because you flagged an <strong>emergency breakdown</strong>, our 24/7 automation line has been alerted and will call you shortly."
              : `You can expect a response ${esc(site.responseTime)}.`
          }</p>
<p style="font:15px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#334155;margin:0">Simply reply to this email to add drawings, photos or fault codes.</p>`,
        ),
        text: `Hi ${e.name.split(" ")[0]},\n\nThanks for contacting ${site.name}. Your enquiry is logged as ${ticket}. ${
          emergency ? "Our 24/7 automation line has been alerted and will call you shortly." : `Expect a response ${site.responseTime}.`
        }\n\nReply to this email to add drawings, photos or fault codes.`,
      }),
    );
  }

  const results = await Promise.allSettled(jobs);
  const internalOk = results[0].status === "fulfilled";
  results.forEach((r) => r.status === "rejected" && console.error("[email]", r.reason));
  return internalOk;
}
