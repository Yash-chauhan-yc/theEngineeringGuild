import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, LineCapStyle } from "pdf-lib";
import type { Figure, Prim, Tone } from "@/content/catalogue";
import { site } from "@/config/site";

const C = {
  ink: rgb(0x0f / 255, 0x17 / 255, 0x2a / 255),
  blue: rgb(0x25 / 255, 0x63 / 255, 0xeb / 255),
  mut: rgb(0x94 / 255, 0xa3 / 255, 0xb8 / 255),
  white: rgb(1, 1, 1),
  slate600: rgb(0x47 / 255, 0x55 / 255, 0x69 / 255),
  line: rgb(0xe2 / 255, 0xe8 / 255, 0xf0 / 255),
  grid: rgb(0xf1 / 255, 0xf5 / 255, 0xf9 / 255),
  emerald: rgb(0x10 / 255, 0xb9 / 255, 0x81 / 255),
};
const tone = (t?: Tone) => (t ? C[t] : undefined);

/** Standard PDF fonts use WinAnsi; map the few glyphs it lacks. */
const safe = (s: string) =>
  s.replace(/≤/g, "<=").replace(/≥/g, ">=").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/…/g, "...").replace(/[^\x20-\x7E -ÿ—–·•×±°Ø]/g, "");

function wrap(text: string, font: PDFFont, size: number, maxW: number) {
  const words = safe(text).split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (font.widthOfTextAtSize(next, size) > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

function drawFigure(page: PDFPage, prims: Prim[], ox: number, oyTop: number, s: number, mono: PDFFont, monoBold: PDFFont) {
  const X = (x: number) => ox + x * s;
  const Y = (y: number) => oyTop - y * s;
  for (const p of prims) {
    switch (p.t) {
      case "line":
        page.drawLine({ start: { x: X(p.x1), y: Y(p.y1) }, end: { x: X(p.x2), y: Y(p.y2) }, thickness: p.w * s, color: C[p.stroke], dashArray: p.dash?.map((d) => d * s), lineCap: LineCapStyle.Round });
        break;
      case "rect":
        page.drawRectangle({ x: X(p.x), y: Y(p.y + p.height), width: p.width * s, height: p.height * s, color: tone(p.fill), borderColor: tone(p.stroke), borderWidth: p.stroke ? (p.w ?? 1) * s : 0 });
        break;
      case "circle":
        page.drawCircle({ x: X(p.cx), y: Y(p.cy), size: p.r * s, color: tone(p.fill), borderColor: tone(p.stroke), borderWidth: p.stroke ? (p.w ?? 1) * s : 0, borderDashArray: p.dash?.map((d) => d * s) });
        break;
      case "path":
        page.drawSvgPath(p.d, { x: ox, y: oyTop, scale: s, borderColor: C[p.stroke], borderWidth: p.w, borderDashArray: p.dash?.map((d) => d * s), borderLineCap: LineCapStyle.Round });
        break;
      case "text": {
        const font = p.fill === "white" ? monoBold : mono;
        const size = p.size * s;
        const txt = safe(p.text);
        const extra = (p.spacing ?? 0) * s * 0.35;
        const w = font.widthOfTextAtSize(txt, size) + extra * txt.length;
        const x = p.anchor === "middle" ? X(p.x) - w / 2 : X(p.x);
        page.drawText(txt, { x, y: Y(p.y) - size * 0.32, size, font, color: C[p.fill], characterSpacing: extra } as Parameters<PDFPage["drawText"]>[1]);
        break;
      }
    }
  }
}

export async function buildSpecSheet(fig: Figure) {
  const doc = await PDFDocument.create();
  doc.setTitle(`${fig.num} — ${fig.title} · Spec Sheet`);
  doc.setAuthor(site.name);
  doc.setSubject(fig.type);
  doc.setKeywords([fig.id, ...fig.specs]);
  doc.setCreator(site.name);
  doc.setProducer(site.name);

  const page = doc.addPage([595.28, 841.89]); // A4
  const { width: W, height: H } = page.getSize();
  const sans = await doc.embedFont(StandardFonts.Helvetica);
  const sansBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const mono = await doc.embedFont(StandardFonts.Courier);
  const monoBold = await doc.embedFont(StandardFonts.CourierBold);
  const M = 44;

  // Header band
  page.drawRectangle({ x: 0, y: H - 88, width: W, height: 88, color: C.ink });
  page.drawText(safe(site.name), { x: M, y: H - 44, size: 16, font: sansBold, color: C.white });
  page.drawText(safe(site.tagline.toUpperCase()), { x: M, y: H - 62, size: 7.5, font: mono, color: C.mut });
  const tag = "TECHNICAL SPEC SHEET";
  page.drawText(tag, { x: W - M - monoBold.widthOfTextAtSize(tag, 9), y: H - 44, size: 9, font: monoBold, color: rgb(0.38, 0.6, 1) });
  const date = `ISSUED ${new Date().toISOString().slice(0, 10)}`;
  page.drawText(date, { x: W - M - mono.widthOfTextAtSize(date, 7.5), y: H - 62, size: 7.5, font: mono, color: C.mut });

  // Title block
  let y = H - 124;
  page.drawText(safe(`${fig.num} — ${fig.type}`.toUpperCase()), { x: M, y, size: 8.5, font: mono, color: C.blue });
  y -= 26;
  for (const l of wrap(fig.title, sansBold, 21, W - 2 * M)) {
    page.drawText(l, { x: M, y, size: 21, font: sansBold, color: C.ink });
    y -= 26;
  }

  // Blueprint panel
  const panelH = 250;
  const panelTop = y - 4;
  page.drawRectangle({ x: M, y: panelTop - panelH, width: W - 2 * M, height: panelH, color: C.white, borderColor: C.line, borderWidth: 1 });
  for (let gx = M + 18; gx < W - M; gx += 18) page.drawLine({ start: { x: gx, y: panelTop - panelH }, end: { x: gx, y: panelTop }, thickness: 0.4, color: C.grid });
  for (let gy = panelTop - 18; gy > panelTop - panelH; gy -= 18) page.drawLine({ start: { x: M, y: gy }, end: { x: W - M, y: gy }, thickness: 0.4, color: C.grid });
  const s = 0.78;
  drawFigure(page, fig.prims, (W - 400 * s) / 2, panelTop - (panelH - 300 * s) / 2, s, mono, monoBold);
  y = panelTop - panelH - 26;

  // Description
  for (const l of wrap(fig.description, sans, 10.5, W - 2 * M)) {
    page.drawText(l, { x: M, y, size: 10.5, font: sans, color: C.slate600 });
    y -= 15;
  }
  y -= 10;

  // Key spec chips
  let cx = M;
  for (const spec of fig.specs) {
    const t = safe(spec);
    const w = mono.widthOfTextAtSize(t, 8.5) + 20;
    if (cx + w > W - M) { cx = M; y -= 26; }
    page.drawRectangle({ x: cx, y: y - 6, width: w, height: 20, color: C.grid, borderColor: C.line, borderWidth: 0.8 });
    page.drawText(t, { x: cx + 10, y: y, size: 8.5, font: mono, color: C.ink });
    cx += w + 8;
  }
  y -= 34;

  // Details table
  page.drawText("SPECIFICATIONS", { x: M, y, size: 8, font: monoBold, color: C.mut });
  y -= 8;
  const colW = 150;
  for (const d of fig.details) {
    const lines = wrap(d.value, sans, 9.5, W - 2 * M - colW - 10);
    const rowH = 8 + lines.length * 13;
    page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.6, color: C.line });
    page.drawText(safe(d.label.toUpperCase()), { x: M, y: y - 15, size: 7.5, font: mono, color: C.slate600 });
    lines.forEach((l, i) => page.drawText(l, { x: M + colW, y: y - 15 - i * 13, size: 9.5, font: sans, color: C.ink }));
    y -= rowH + 4;
  }
  page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.6, color: C.line });
  y -= 22;

  // Applications
  page.drawText("TYPICAL APPLICATIONS", { x: M, y, size: 8, font: monoBold, color: C.mut });
  y -= 16;
  page.drawText(safe(fig.applications.join("   ·   ")), { x: M, y, size: 9.5, font: sans, color: C.ink, maxWidth: W - 2 * M });

  // Footer
  page.drawRectangle({ x: 0, y: 0, width: W, height: 62, color: C.grid });
  page.drawCircle({ x: M + 4, y: 38, size: 3.5, color: C.emerald });
  page.drawText("Request a quote for this item — quote the reference below.", { x: M + 14, y: 35, size: 9, font: sansBold, color: C.ink });
  page.drawText(safe(`REF ${fig.num} / ${fig.id.toUpperCase()}   ·   ${site.email}   ·   ${site.phone}   ·   ${site.url.replace(/^https?:\/\//, "")}`), { x: M, y: 18, size: 7.5, font: mono, color: C.slate600 });

  return doc.save();
}
