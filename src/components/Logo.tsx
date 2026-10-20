import Image from "next/image";

/**
 * Brand logo. Files live in /public/brand/:
 *   logo-mark.png  — square shield emblem (navbar, icons)
 *   logo-full.png  — full logo with name and tagline (footer)
 */
export function LogoMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/brand/logo-mark.png"
      alt=""
      width={size}
      height={size}
      priority
      className={`rounded-[10px] shrink-0 ${className}`}
    />
  );
}

/** Same emblem; kept as a separate export so existing imports keep working on dark sections. */
export const LogoMarkLight = LogoMark;

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark size={38} />
      <span className="leading-none">
        <span className={`block font-mono text-[9px] tracking-[0.3em] uppercase ${light ? "text-slate-400" : "text-slate-500"}`}>The</span>
        <span className={`block font-display font-bold tracking-tight text-[17px] ${light ? "text-white" : "text-slate-900"}`}>Engineering Guild</span>
      </span>
    </span>
  );
}

export function LogoFull({ width = 220 }: { width?: number }) {
  return (
    <Image
      src="/brand/logo-full.png"
      alt="The Engineering Guild — Expertise · Innovation · Legacy"
      width={width}
      height={Math.round((width * 279) / 392)}
      className="rounded-2xl"
    />
  );
}