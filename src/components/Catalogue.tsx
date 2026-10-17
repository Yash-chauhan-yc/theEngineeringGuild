"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileDown, MessageSquareText, Printer } from "lucide-react";
import Reveal from "./Reveal";
import FigureSvg from "./FigureSvg";
import { FIGURES } from "@/content/catalogue";
import { scrollToId } from "./ClientShell";

export const PREFILL_EVENT = "teg:prefill-enquiry";

export default function Catalogue() {
  const [active, setActive] = useState(0);
  const fig = FIGURES[active];
  const pdfHref = `/api/spec-sheet/${fig.id}`;

  const enquire = () => {
    window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: { figure: fig.num, service: fig.id === "plc" ? "repair" : fig.id === "gear" ? "manufacturing" : "spares", message: `Enquiry about ${fig.num} — ${fig.title}.\n\n` } }));
    scrollToId("#contact");
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
    const next = (active + dir + FIGURES.length) % FIGURES.length;
    setActive(next);
    document.getElementById(`fig-tab-${FIGURES[next].id}`)?.focus();
  };

  return (
    <section id="catalogue" data-testid="catalogue-section" className="py-24 lg:py-32 bg-slate-50/70 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase text-slate-500">Technical Product Catalogue</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display font-bold tracking-tight text-slate-900 text-3xl sm:text-4xl lg:text-5xl max-w-2xl leading-[1.05]">
              Precision, mapped to the blueprint.
            </h2>
            <p className="text-sm text-slate-500 max-w-xs">Every figure has a printable PDF spec sheet — download it, share it with your maintenance team, or quote its reference.</p>
          </div>
        </Reveal>

        <div className="mt-14 grid lg:grid-cols-12 gap-8 lg:gap-12">
          <Reveal className="lg:col-span-4 min-w-0">
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0" role="tablist" aria-label="Catalogue figures" onKeyDown={onKey}>
              {FIGURES.map((f, i) => (
                <button
                  key={f.id}
                  id={`fig-tab-${f.id}`}
                  role="tab"
                  aria-selected={active === i}
                  aria-controls="fig-panel"
                  tabIndex={active === i ? 0 : -1}
                  data-testid={`catalogue-figure-tab-${f.id}`}
                  onClick={() => setActive(i)}
                  className={`shrink-0 text-left px-5 py-4 rounded-2xl border transition-[background-color,border-color] duration-300 min-w-[220px] lg:min-w-0 ${
                    active === i ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-900 hover:border-slate-400"
                  }`}
                >
                  <span className={`font-mono text-[10px] tracking-[0.22em] ${active === i ? "text-blue-400" : "text-blue-600"}`}>{f.num}</span>
                  <span className="block mt-1 font-display font-semibold text-[15px] leading-snug">{f.title}</span>
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-8 min-w-0">
            <div id="fig-panel" role="tabpanel" aria-labelledby={`fig-tab-${fig.id}`} className="bg-white border border-slate-200 rounded-[28px] p-6 sm:p-10 blueprint-grid">
              <AnimatePresence mode="wait">
                <motion.div
                  key={fig.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-blue-600" data-testid="catalogue-figure-type">
                      {fig.num} — {fig.type}
                    </p>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-4 sm:p-8" data-testid={`catalogue-figure-canvas-${fig.id}`}>
                    <FigureSvg prims={fig.prims} id={fig.id} label={`${fig.title} schematic`} />
                  </div>
                  <h3 className="mt-7 font-display font-bold tracking-tight text-slate-900 text-xl sm:text-2xl">{fig.title}</h3>
                  <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">{fig.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2" data-testid="catalogue-spec-chips">
                    {fig.specs.map((s) => (
                      <span key={s} className="font-mono text-[10px] sm:text-[11px] tracking-[0.14em] text-slate-700 bg-slate-100 border border-slate-200 rounded-full px-3.5 py-1.5">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap gap-3">
                    <a
                      href={pdfHref}
                      download
                      data-testid={`spec-sheet-download-${fig.id}`}
                      className="inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold rounded-full px-5 py-3 hover:bg-blue-600 transition-colors"
                    >
                      <FileDown size={16} /> Download spec sheet (PDF)
                    </a>
                    <a
                      href={pdfHref}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-900 text-sm font-semibold rounded-full px-5 py-3 hover:border-slate-900 transition-colors"
                    >
                      <Printer size={16} /> View & print
                    </a>
                    <button
                      type="button"
                      onClick={enquire}
                      data-testid={`catalogue-enquire-${fig.id}`}
                      className="inline-flex items-center gap-2 text-slate-700 text-sm font-semibold rounded-full px-4 py-3 hover:text-blue-600 transition-colors"
                    >
                      <MessageSquareText size={16} /> Enquire about {fig.num}
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
