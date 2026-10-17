import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { FIGURES } from "@/content/catalogue";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...FIGURES.map((f) => ({ url: `${site.url}/api/spec-sheet/${f.id}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
