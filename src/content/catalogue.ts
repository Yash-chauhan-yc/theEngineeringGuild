/**
 * Catalogue figures are described as simple drawing primitives so the exact
 * same blueprint renders on the website (SVG) and inside the downloadable
 * PDF spec sheet (pdf-lib). Coordinates use a 400 × 300 canvas.
 */

export type Tone = "ink" | "blue" | "mut" | "white";

export type Prim =
  | { t: "line"; x1: number; y1: number; x2: number; y2: number; stroke: Tone; w: number; dash?: [number, number] }
  | { t: "rect"; x: number; y: number; width: number; height: number; rx?: number; fill?: Tone; stroke?: Tone; w?: number }
  | { t: "circle"; cx: number; cy: number; r: number; fill?: Tone; stroke?: Tone; w?: number; dash?: [number, number] }
  | { t: "path"; d: string; stroke: Tone; w: number; dash?: [number, number]; arrow?: boolean }
  | { t: "text"; x: number; y: number; text: string; size: number; fill: Tone; anchor?: "start" | "middle"; spacing?: number };

export type Figure = {
  id: string;
  num: string;
  title: string;
  type: string;
  description: string;
  specs: string[];
  /** Longer technical notes, printed on the PDF spec sheet */
  details: { label: string; value: string }[];
  applications: string[];
  prims: Prim[];
};

const label = (x: number, y: number, text: string, fill: Tone = "mut", anchor: "start" | "middle" = "middle", spacing = 2, size = 9): Prim => ({
  t: "text", x, y, text, size, fill, anchor, spacing,
});

/* ── FIG.01 PLC ───────────────────────────────────────────── */
const plc: Prim[] = [
  { t: "line", x1: 40, y1: 72, x2: 360, y2: 72, stroke: "ink", w: 2 },
  label(200, 61, "PROFINET IRT BACKBONE"),
  { t: "rect", x: 155, y: 10, width: 90, height: 36, rx: 6, fill: "ink" },
  { t: "text", x: 200, y: 32, text: "CPU S7-1500", size: 10, fill: "white", anchor: "middle", spacing: 1.5 },
  { t: "line", x1: 200, y1: 46, x2: 200, y2: 72, stroke: "ink", w: 2 },
  ...[70, 200, 330].flatMap((x, i): Prim[] => [
    { t: "line", x1: x, y1: 72, x2: x, y2: 180, stroke: "ink", w: 1.5 },
    { t: "rect", x: x - 52, y: 180, width: 104, height: 52, rx: 8, fill: "white", stroke: "ink", w: 1.8 },
    { t: "text", x, y: 202, text: "INDRADRIVE", size: 9, fill: "ink", anchor: "middle" },
    { t: "text", x, y: 217, text: `AXIS 0${i + 1}`, size: 9, fill: "blue", anchor: "middle" },
    { t: "path", d: `M ${x + 52} 232 C ${x + 90} 260, ${x + 90} 120, ${x + 30} 96`, stroke: "blue", w: 1.2, dash: [4, 4] },
    { t: "circle", cx: x, cy: 72, r: 4, fill: "blue" },
  ]),
  label(200, 280, "ENCODER FEEDBACK LOOP — DASHED"),
];

/* ── FIG.02 Gear ──────────────────────────────────────────── */
const gearTeeth: Prim[] = Array.from({ length: 18 }, (_, i) => {
  const a = ((i * 20 - 90) * Math.PI) / 180;
  const r1 = 86, r2 = 100, half = 0.11;
  const p = (r: number, ang: number) => `${(200 + r * Math.cos(ang)).toFixed(2)} ${(150 + r * Math.sin(ang)).toFixed(2)}`;
  return {
    t: "path" as const,
    d: `M ${p(r1, a - half * 1.25)} L ${p(r2, a - half * 0.7)} L ${p(r2, a + half * 0.7)} L ${p(r1, a + half * 1.25)}`,
    stroke: "ink" as const,
    w: 1.8,
  };
});
const gear: Prim[] = [
  ...gearTeeth,
  { t: "circle", cx: 200, cy: 150, r: 86, stroke: "ink", w: 2 },
  { t: "circle", cx: 200, cy: 150, r: 72, stroke: "blue", w: 1.2, dash: [5, 5] },
  { t: "circle", cx: 200, cy: 150, r: 26, stroke: "ink", w: 2 },
  { t: "rect", x: 194, y: 120, width: 12, height: 10, stroke: "ink", w: 1.6 },
  { t: "line", x1: 200, y1: 150, x2: 272, y2: 150, stroke: "blue", w: 1.2 },
  label(232, 144, "PITCH Ø", "blue", "start", 0),
  { t: "line", x1: 200, y1: 150, x2: 200, y2: 64, stroke: "mut", w: 0.8, dash: [3, 4] },
  label(206, 100, "MODULE 4.0", "mut", "start", 0),
  label(200, 292, "PRESSURE ANGLE 20° · Z = 18 · BACKLASH 0.04 MM"),
];

/* ── FIG.03 Pulley ────────────────────────────────────────── */
const pulley: Prim[] = [
  { t: "circle", cx: 120, cy: 150, r: 62, stroke: "ink", w: 2 },
  { t: "circle", cx: 120, cy: 150, r: 50, stroke: "mut", w: 1, dash: [4, 4] },
  { t: "circle", cx: 300, cy: 150, r: 38, stroke: "ink", w: 2 },
  { t: "circle", cx: 300, cy: 150, r: 28, stroke: "mut", w: 1, dash: [4, 4] },
  { t: "line", x1: 120, y1: 88, x2: 300, y2: 112, stroke: "blue", w: 3 },
  { t: "line", x1: 120, y1: 212, x2: 300, y2: 188, stroke: "blue", w: 3 },
  { t: "path", d: "M 152 108 A 62 62 0 0 1 176 132", stroke: "ink", w: 1.4, arrow: true },
  { t: "path", d: "M 276 172 A 38 38 0 0 0 258 148", stroke: "ink", w: 1.4, arrow: true },
  { t: "line", x1: 60, y1: 150, x2: 180, y2: 150, stroke: "mut", w: 0.8, dash: [3, 4] },
  { t: "line", x1: 250, y1: 150, x2: 350, y2: 150, stroke: "mut", w: 0.8, dash: [3, 4] },
  { t: "circle", cx: 120, cy: 150, r: 4, fill: "ink" },
  { t: "circle", cx: 300, cy: 150, r: 4, fill: "ink" },
  label(120, 248, "DRIVE PULLEY", "mut", "middle", 0),
  label(300, 248, "DRIVEN PULLEY", "mut", "middle", 0),
  label(200, 40, "LASER ALIGNMENT ≤ 0.05 MM/M", "blue"),
  label(200, 290, "HTD 8M TIMING BELT · MULTI-GROOVE V-PROFILE"),
];

/* ── FIG.04 Bearing ───────────────────────────────────────── */
const bearing: Prim[] = [
  { t: "circle", cx: 200, cy: 150, r: 92, stroke: "ink", w: 2.4 },
  { t: "circle", cx: 200, cy: 150, r: 80, stroke: "ink", w: 1.4 },
  { t: "circle", cx: 200, cy: 150, r: 46, stroke: "ink", w: 1.4 },
  { t: "circle", cx: 200, cy: 150, r: 34, stroke: "ink", w: 2.4 },
  ...Array.from({ length: 10 }, (_, i): Prim => {
    const a = (i * 36 * Math.PI) / 180;
    return { t: "circle", cx: +(200 + 63 * Math.cos(a)).toFixed(2), cy: +(150 + 63 * Math.sin(a)).toFixed(2), r: 10, fill: "white", stroke: "blue", w: 1.8 };
  }),
  { t: "line", x1: 200, y1: 150, x2: 290, y2: 92, stroke: "mut", w: 0.8, dash: [3, 4] },
  label(296, 90, "OUTER RACE", "mut", "start", 0),
  { t: "line", x1: 200, y1: 150, x2: 262, y2: 212, stroke: "mut", w: 0.8, dash: [3, 4] },
  label(266, 226, "INNER RACE", "mut", "start", 0),
  label(200, 146, "BORE Ø", "ink", "middle", 0),
  { t: "text", x: 200, y: 160, text: "H7 FIT", size: 10, fill: "blue", anchor: "middle" },
  label(200, 290, "ANTI-FRICTION · HIGH-RPM PRINTING CYLINDER DUTY"),
];

export const FIGURES: Figure[] = [
  {
    id: "plc",
    num: "FIG.01",
    title: "PLC Control & Automation Architecture",
    type: "Vector Blueprint — Master / Slave Topology",
    description:
      "Multi-axis synchronized drive layout showing master/slave PLC topology, Profinet IRT feedback loop, and Rexroth IndraDrive units. Component repair and programming parameters configured for Rexroth, Siemens and Mitsubishi controls.",
    specs: ["S7-1500 CPU", "PROFINET IRT", "≤ 1 MS CYCLE", "3-AXIS SYNC"],
    details: [
      { label: "Controller", value: "Siemens S7-1500 / SIMOTION, Rexroth IndraMotion, Mitsubishi iQ-R" },
      { label: "Fieldbus", value: "PROFINET IRT, EtherCAT, SERCOS III" },
      { label: "Cycle time", value: "≤ 1 ms isochronous" },
      { label: "Axes", value: "3-axis electronic line shaft, expandable" },
      { label: "Feedback", value: "EnDat 2.2 / Hiperface / resolver encoder loop" },
      { label: "Services", value: "Retrofit, PCB repair, parameter backup & re-commissioning" },
    ],
    applications: ["Web-offset & flexo presses", "Rotogravure lines", "Slitter-rewinders", "Pouch & bag making"],
    prims: plc,
  },
  {
    id: "gear",
    num: "FIG.02",
    title: "Spur & Helical Precision Gear Profile",
    type: "Tooth Geometry Inspector — Involute Form",
    description:
      "High-precision gear mesh analysis with module, 20° pressure angle, pitch diameter and backlash tolerance metrics. Bespoke manufacturing of high-load drive-train transmission gears in nylon and high-tensile steel.",
    specs: ["MODULE 4.0", "Z = 18 TEETH", "20° PRESSURE", "±0.005 MM"],
    details: [
      { label: "Module", value: "0.5 – 8.0 (shown: 4.0)" },
      { label: "Teeth", value: "Z = 18 (to drawing)" },
      { label: "Pressure angle", value: "20° standard involute" },
      { label: "Tolerance", value: "±0.005 mm on critical diameters" },
      { label: "Backlash", value: "0.04 mm nominal" },
      { label: "Materials", value: "EN19 / EN24 / EN36 steel, case-hardened; cast nylon" },
    ],
    applications: ["Printing cylinder drive trains", "Gearbox rebuilds", "Feeder & delivery units", "Reverse-engineered obsolete spares"],
    prims: gear,
  },
  {
    id: "pulley",
    num: "FIG.03",
    title: "V-Belt & Timing Pulley Drive Alignment",
    type: "Alignment Gauge — Laser Guided",
    description:
      "Laser-guided angular and parallel misalignment tolerance specification for high-speed printing press feed rollers. Multi-groove pulleys, synchronized timing belts and performance tie belts supplied to match.",
    specs: ["≤ 0.05 MM/M", "HTD 8M BELT", "MULTI-GROOVE", "DYNAMIC BALANCE"],
    details: [
      { label: "Alignment", value: "≤ 0.05 mm/m angular & parallel (laser)" },
      { label: "Belt profiles", value: "HTD 3M/5M/8M/14M, T5/T10, AT, SPZ/SPA/SPB" },
      { label: "Pulleys", value: "Multi-groove, taper-lock, to drawing" },
      { label: "Balancing", value: "Dynamic balance to G6.3 / G2.5" },
      { label: "Services", value: "Alignment survey, belt tensioning, supply" },
    ],
    applications: ["Press feed rollers", "Unwind / rewind drives", "Conveyors", "Lamination lines"],
    prims: pulley,
  },
  {
    id: "bearing",
    num: "FIG.04",
    title: "Ball Bearing Radial Cross-Section",
    type: "Cutaway Diagram — Load Distribution",
    description:
      "Radial and axial load distribution analysis for heavy converting machine impression cylinders. High-grade industrial anti-friction bearings stocked for high-RPM printing cylinder duty.",
    specs: ["H7 BORE FIT", "10-BALL CAGE", "HIGH RPM", "C3 CLEARANCE"],
    details: [
      { label: "Bore fit", value: "H7 housing / k6 shaft" },
      { label: "Internal clearance", value: "C3 for thermal growth" },
      { label: "Cage", value: "10-ball, pressed steel / polyamide" },
      { label: "Duty", value: "High-RPM impression & plate cylinders" },
      { label: "Supply", value: "Deep groove, angular contact, spherical roller" },
    ],
    applications: ["Impression cylinders", "Anilox & idler rollers", "Slitter shafts", "Motor rebuilds"],
    prims: bearing,
  },
];

export const getFigure = (id: string) => FIGURES.find((f) => f.id === id);
