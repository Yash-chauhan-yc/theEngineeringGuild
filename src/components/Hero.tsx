"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { ArrowRight, FileDown, Zap } from "lucide-react";
import { scrollToId } from "./ClientShell";

const ease = [0.22, 1, 0.36, 1] as const;

const READOUTS = [
  { k: "AXIS SYNC", v: "±0.01°" },
  { k: "BENCH TESTED", v: "100%" },
  { k: "EMERGENCY LINE", v: "24 / 7" },
];

function HeroSchematic() {
  const reduce = usePrefersReducedMotion();
  const rollers = [
    { cx: 110, cy: 150, r: 44 },
    { cx: 230, cy: 110, r: 30 },
    { cx: 230, cy: 196, r: 30 },
    { cx: 350, cy: 150, r: 44 },
  ];
  return (
    <svg viewBox="0 0 460 300" className="w-full h-auto" role="img" aria-label="Animated schematic of a press roller train">
      <path d="M 20 150 L 66 150 M 154 150 C 180 150, 190 110, 200 110 M 260 110 C 280 110, 290 150, 306 150 M 394 150 L 440 150" stroke="#3B82F6" strokeWidth="2.2" fill="none" strokeDasharray="6 6">
        {!reduce && <animate attributeName="stroke-dashoffset" from="0" to="-48" dur="1.6s" repeatCount="indefinite" />}
      </path>
      {rollers.map((r, i) => (
        <g key={i}>
          <circle cx={r.cx} cy={r.cy} r={r.r} fill="none" stroke="#E2E8F0" strokeWidth="2" />
          <circle cx={r.cx} cy={r.cy} r={r.r - 9} fill="none" stroke="#64748B" strokeWidth="1" strokeDasharray="3 5" />
          <g>
            <line x1={r.cx} y1={r.cy - r.r + 4} x2={r.cx} y2={r.cy + r.r - 4} stroke="#94A3B8" strokeWidth="1" />
            <line x1={r.cx - r.r + 4} y1={r.cy} x2={r.cx + r.r - 4} y2={r.cy} stroke="#94A3B8" strokeWidth="1" />
            {!reduce && (
              <animateTransform attributeName="transform" type="rotate" from={`0 ${r.cx} ${r.cy}`} to={`${i % 2 ? -360 : 360} ${r.cx} ${r.cy}`} dur={`${6 + i}s`} repeatCount="indefinite" />
            )}
          </g>
          <circle cx={r.cx} cy={r.cy} r="4" fill="#3B82F6" />
          <text x={r.cx} y={r.cy + r.r + 18} textAnchor="middle" fontFamily="JetBrains Mono Variable, monospace" fontSize="9" letterSpacing="1.5" fill="#64748B">
            R-0{i + 1}
          </text>
        </g>
      ))}
      <text x="20" y="30" fontFamily="JetBrains Mono Variable, monospace" fontSize="9" letterSpacing="2" fill="#64748B">WEB PATH · TENSION ZONE 2</text>
      <text x="440" y="30" textAnchor="end" fontFamily="JetBrains Mono Variable, monospace" fontSize="9" letterSpacing="2" fill="#3B82F6">LIVE</text>
      <circle cx="404" cy="27" r="3.5" fill="#10B981">{!reduce && <animate attributeName="opacity" values="1;0.25;1" dur="1.6s" repeatCount="indefinite" />}</circle>
      <line x1="20" y1="270" x2="440" y2="270" stroke="#334155" strokeWidth="1" />
      {Array.from({ length: 22 }, (_, i) => (
        <line key={i} x1={20 + i * 20} y1="270" x2={20 + i * 20} y2={i % 5 === 0 ? 260 : 265} stroke="#334155" strokeWidth="1" />
      ))}
    </svg>
  );
}

export default function Hero() {
  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    scrollToId(id);
  };
  return (
    <section id="top" data-testid="hero-section" className="relative pt-[68px] overflow-hidden">
      <div aria-hidden className="absolute inset-0 blueprint-grid [mask-image:radial-gradient(ellipse_at_top_left,#000_30%,transparent_75%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 lg:pt-24 pb-20 lg:pb-28 grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        <div className="lg:col-span-6 min-w-0">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2.5 font-mono text-[11px] sm:text-xs tracking-[0.24em] uppercase text-slate-600 bg-white border border-slate-200 rounded-full pl-2 pr-4 py-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 ml-1" /> Printing · Packaging · Converting
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease }}
            className="mt-7 font-display font-bold tracking-tight text-slate-900 text-[42px] leading-[1.02] sm:text-6xl lg:text-[68px]"
          >
            Your turnkey partner for <span className="text-blue-600">machines that must not stop.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.16, ease }}
            className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl"
          >
            Machinery retrofits, automation lab repairs, precision manufacturing and industrial spares — one engineering team for every line in your plant.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.24, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href="#contact"
              onClick={(e) => go(e, "#contact")}
              data-testid="hero-cta-quote"
              className="group inline-flex items-center gap-2 bg-slate-900 text-white font-semibold rounded-full pl-6 pr-5 py-3.5 hover:bg-blue-600 transition-colors"
            >
              Start an enquiry <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#catalogue"
              onClick={(e) => go(e, "#catalogue")}
              data-testid="hero-cta-catalogue"
              className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-900 font-semibold rounded-full px-5 py-3.5 hover:border-slate-900 transition-colors"
            >
              <FileDown size={17} /> Spec sheets
            </a>
          </motion.div>

          <motion.a
            href="#contact"
            onClick={(e) => go(e, "#contact")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 inline-flex items-center gap-2 text-[13px] text-slate-600 hover:text-slate-900"
          >
            <Zap size={15} className="text-amber-500" /> Line down right now? Flag an emergency breakdown →
          </motion.a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease }}
          className="lg:col-span-6 min-w-0"
        >
          <div className="relative bg-slate-900 rounded-[28px] p-5 sm:p-7 blueprint-grid-dark shadow-[0_40px_80px_-40px_rgba(15,23,42,0.55)]">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-slate-400">FIG.00 — Roller train diagnostic</p>
              <p className="hidden sm:block font-mono text-[10px] tracking-[0.24em] uppercase text-blue-400">TEG-LAB</p>
            </div>
            <div className="mt-5">
              <HeroSchematic />
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden">
              {READOUTS.map((r) => (
                <div key={r.k} className="bg-slate-900 px-3 sm:px-4 py-4">
                  <dt className="font-mono text-[8.5px] sm:text-[9.5px] tracking-[0.2em] text-slate-500">{r.k}</dt>
                  <dd className="mt-1.5 font-display font-bold text-white text-lg sm:text-2xl">{r.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
