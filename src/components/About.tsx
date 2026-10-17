import Image from "next/image";
import Reveal from "./Reveal";
import { LogoMarkLight } from "./Logo";
import { PILLARS } from "@/content/site-content";

const IMG_ROLLERS =
  "https://images.unsplash.com/photo-1715433675788-9e0fb059d928?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400";
const IMG_PANEL =
  "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400";

export default function About() {
  return (
    <section id="about" data-testid="about-section" className="bg-slate-900 text-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-14 lg:gap-16">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex items-center gap-3">
                <LogoMarkLight size={26} />
                <p className="font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase text-slate-400">About the Guild</p>
              </div>
              <h2 className="mt-5 font-display font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl leading-[1.05]">
                Engineering support, end to end. Zero excuses.
              </h2>
              <p className="mt-6 text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
                At The Engineering Guild, we deliver industrial engineering support ranging from high-precision machinery retrofits and component-level electronic repairs to bespoke manufacturing of critical spares and rapid supplies of everyday plant wearables.
              </p>
            </Reveal>
            <div className="mt-12 grid sm:grid-cols-2 gap-x-8 gap-y-10">
              {PILLARS.map((p, i) => (
                <Reveal key={p.k} delay={0.08 * i}>
                  <p className="font-mono text-[11px] tracking-[0.3em] text-blue-400">{p.k}</p>
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">{p.v}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 flex flex-col gap-6">
            <Reveal delay={0.1}>
              <figure className="group relative rounded-[24px] overflow-hidden border border-white/10 h-64 sm:h-80">
                <Image src={IMG_ROLLERS} alt="Precision-machined steel rollers" fill sizes="(min-width:1024px) 45vw, 100vw" className="spotlight-img object-cover" />
                <figcaption className="absolute bottom-4 left-5 font-mono text-[9px] tracking-[0.22em] uppercase text-white/85">FIG.5 — Re-compounded roller line</figcaption>
              </figure>
            </Reveal>
            <Reveal delay={0.18}>
              <figure className="group relative rounded-[24px] overflow-hidden border border-white/10 h-52 sm:h-64">
                <Image src={IMG_PANEL} alt="Industrial control panel engineering" fill sizes="(min-width:1024px) 45vw, 100vw" className="spotlight-img object-cover" />
                <figcaption className="absolute bottom-4 left-5 font-mono text-[9px] tracking-[0.22em] uppercase text-white/85">FIG.6 — Automation lab panel build</figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
