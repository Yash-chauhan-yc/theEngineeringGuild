"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import Reveal from "./Reveal";
import { FAQ } from "@/content/site-content";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" data-testid="faq-section" className="py-24 lg:py-32 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12">
        <Reveal className="lg:col-span-4">
          <p className="font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase text-slate-500">FAQ</p>
          <h2 className="mt-4 font-display font-bold tracking-tight text-slate-900 text-3xl sm:text-4xl lg:text-5xl leading-[1.05]">Straight answers.</h2>
          <p className="mt-5 text-slate-600 leading-relaxed">Can&apos;t find yours? Send it through the enquiry form and an engineer will reply.</p>
        </Reveal>
        <div className="lg:col-span-8 divide-y divide-slate-200 border-y border-slate-200">
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="font-display font-semibold text-lg sm:text-xl text-slate-900">{f.q}</span>
                    <span className={`shrink-0 w-9 h-9 rounded-full border grid place-items-center transition-all duration-300 ${isOpen ? "bg-slate-900 border-slate-900 text-white rotate-45" : "border-slate-300 text-slate-700"}`}>
                      <Plus size={16} />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-14 text-slate-600 leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
