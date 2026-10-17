"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, MapPin, CheckCircle2 } from "lucide-react";
import Reveal from "./Reveal";
import BeforeAfter from "./BeforeAfter";
import { GALLERY, type GalleryCategory } from "@/content/gallery";

const ALL = "All projects" as const;

export default function Gallery() {
  const cats = useMemo(() => [ALL, ...Array.from(new Set(GALLERY.map((g) => g.category)))] as (typeof ALL | GalleryCategory)[], []);
  const [cat, setCat] = useState<(typeof cats)[number]>(ALL);
  const items = cat === ALL ? GALLERY : GALLERY.filter((g) => g.category === cat);
  const [activeId, setActiveId] = useState(GALLERY[0].id);
  const active = items.find((g) => g.id === activeId) ?? items[0];

  return (
    <section id="gallery" data-testid="gallery-section" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase text-slate-500">Retrofit Gallery</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display font-bold tracking-tight text-slate-900 text-3xl sm:text-4xl lg:text-5xl max-w-2xl leading-[1.05]">
              Before the Guild. After the Guild.
            </h2>
            <p className="text-sm text-slate-500 max-w-xs">Drag the handle to compare. Every project ships with a written handover report.</p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
            {cats.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={cat === c}
                onClick={() => {
                  setCat(c);
                  const first = c === ALL ? GALLERY[0] : GALLERY.find((g) => g.category === c);
                  if (first) setActiveId(first.id);
                }}
                className={`text-[13px] font-medium px-4 py-2 rounded-full border transition-colors duration-300 ${
                  cat === c ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-300 text-slate-600 hover:border-slate-900"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 grid lg:grid-cols-12 gap-8">
          <Reveal delay={0.1} className="lg:col-span-8 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div key={active.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                <BeforeAfter before={active.before} after={active.after} alt={active.title} />
              </motion.div>
            </AnimatePresence>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-4 min-w-0">
            <div className="h-full flex flex-col bg-slate-50 border border-slate-200 rounded-[24px] p-6 sm:p-8">
              <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-blue-600">{active.category}</p>
              <h3 className="mt-3 font-display font-bold tracking-tight text-2xl text-slate-900">{active.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{active.machine}</p>
              <p className="mt-4 text-slate-600 leading-relaxed text-[15px]">{active.summary}</p>
              <ul className="mt-5 space-y-2.5">
                {active.outcomes.map((o) => (
                  <li key={o} className="flex gap-2 text-sm text-slate-700">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" /> {o}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-slate-500">
                <span className="inline-flex items-center gap-1.5"><Clock size={14} /> {active.duration}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {active.location}</span>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3" role="tablist" aria-label="Projects">
          {items.map((g) => (
            <button
              key={g.id}
              role="tab"
              aria-selected={g.id === active.id}
              onClick={() => setActiveId(g.id)}
              data-testid={`gallery-thumb-${g.id}`}
              className={`group text-left rounded-2xl border p-2 transition-colors ${g.id === active.id ? "border-slate-900 bg-white" : "border-slate-200 bg-white hover:border-slate-400"}`}
            >
              <span className="block aspect-[3/2] rounded-xl overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.after} alt="" loading="lazy" className="w-full h-full object-cover" />
              </span>
              <span className="block px-1.5 pt-2.5 pb-1 text-[13px] font-semibold text-slate-900 leading-snug">{g.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
