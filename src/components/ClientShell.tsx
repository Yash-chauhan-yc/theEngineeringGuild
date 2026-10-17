"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { Toaster } from "sonner";
import { MotionConfig } from "framer-motion";
import FloatingWhatsApp from "./FloatingWhatsApp";

declare global {
  interface Window { __lenis?: Lenis | null }
}

export default function ClientShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    window.__lenis = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
    <div data-testid="app-root">
      {children}
      <FloatingWhatsApp />
      <Toaster position="bottom-right" richColors />
    </div>
    </MotionConfig>
  );
}

/** Smooth-scroll to an in-page anchor, respecting the sticky header. */
export function scrollToId(hash: string) {
  const el = document.querySelector(hash);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el as HTMLElement, { offset: -80 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", hash);
}
