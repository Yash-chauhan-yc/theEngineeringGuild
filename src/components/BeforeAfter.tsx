"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { ChevronsLeftRight } from "lucide-react";

/** Draggable before/after comparison. Mouse, touch and keyboard accessible. */
export default function BeforeAfter({ before, after, alt }: { before: string; after: string; alt: string }) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromX = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const unopt = (src: string) => src.endsWith(".svg");

  return (
    <div
      ref={box}
      className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-slate-900 select-none touch-pan-y cursor-ew-resize"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        setFromX(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && setFromX(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <Image src={after} alt={`${alt} — after`} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" unoptimized={unopt(after)} draggable={false} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before} alt={`${alt} — before`} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" unoptimized={unopt(before)} draggable={false} />
      </div>

      <span className="pointer-events-none absolute top-4 left-4 font-mono text-[10px] tracking-[0.24em] uppercase bg-black/60 text-white rounded-full px-3 py-1.5 backdrop-blur" style={{ opacity: pos > 12 ? 1 : 0 }}>
        Before
      </span>
      <span className="pointer-events-none absolute top-4 right-4 font-mono text-[10px] tracking-[0.24em] uppercase bg-blue-600 text-white rounded-full px-3 py-1.5" style={{ opacity: pos < 88 ? 1 : 0 }}>
        After
      </span>

      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.2)]" style={{ left: `${pos}%` }} />
      <div
        role="slider"
        tabIndex={0}
        aria-label="Drag to compare before and after"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% before`}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
          if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
          if (e.key === "Home") setPos(0);
          if (e.key === "End") setPos(100);
        }}
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-slate-900 grid place-items-center shadow-lg"
        style={{ left: `${pos}%` }}
      >
        <ChevronsLeftRight size={18} />
      </div>
    </div>
  );
}
