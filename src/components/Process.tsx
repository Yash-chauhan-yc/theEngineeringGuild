import Reveal from "./Reveal";
import { PROCESS } from "@/content/site-content";

export default function Process() {
  return (
    <section id="process" data-testid="process-section" className="py-24 lg:py-28 bg-slate-50/70 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase text-slate-500">How an engagement runs</p>
          <h2 className="mt-4 font-display font-bold tracking-tight text-slate-900 text-3xl sm:text-4xl lg:text-5xl max-w-2xl leading-[1.05]">
            From ticket to handover, in four steps.
          </h2>
        </Reveal>
        <ol className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200 rounded-[24px] overflow-hidden">
          {PROCESS.map((p, i) => (
            <li key={p.step} className="bg-white p-7 sm:p-8">
              <Reveal delay={i * 0.06}>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] tracking-[0.24em] text-blue-600">{p.step}</span>
                  <span className="h-px flex-1 bg-slate-200" />
                </div>
                <h3 className="mt-5 font-display font-bold tracking-tight text-lg text-slate-900">{p.title}</h3>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{p.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
