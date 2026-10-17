import { nav, site } from "@/config/site";
import { FIGURES } from "@/content/catalogue";
import { SERVICES } from "@/content/site-content";
import { Wordmark } from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer data-testid="footer" className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <Wordmark light />
            <p className="mt-5 text-sm leading-relaxed max-w-xs">{site.description}</p>
            <p className="mt-5 font-mono text-[10px] tracking-[0.2em] uppercase text-slate-500">{site.hours}</p>
          </div>
          <div className="md:col-span-3">
            <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-slate-500">Services</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SERVICES.map((s) => (
                <li key={s.id}><a href="#services" className="hover:text-white transition-colors">{s.title}</a></li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3">
            <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-slate-500">Spec sheets</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {FIGURES.map((f) => (
                <li key={f.id}>
                  <a href={`/api/spec-sheet/${f.id}`} className="hover:text-white transition-colors">
                    <span className="font-mono text-[11px] text-blue-400 mr-2">{f.num}</span>
                    {f.title.split(" ").slice(0, 3).join(" ")}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-slate-500">Explore</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {nav.map((n) => (
                <li key={n.href}><a href={n.href} className="hover:text-white transition-colors">{n.label}</a></li>
              ))}
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <p>© {year} {site.name}. All rights reserved.</p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
            <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} className="hover:text-white">{site.phone}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
