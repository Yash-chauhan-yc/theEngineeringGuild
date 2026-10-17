# The Engineering Guild — Next.js website

Production-grade rebuild of the Engineering Guild site (printing, packaging & converting solutions) on **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4**, with real email delivery, PDF spec sheets, a before/after retrofit gallery and WhatsApp emergency alerts.

## Quick start

```bash
npm install
cp .env.example .env.local     # then fill in your values
npm run dev                    # http://localhost:3000
```

Production:

```bash
npm run build
npm start                      # or deploy to Vercel / Docker (see below)
```

Requires Node.js 20.9+.

---

## What's included

| Area | Details |
|---|---|
| **Site sections** | Navbar (active-section highlight, mobile menu) · Hero with animated roller-train schematic · Machine-type marquee · Services · Technical Product Catalogue (4 blueprint figures) · **Retrofit Gallery** · Engagement process · About · Supported OEM systems · FAQ · Enquiry / RFQ form · Footer |
| **1. Your real email** | Every enquiry is emailed to `ENQUIRY_TO_EMAIL` over SMTP (Gmail/Workspace, Zoho, Microsoft 365, SES, Brevo, Resend…). Reply-To is set to the customer, so you just hit *Reply*. Emergencies are flagged 🚨 with high priority. The customer also gets an automatic acknowledgement with their ticket number (turn off with `SEND_CUSTOMER_ACK=false`). |
| **2. Spec sheet downloads** | `/api/spec-sheet/{plc,gear,pulley,bearing}` returns a branded A4 PDF with the same vector blueprint as the website, key specs, a specification table, applications and your contact details. PDFs are generated at build time and served statically. |
| **3. Retrofit gallery** | Draggable before/after comparison slider (mouse, touch and keyboard), category filters, project details and outcomes. |
| **4. WhatsApp alerts** | Emergency enquiries ping your phone instantly via the **Meta WhatsApp Cloud API** or **Twilio**. Set `WHATSAPP_ALERT_ON=all` to get every enquiry. |
| **Extra** | Ticket numbers (`TEG-261017-EM-7K3Q`) · Zod validation with inline field errors · emergency requires a phone number · honeypot spam trap · per-IP rate limiting · "Enquire about FIG.xx" prefills the form · floating WhatsApp chat button · optional webhook to Google Sheets / Zapier / CRM · SEO metadata, Open Graph, sitemap, robots, web manifest, JSON-LD (business + FAQ) · security headers · self-hosted fonts · smooth scrolling (Lenis) · reduced-motion support · accessible tabs, radios, accordion and slider · custom 404 |

---

## Before you go live — checklist

1. **Contact details** → `.env.local` (`NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_WHATSAPP_NUMBER`) and the address/hours in `src/config/site.ts`.
2. **Email** → fill the SMTP block in `.env.local` (see below).
3. **Gallery photos** → the gallery ships with *placeholder artwork*. Put your real before/after photos in `public/gallery/` and update `src/content/gallery.ts` (titles, machine, location, outcomes). Real photos of your own jobs are what build buyer trust.
4. **WhatsApp** → set up Meta or Twilio (see below).
5. `NEXT_PUBLIC_SITE_URL` → your real domain (used in sitemap, SEO and the PDFs).

All copy lives in `src/content/` — services, catalogue figures, OEM brands, process steps and FAQ.

---

## Email setup (feature 1)

```env
ENQUIRY_TO_EMAIL=you@yourbusiness.com          # comma-separate for several inboxes
ENQUIRY_FROM_EMAIL="The Engineering Guild <no-reply@yourdomain.com>"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=you@yourbusiness.com
SMTP_PASS=your-app-password
```

- **Gmail / Google Workspace:** turn on 2-Step Verification, create an **App Password** and use it as `SMTP_PASS`.
- **Zoho Mail (India):** `smtp.zoho.in`, port 465.
- **Resend:** `smtp.resend.com`, port 465, user `resend`, password = your API key (verify your domain first).

`ENQUIRY_FROM_EMAIL` must be an address your provider allows you to send from, or mail will be rejected or land in spam. If email isn't configured, enquiries are still accepted and logged to the server output.

## WhatsApp alerts (feature 4)

### Option A — Meta WhatsApp Cloud API (recommended)

1. Create an app at <https://developers.facebook.com> → add **WhatsApp**.
2. Note the **Phone Number ID** and create a **permanent access token** (System User in Business Manager).
3. In WhatsApp Manager create a **Utility** message template named `emergency_enquiry`, language English, with this body:

   ```
   New enquiry {{1}}
   From: {{2}}
   Contact: {{3}}
   Details: {{4}}
   ```

4. Once approved, set:

   ```env
   WHATSAPP_PROVIDER=meta
   WHATSAPP_ALERT_TO=919XXXXXXXXX        # your phone, digits only
   META_WA_TOKEN=...
   META_WA_PHONE_NUMBER_ID=...
   META_WA_TEMPLATE=emergency_enquiry
   META_WA_TEMPLATE_LANG=en
   ```

Business-initiated WhatsApp messages must use an approved template — that's why the alert is a template rather than free text.

### Option B — Twilio

```env
WHATSAPP_PROVIDER=twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886   # sandbox or your approved sender
WHATSAPP_ALERT_TO=919XXXXXXXXX
```

With the Twilio sandbox, first send the join code from your phone to the sandbox number.

## Optional: log every enquiry to Google Sheets

Set `ENQUIRY_WEBHOOK_URL` to any endpoint that accepts a JSON POST (a Google Apps Script web app, Zapier, Make, n8n or your CRM). Each enquiry is sent with its ticket number and timestamp.

---

## Deployment

**Vercel:** import the repo, add the environment variables from `.env.example`, deploy. (The in-memory rate limiter is per instance; for heavy traffic swap `src/lib/rate-limit.ts` for Upstash Redis.)

**VPS / Docker:**

```bash
docker build -t engineering-guild .
docker run -p 3000:3000 --env-file .env.local engineering-guild
```

Put it behind Nginx or Caddy for HTTPS.

## Project structure

```
src/
  app/
    api/enquiries/route.ts        enquiry endpoint: validate → email + WhatsApp + webhook
    api/spec-sheet/[id]/route.ts  PDF spec sheets
    layout.tsx  page.tsx  globals.css  sitemap.ts  robots.ts  manifest.ts  not-found.tsx
  components/                     one file per section + BeforeAfter, FigureSvg, Reveal, Logo…
  config/site.ts                  business name, contact details, nav
  content/                        all editable copy: catalogue, gallery, services, FAQ, brands
  lib/                            email, whatsapp, spec-sheet-pdf, validation, rate-limit, ticket
public/gallery/                   before/after images (placeholders included)
```

Catalogue blueprints are defined once as drawing primitives in `src/content/catalogue.ts`, so the website SVG and the PDF always match. Add a figure there and it appears in the tabs, the footer, the sitemap and gets its own PDF automatically.
