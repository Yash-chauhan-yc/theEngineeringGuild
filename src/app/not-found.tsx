import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center px-6 blueprint-grid">
      <div className="text-center">
        <p className="font-mono text-xs tracking-[0.28em] uppercase text-blue-600">Error 404 — Part not found</p>
        <h1 className="mt-4 font-display font-bold text-4xl sm:text-5xl tracking-tight">This page isn&apos;t on the drawing.</h1>
        <Link href="/" className="mt-8 inline-flex bg-slate-900 text-white font-semibold rounded-full px-6 py-3 hover:bg-blue-600 transition-colors">Back to the Guild</Link>
      </div>
    </main>
  );
}
