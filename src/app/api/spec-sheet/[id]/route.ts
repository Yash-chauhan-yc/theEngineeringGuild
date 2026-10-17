import { FIGURES, getFigure } from "@/content/catalogue";
import { buildSpecSheet } from "@/lib/spec-sheet-pdf";

export const runtime = "nodejs";
// PDFs are rendered once at build time and served statically
export const dynamic = "force-static";

export function generateStaticParams() {
  return FIGURES.map((f) => ({ id: f.id }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fig = getFigure(id);
  if (!fig) return new Response("Spec sheet not found", { status: 404 });

  const bytes = await buildSpecSheet(fig);
  const filename = `Engineering-Guild-${fig.num.replace(".", "")}-${fig.id}-spec-sheet.pdf`;
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
