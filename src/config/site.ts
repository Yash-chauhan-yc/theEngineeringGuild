/**
 * Central business details. Change these once and the whole site,
 * the SEO metadata, the PDF spec sheets and the emails all update.
 */
export const site = {
  name: "The Engineering Guild",
  shortName: "Engineering Guild",
  tagline: "Printing, Packaging & Converting Solutions",
  description:
    "The Engineering Guild — your turnkey partner in printing, packaging & converting solutions. Machinery retrofits, automation lab repairs, precision manufacturing and industrial spares.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://theengineeringguild.online",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "theengineeringguild2026@gmail.com",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+91 87449 71470",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "918744971470",
  address: "Industrial Estate — address on request",
  hours: "Mon–Sat · 09:00–19:00 IST · 24/7 emergency automation line",
  responseTime: "within one working day",
} as const;

export const nav = [
  { href: "#services", label: "Services" },
  { href: "#products", label: "Products" },
  { href: "#catalogue", label: "Catalogue" },
  { href: "#gallery", label: "Retrofits" },
  { href: "#about", label: "About" },
  { href: "#brands", label: "OEM Systems" },
  { href: "#faq", label: "FAQ" },
] as const;