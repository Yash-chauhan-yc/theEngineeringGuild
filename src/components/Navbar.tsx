"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { nav } from "@/config/site";
import { Wordmark } from "./Logo";
import { scrollToId } from "./ClientShell";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view
  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(href);
  };

  return (
    <header
      data-testid="navbar"
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open ? "bg-white/85 backdrop-blur-xl border-b border-slate-200" : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between" aria-label="Main">
        <a href="#top" onClick={(e) => go(e, "#top")} aria-label="The Engineering Guild — home">
          <Wordmark />
        </a>

        <ul className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                onClick={(e) => go(e, n.href)}
                className={`px-3.5 py-2 rounded-full text-[13.5px] font-medium transition-colors ${
                  active === n.href ? "text-slate-900 bg-slate-100" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            onClick={(e) => go(e, "#contact")}
            data-testid="nav-cta"
            className="hidden sm:inline-flex items-center gap-1.5 bg-slate-900 text-white text-[13px] font-semibold rounded-full pl-4 pr-3 py-2.5 hover:bg-blue-600 transition-colors"
          >
            Request a Quote <ArrowUpRight size={15} />
          </a>
          <button
            className="lg:hidden w-10 h-10 grid place-items-center rounded-full border border-slate-200 bg-white"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden border-t border-slate-200 bg-white"
          >
            <ul className="px-4 py-4 flex flex-col">
              {nav.map((n, i) => (
                <li key={n.href}>
                  <a href={n.href} onClick={(e) => go(e, n.href)} className="flex items-baseline gap-4 py-3.5 border-b border-slate-100">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-blue-600">0{i + 1}</span>
                    <span className="font-display font-semibold text-xl">{n.label}</span>
                  </a>
                </li>
              ))}
              <li className="pt-5">
                <a href="#contact" onClick={(e) => go(e, "#contact")} className="flex justify-center items-center gap-2 bg-slate-900 text-white font-semibold rounded-2xl py-4">
                  Request a Quote <ArrowUpRight size={16} />
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
