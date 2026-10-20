"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import Reveal from "./Reveal";
import { PRODUCTS, type Product } from "@/content/products";
import { PREFILL_EVENT } from "./Catalogue";
import { scrollToId } from "./ClientShell";

function ProductCard({ p }: { p: Product }) {
  const [i, setI] = useState(0);
  const img = p.images[i];

  const enquire = () => {
    window.dispatchEvent(
      new CustomEvent(PREFILL_EVENT, {
        detail: { figure: "", service: "spares", message: `Enquiry about ${p.title}.\n\nQuantity / size / machine: ` },
      }),
    );
    scrollToId("#contact");
  };

  return (
    <article data-testid={`product-card-${p.id}`} className="h-full flex flex-col bg-white border border-slate-200 rounded-[24px] overflow-hidden hover:border-slate-900 transition-colors duration-500">
      <div className="relative aspect-[4/3] bg-white border-b border-slate-200">
        <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw" className="object-contain p-5" />
      </div>
      {p.images.length > 1 && (
        <div className="flex gap-2 px-5 pt-4" role="group" aria-label={`${p.title} photos`}>
          {p.images.map((m, k) => (
            <button
              key={m.src}
              type="button"
              onClick={() => setI(k)}
              aria-label={`Show photo ${k + 1}: ${m.alt}`}
              aria-pressed={k === i}
              className={`relative w-14 h-11 rounded-lg overflow-hidden border bg-white transition-colors ${k === i ? "border-slate-900" : "border-slate-200 hover:border-slate-400"}`}
            >
              <Image src={m.src} alt="" fill sizes="56px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}
      <div className="flex-1 flex flex-col p-6 sm:p-7">
        <h3 className="font-display font-bold tracking-tight text-xl text-slate-900">{p.title}</h3>
        <p className="mt-2.5 text-[15px] text-slate-600 leading-relaxed">{p.lead}</p>
        <ul className="mt-5 space-y-2">
          {p.types.map((t) => (
            <li key={t} className="flex items-start gap-2 text-sm text-slate-700">
              <Check size={15} className="mt-0.5 shrink-0 text-blue-600" /> {t}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={enquire}
          className="mt-auto pt-6 self-start inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors"
        >
          Request price &amp; availability <ArrowUpRight size={16} />
        </button>
      </div>
    </article>
  );
}

export default function Products() {
  return (
    <section id="products" data-testid="products-section" className="py-24 lg:py-32 bg-slate-50/70 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase text-slate-500">Products we supply</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display font-bold tracking-tight text-slate-900 text-3xl sm:text-4xl lg:text-5xl max-w-2xl leading-[1.05]">
              Spares that keep the line running.
            </h2>
            <p className="text-sm text-slate-500 max-w-xs">Stocked and sourced for printing, packaging and converting machines. Send a part number or a photo and we&apos;ll match it.</p>
          </div>
        </Reveal>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCTS.map((p, k) => (
            <Reveal key={p.id} delay={k * 0.06} className="min-w-0 h-full">
              <ProductCard p={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}