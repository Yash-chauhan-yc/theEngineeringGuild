/** Geometric gear-in-square mark. Swap for your own logo SVG if you have one. */
function Mark({ size = 28, fg, bg, accent }: { size?: number; fg: string; bg: string; accent: string }) {
  const teeth = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill={bg} />
      <g transform="translate(16 16)">
        {teeth.map((a) => (
          <rect key={a} x="-1.6" y="-10.5" width="3.2" height="4" rx="0.8" fill={fg} transform={`rotate(${a})`} />
        ))}
        <circle r="7" fill="none" stroke={fg} strokeWidth="2.4" />
        <circle r="2.4" fill={accent} />
      </g>
    </svg>
  );
}

export const LogoMark = (p: { size?: number }) => <Mark {...p} bg="#0F172A" fg="#FFFFFF" accent="#3B82F6" />;
export const LogoMarkLight = (p: { size?: number }) => <Mark {...p} bg="#FFFFFF" fg="#0F172A" accent="#2563EB" />;

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      {light ? <LogoMarkLight size={30} /> : <LogoMark size={30} />}
      <span className="leading-none">
        <span className={`block font-mono text-[9px] tracking-[0.3em] uppercase ${light ? "text-slate-400" : "text-slate-500"}`}>The</span>
        <span className={`block font-display font-bold tracking-tight text-[17px] ${light ? "text-white" : "text-slate-900"}`}>Engineering Guild</span>
      </span>
    </span>
  );
}
