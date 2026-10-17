"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowUpRight, CheckCircle2, Loader2, Mail, MapPin, MessageCircle, Phone, Zap } from "lucide-react";
import Reveal from "./Reveal";
import { SERVICE_OPTIONS, type ServiceId } from "@/content/site-content";
import { site } from "@/config/site";
import { PREFILL_EVENT } from "./Catalogue";

const inputCls =
  "w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-[border-color,box-shadow] duration-300 aria-[invalid=true]:border-red-500";

type Form = { name: string; company: string; email: string; phone: string; machine: string; message: string; figure: string; website: string };
const EMPTY: Form = { name: "", company: "", email: "", phone: "", machine: "", message: "", figure: "", website: "" };

const URGENCY = [
  { id: "standard", title: "Standard", sub: `Reply ${site.responseTime}` },
  { id: "emergency", title: "Emergency breakdown", sub: "Line down — alert 24/7 team" },
] as const;

export default function Contact() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [service, setService] = useState<ServiceId>("retrofit");
  const [urgency, setUrgency] = useState<"standard" | "emergency">("standard");
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const msgRef = useRef<HTMLTextAreaElement>(null);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors(({ [k]: _, ...rest }) => rest);
  };

  // Prefill from "Enquire about FIG.xx" buttons in the catalogue
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const d = (e as CustomEvent<{ figure: string; service: ServiceId; message: string }>).detail;
      setTicket(null);
      setService(d.service);
      setForm((f) => ({ ...f, figure: d.figure, message: f.message || d.message }));
      setTimeout(() => msgRef.current?.focus({ preventScroll: true }), 700);
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, service, urgency }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        throw new Error(data.detail || "Please check the fields and try again.");
      }
      setTicket(data.ticket);
      toast.success(`Enquiry ${data.ticket} received`, {
        description: data.email_sent
          ? urgency === "emergency"
            ? "The 24/7 automation line has been alerted. Expect a call shortly."
            : `Our engineers have been notified. Expect a response ${site.responseTime}.`
          : "Your enquiry is logged. For urgent help, call or WhatsApp us directly.",
      });
      setForm(EMPTY);
      setService("retrofit");
      setUrgency("standard");
    } catch (err) {
      toast.error("Could not submit enquiry", { description: err instanceof Error ? err.message : "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const waText = encodeURIComponent(`Hello ${site.name}, I have an enquiry about my machine.`);
  const tel = site.phone.replace(/[^\d+]/g, "");

  const field = (k: keyof Form) => ({ value: form[k], onChange: set(k), "aria-invalid": Boolean(errors[k]), "aria-describedby": errors[k] ? `${k}-err` : undefined });
  const Err = ({ k }: { k: string }) => (errors[k] ? <p id={`${k}-err`} className="mt-1.5 text-xs text-red-600">{errors[k]}</p> : null);

  return (
    <section id="contact" data-testid="contact-section" className="py-24 lg:py-32 bg-slate-50/70 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-14 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase text-slate-500">Engineering Enquiry &amp; Quick RFQ</p>
              <h2 className="mt-4 font-display font-bold tracking-tight text-slate-900 text-3xl sm:text-4xl lg:text-5xl leading-[1.05]">Tell us what the line needs.</h2>
              <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-md">
                Share the machine, the fault or the drawing. Every enquiry is ticketed and routed straight to an engineer — not a sales queue.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 space-y-5">
                {[
                  { icon: Mail, k: "Email", v: site.email, href: `mailto:${site.email}`, id: "contact-email-value" },
                  { icon: Phone, k: "Plant Hotline", v: site.phone, href: `tel:${tel}`, id: "contact-phone-value" },
                  { icon: MessageCircle, k: "WhatsApp", v: "Chat with an engineer", href: `https://wa.me/${site.whatsapp}?text=${waText}`, id: "contact-whatsapp-value" },
                  { icon: MapPin, k: "Works", v: site.address, id: "contact-address-value" },
                ].map((c) => (
                  <div key={c.k} className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                      <c.icon size={16} className="text-slate-900" />
                    </span>
                    <div>
                      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-500">{c.k}</p>
                      {c.href ? (
                        <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="text-sm font-medium text-slate-900 hover:text-blue-600" data-testid={c.id}>
                          {c.v}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-slate-900" data-testid={c.id}>{c.v}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 inline-flex items-center gap-3 bg-slate-900 text-white rounded-2xl px-5 py-4">
                <Zap size={16} className="text-amber-400 shrink-0" />
                <p className="text-[13px] leading-snug">Emergency breakdown? Flag it in the form — the 24/7 automation line is alerted instantly on WhatsApp.</p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="lg:col-span-7 min-w-0">
            {ticket ? (
              <div data-testid="enquiry-success" className="bg-white border border-slate-200 rounded-[28px] p-8 sm:p-12 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.18)] text-center">
                <CheckCircle2 size={44} className="mx-auto text-emerald-600" />
                <p className="mt-6 font-mono text-[11px] tracking-[0.24em] uppercase text-slate-500">Ticket number</p>
                <p className="mt-2 font-mono text-2xl sm:text-3xl font-bold text-slate-900" data-testid="enquiry-ticket">{ticket}</p>
                <p className="mt-5 text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your enquiry has been routed to an engineer. A confirmation with this ticket number has been emailed to you — reply to it to add photos, drawings or fault codes.
                </p>
                <button type="button" onClick={() => setTicket(null)} className="mt-8 inline-flex items-center gap-2 bg-slate-900 text-white font-semibold rounded-full px-6 py-3 hover:bg-blue-600 transition-colors">
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form data-testid="contact-form" onSubmit={submit} noValidate className="bg-white border border-slate-200 rounded-[28px] p-7 sm:p-10 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.18)]">
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-slate-500" id="svc-label">01 — Service required</p>
                <div className="mt-3 flex flex-wrap gap-2" data-testid="service-selector" role="radiogroup" aria-labelledby="svc-label">
                  {SERVICE_OPTIONS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      role="radio"
                      aria-checked={service === s.id}
                      data-testid={`service-chip-${s.id}`}
                      onClick={() => setService(s.id)}
                      className={`text-[13px] font-medium px-4 py-2 rounded-full border transition-colors duration-300 ${
                        service === s.id ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-300 text-slate-600 hover:border-slate-900"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <p className="mt-8 font-mono text-[10px] tracking-[0.22em] uppercase text-slate-500" id="urg-label">02 — Urgency</p>
                <div className="mt-3 grid grid-cols-2 gap-2" data-testid="urgency-selector" role="radiogroup" aria-labelledby="urg-label">
                  {URGENCY.map((u) => {
                    const on = urgency === u.id;
                    const em = u.id === "emergency";
                    return (
                      <button
                        key={u.id}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        data-testid={`urgency-${u.id}`}
                        onClick={() => setUrgency(u.id)}
                        className={`text-left rounded-2xl border px-4 py-3.5 transition-colors duration-300 ${
                          on ? (em ? "bg-red-600 border-red-600 text-white" : "bg-slate-900 border-slate-900 text-white") : "bg-white border-slate-300 text-slate-900 hover:border-slate-900"
                        }`}
                      >
                        <span className="flex items-center gap-1.5 text-sm font-semibold">{em && <Zap size={14} className={on ? "text-amber-300" : "text-amber-500"} />}{u.title}</span>
                        <span className={`block mt-0.5 text-[12px] ${on ? "text-white/75" : "text-slate-500"}`}>{u.sub}</span>
                      </button>
                    );
                  })}
                </div>

                <p className="mt-8 font-mono text-[10px] tracking-[0.22em] uppercase text-slate-500">03 — Your details</p>
                <div className="mt-3 grid sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="f-name" className="sr-only">Full name</label>
                    <input id="f-name" required autoComplete="name" placeholder="Full name *" className={inputCls} data-testid="input-name" {...field("name")} />
                    <Err k="name" />
                  </div>
                  <div>
                    <label htmlFor="f-company" className="sr-only">Company</label>
                    <input id="f-company" autoComplete="organization" placeholder="Company / plant" className={inputCls} data-testid="input-company" {...field("company")} />
                  </div>
                  <div>
                    <label htmlFor="f-email" className="sr-only">Email</label>
                    <input id="f-email" type="email" required autoComplete="email" placeholder="Work email *" className={inputCls} data-testid="input-email" {...field("email")} />
                    <Err k="email" />
                  </div>
                  <div>
                    <label htmlFor="f-phone" className="sr-only">Phone</label>
                    <input id="f-phone" type="tel" autoComplete="tel" placeholder={urgency === "emergency" ? "Phone * (we'll call you back)" : "Phone"} className={inputCls} data-testid="input-phone" {...field("phone")} />
                    <Err k="phone" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="f-machine" className="sr-only">Machine make and model</label>
                    <input id="f-machine" placeholder="Machine make / model (e.g. Bobst, Windmöller & Hölscher, Rotomec…)" className={inputCls} data-testid="input-machine" {...field("machine")} />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="f-message" className="sr-only">Message</label>
                    <textarea
                      id="f-message"
                      ref={msgRef}
                      required
                      rows={5}
                      placeholder="Describe the fault, part or upgrade — include drive/PLC model and fault codes if you have them *"
                      className={`${inputCls} resize-y min-h-[130px]`}
                      data-testid="input-message"
                      {...field("message")}
                    />
                    <Err k="message" />
                  </div>
                  {form.figure && (
                    <p className="sm:col-span-2 text-xs text-slate-500">
                      Catalogue reference: <span className="font-mono text-blue-600">{form.figure}</span>{" "}
                      <button type="button" className="underline hover:text-slate-900" onClick={() => setForm((f) => ({ ...f, figure: "" }))}>remove</button>
                    </p>
                  )}
                  {/* Honeypot */}
                  <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
                    <label htmlFor="f-website">Website</label>
                    <input id="f-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} />
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-xs text-slate-500 max-w-xs">We use your details only to respond to this enquiry.</p>
                  <button
                    type="submit"
                    disabled={loading}
                    data-testid="submit-enquiry"
                    className={`inline-flex items-center gap-2 font-semibold rounded-full pl-6 pr-5 py-3.5 text-white transition-colors disabled:opacity-60 ${
                      urgency === "emergency" ? "bg-red-600 hover:bg-red-700" : "bg-slate-900 hover:bg-blue-600"
                    }`}
                  >
                    {loading ? <Loader2 size={17} className="animate-spin" /> : null}
                    {loading ? "Sending…" : urgency === "emergency" ? "Send emergency alert" : "Submit enquiry"}
                    {!loading && <ArrowUpRight size={17} />}
                  </button>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
