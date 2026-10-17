import { MARQUEE } from "@/content/site-content";

export default function Marquee() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div data-testid="marquee" className="bg-slate-900 text-white py-5 overflow-hidden marquee-mask" aria-label="Machine types we support">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {items.map((m, i) => (
          <span key={i} aria-hidden={i >= MARQUEE.length} className="flex items-center gap-6 pr-6 font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase text-slate-300 whitespace-nowrap">
            {m}
            <span className="w-1.5 h-1.5 rotate-45 bg-blue-500" />
          </span>
        ))}
      </div>
    </div>
  );
}
