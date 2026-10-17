import { Check } from "lucide-react";
import Reveal from "./Reveal";
import { SERVICES } from "@/content/site-content";

export default function Services() {
  return (
    <section id="services" data-testid="services-section" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-6 items-end">
          <Reveal className="lg:col-span-7">
            <p className="font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase text-slate-500">What we do</p>
            <h2 className="mt-4 font-display font-bold tracking-tight text-slate-900 text-3xl sm:text-4xl lg:text-5xl leading-[1.05]">
              Four disciplines. One accountable team.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              From a single servo board to a full press modernisation, the same engineers diagnose, quote and deliver — so nothing gets lost between vendors.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-5">
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.06}>
              <article
                data-testid={`service-card-${s.id}`}
                className="group h-full bg-white border border-slate-200 rounded-[24px] p-7 sm:p-9 hover:border-slate-900 hover:shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)] transition-[border-color,box-shadow] duration-500"
              >
                <div className="flex items-start justify-between">
                  <span className="w-12 h-12 rounded-2xl bg-slate-900 text-white grid place-items-center group-hover:bg-blue-600 transition-colors duration-500">
                    <s.icon size={20} />
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.24em] text-slate-400">{s.num}</span>
                </div>
                <h3 className="mt-7 font-display font-bold tracking-tight text-xl sm:text-2xl text-slate-900">{s.title}</h3>
                <p className="mt-3 text-slate-600 leading-relaxed">{s.lead}</p>
                <ul className="mt-6 grid sm:grid-cols-2 gap-x-5 gap-y-2.5">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
                      <Check size={15} className="mt-0.5 shrink-0 text-blue-600" /> {p}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
