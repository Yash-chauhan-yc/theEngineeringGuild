import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { site } from "@/config/site";
import { SERVICES, FAQ } from "@/content/site-content";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  keywords: [
    "printing machine retrofit", "packaging machinery repair", "converting machine spares", "PLC repair", "servo drive repair",
    "Bosch Rexroth repair", "Siemens S7 retrofit", "rubber roller recompounding", "gear manufacturing", "printing press automation India",
  ],
  applicationName: site.name,
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: site.name, title: `${site.name} — ${site.tagline}`, description: site.description, locale: "en_IN" },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${site.url}/#org`,
      name: site.name,
      description: site.description,
      url: site.url,
      email: site.email,
      telephone: site.phone,
      areaServed: "IN",
      knowsAbout: ["Printing machinery", "Packaging machinery", "Converting machinery", "Industrial automation"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Engineering services",
        itemListElement: SERVICES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.lead } })),
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 font-sans antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-slate-900 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
          Skip to content
        </a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
