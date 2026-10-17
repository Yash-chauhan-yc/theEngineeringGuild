import Reveal from "./Reveal";
import { BRANDS } from "@/content/site-content";

export default function Brands() {
  return (
    <section id="brands" data-testid="brands-section" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase text-slate-500">Supported OEM Systems</p>
          <h2 className="mt-4 font-display font-bold tracking-tight text-slate-900 text-3xl sm:text-4xl lg:text-5xl max-w-2xl leading-[1.05]">
            Fluent in every major drive language.
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200 rounded-[24px] overflow-hidden">
          {BRANDS.map((b, i) => (
            <div key={b.id} data-testid={`brand-logo-${b.id}`} className="group bg-white p-7 sm:p-9 hover:bg-slate-50 transition-colors duration-300">
              <Reveal delay={i * 0.05}>
                <p className="font-mono text-[9px] tracking-[0.24em] uppercase text-slate-400">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-4 font-display font-bold tracking-tight text-slate-900 text-lg sm:text-xl leading-tight group-hover:text-blue-600 transition-colors duration-300">{b.name}</p>
                <p className="mt-2 font-mono text-[10px] sm:text-[11px] tracking-[0.1em] uppercase text-slate-500">{b.category}</p>
              </Reveal>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs text-slate-400">Brand names are trademarks of their respective owners and indicate compatibility only; The Engineering Guild is an independent service provider.</p>
      </div>
    </section>
  );
}
