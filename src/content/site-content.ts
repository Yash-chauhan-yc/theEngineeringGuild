import type { LucideIcon } from "lucide-react";
import { Cpu, Wrench, Cog, Package } from "lucide-react";

export type ServiceId = "retrofit" | "repair" | "manufacturing" | "spares" | "other";

export const SERVICE_OPTIONS: { id: ServiceId; label: string }[] = [
  { id: "retrofit", label: "Retrofit & Upgrades" },
  { id: "repair", label: "Lab Repair" },
  { id: "manufacturing", label: "Manufacturing" },
  { id: "spares", label: "Spares & Supplies" },
  { id: "other", label: "Other" },
];

export const SERVICES: {
  id: Exclude<ServiceId, "other">;
  num: string;
  title: string;
  lead: string;
  points: string[];
  icon: LucideIcon;
}[] = [
  {
    id: "retrofit",
    num: "01",
    title: "Machinery Retrofits & Upgrades",
    lead: "Give proven press frames a modern brain — new drives, PLCs and HMIs without replacing the machine.",
    points: ["Drive & servo migration", "PLC / HMI modernisation", "Registration & web-tension control", "Safety upgrades to current norms"],
    icon: Cpu,
  },
  {
    id: "repair",
    num: "02",
    title: "Automation Lab Repairs",
    lead: "Component-level diagnostics on boards most people only swap. Tested on our bench before it ships back.",
    points: ["PLC, HMI & communication PCBs", "AC/DC drives & power supplies", "Servo motors & resolver recalibration", "Load-tested, documented, warrantied"],
    icon: Wrench,
  },
  {
    id: "manufacturing",
    num: "03",
    title: "Precision Manufacturing",
    lead: "Critical spares machined to drawing — or reverse-engineered when the drawing no longer exists.",
    points: ["Gears, shafts & sleeves", "Rubber roller re-compounding", "Mandrel balancing & re-tubing", "Reverse engineering of obsolete parts"],
    icon: Cog,
  },
  {
    id: "spares",
    num: "04",
    title: "Industrial Spares & Supplies",
    lead: "The everyday wearables that stop a line when they run out — dispatched fast.",
    points: ["Blades, bearings & belts", "Pneumatics & valve manifolds", "Sensors, encoders & cables", "PPE and plant consumables"],
    icon: Package,
  },
];

export const MARQUEE = [
  "Web-Offset Presses",
  "Flexographic Lines",
  "Rotogravure",
  "Slitter-Rewinders",
  "Lamination",
  "Pouch & Bag Making",
  "Corrugation",
  "Label Converting",
  "Die Cutting",
  "Extrusion Coating",
];

export const BRANDS = [
  { id: "rexroth", name: "Bosch Rexroth", category: "Drive Controllers & Servos" },
  { id: "siemens", name: "Siemens", category: "S7-1500 / SIMOTION / SINAMICS" },
  { id: "mitsubishi", name: "Mitsubishi Electric", category: "MELSERVO & PLCs" },
  { id: "smc", name: "SMC Pneumatics", category: "Pneumatic Actuators" },
  { id: "festo", name: "Festo", category: "Valve Manifolds & Motion" },
  { id: "schneider", name: "Schneider Electric", category: "Altivar & PacDrive" },
  { id: "baumuller", name: "Baumüller", category: "Direct Drives & Servos" },
  { id: "lenze", name: "Lenze", category: "Automation Controllers" },
];

export const PILLARS = [
  { k: "RESTORE", v: "Worn mechanical systems returned to factory-spec tolerances — balancing mandrels, re-tubing shafts, re-compounding heavy rubber rollers." },
  { k: "REPAIR", v: "Component-level diagnostics on PLCs, HMI panels, communication PCBs, AC/DC drives and servo motors with optical resolver recalibration." },
  { k: "MANUFACTURE", v: "Bespoke critical spares — gears, shafts, sleeves and rollers machined to drawing, not approximated." },
  { k: "SUPPLY", v: "Rapid dispatch of everyday plant wearables — blades, bearings, belts, pneumatics and PPE." },
];

export const PROCESS = [
  { step: "01", title: "Ticket & triage", text: "Your enquiry gets a ticket number and lands with an engineer, not a sales queue. Emergencies trigger an instant alert." },
  { step: "02", title: "Site survey or bench test", text: "We inspect the machine on site or diagnose the part on our bench, and document the fault with photos and readings." },
  { step: "03", title: "Fixed-scope quote", text: "A clear scope, parts list and timeline — planned around your production schedule to minimise downtime." },
  { step: "04", title: "Execute & hand over", text: "Repair, retrofit or manufacture, then commissioning, parameter backups and a written handover report." },
];

export const FAQ = [
  {
    q: "Which machines do you work on?",
    a: "Printing, packaging and converting equipment — web-offset, flexo and gravure presses, slitter-rewinders, laminators, pouch and bag makers, corrugators and die-cutters — across European, Japanese and Indian OEMs.",
  },
  {
    q: "Can you repair a board instead of replacing it?",
    a: "Usually, yes. Our automation lab repairs at component level — PLC CPUs, HMI panels, communication PCBs, drives and servo motors — and every unit is load-tested on the bench before it is returned.",
  },
  {
    q: "The OEM no longer supports our machine. Can you still help?",
    a: "That is exactly where retrofits shine. We migrate obsolete drives and controllers to current platforms while keeping the mechanical frame, and we can reverse-engineer spares that are no longer available.",
  },
  {
    q: "How fast do you respond to a breakdown?",
    a: "Mark the enquiry as an Emergency breakdown in the form. It is flagged to the 24/7 automation line instantly and an engineer calls you back. Standard enquiries are answered within one working day.",
  },
  {
    q: "Do you manufacture from samples, without drawings?",
    a: "Yes. Send the worn part and we measure, model and manufacture it — gears, shafts, sleeves, rollers and more — and keep the drawing on file for repeat orders.",
  },
  {
    q: "Where can I get technical specs before I enquire?",
    a: "Every figure in the Technical Product Catalogue has a printable PDF spec sheet. Use the Download spec sheet button under the blueprint.",
  },
];
