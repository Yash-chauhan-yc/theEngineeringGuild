"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { site } from "@/config/site";

/** Floating "chat on WhatsApp" button (bottom-left so it never covers toasts). */
export default function FloatingWhatsApp() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 400);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const text = encodeURIComponent(`Hello ${site.name}, I need help with a machine.`);
  return (
    <a
      href={`https://wa.me/${site.whatsapp}?text=${text}`}
      target="_blank"
      rel="noopener"
      aria-label="Chat with an engineer on WhatsApp"
      data-testid="floating-whatsapp"
      className={`no-print fixed bottom-5 left-5 z-40 flex items-center gap-2.5 rounded-full bg-[#25D366] text-white pl-3.5 pr-4 py-3 shadow-[0_14px_30px_-10px_rgba(37,211,102,0.7)] transition-all duration-500 hover:-translate-y-0.5 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <MessageCircle size={20} strokeWidth={2.2} aria-hidden="true" />
      <span className="hidden sm:inline text-sm font-semibold">Chat with an engineer</span>
    </a>
  );
}
