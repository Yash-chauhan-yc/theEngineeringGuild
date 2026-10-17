import type { Prim, Tone } from "@/content/catalogue";

const COLOR: Record<Tone, string> = { ink: "#0F172A", blue: "#2563EB", mut: "#94A3B8", white: "#FFFFFF" };

export default function FigureSvg({ prims, label, id }: { prims: Prim[]; label: string; id: string }) {
  const marker = `arrow-${id}`;
  return (
    <svg viewBox="0 0 400 300" className="w-full h-auto" role="img" aria-label={label}>
      <defs>
        <marker id={marker} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="none" stroke={COLOR.ink} strokeWidth="1.2" />
        </marker>
      </defs>
      {prims.map((p, i) => {
        switch (p.t) {
          case "line":
            return <line key={i} x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke={COLOR[p.stroke]} strokeWidth={p.w} strokeDasharray={p.dash?.join(" ")} strokeLinecap="round" />;
          case "rect":
            return <rect key={i} x={p.x} y={p.y} width={p.width} height={p.height} rx={p.rx} fill={p.fill ? COLOR[p.fill] : "none"} stroke={p.stroke ? COLOR[p.stroke] : undefined} strokeWidth={p.w} />;
          case "circle":
            return <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={p.fill ? COLOR[p.fill] : "none"} stroke={p.stroke ? COLOR[p.stroke] : undefined} strokeWidth={p.w} strokeDasharray={p.dash?.join(" ")} />;
          case "path":
            return <path key={i} d={p.d} fill="none" stroke={COLOR[p.stroke]} strokeWidth={p.w} strokeDasharray={p.dash?.join(" ")} markerEnd={p.arrow ? `url(#${marker})` : undefined} />;
          case "text":
            return (
              <text key={i} x={p.x} y={p.y} textAnchor={p.anchor ?? "start"} dominantBaseline="middle" fontFamily="JetBrains Mono Variable, ui-monospace, monospace" fontSize={p.size} fill={COLOR[p.fill]} letterSpacing={p.spacing}>
                {p.text}
              </text>
            );
        }
      })}
    </svg>
  );
}
