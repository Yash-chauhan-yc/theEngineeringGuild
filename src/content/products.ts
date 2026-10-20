/**
 * Products section. Images live in /public/products/.
 * To add a photo: drop the file in /public/products/ and add its path to `images`.
 */
export type Product = {
  id: string;
  title: string;
  lead: string;
  types: string[];
  images: { src: string; alt: string }[];
};

export const PRODUCTS: Product[] = [
  {
    id: "solenoid-valves",
    title: "Solenoid Valves",
    lead: "Single valves and complete manifold assemblies for press and converting-line pneumatics, supplied to match your existing ports and coil voltage.",
    types: ["3/2 & 5/2 way valves", "Valve manifolds & islands", "24 V DC / 230 V AC coils", "Push-in fittings & silencers"],
    images: [{ src: "/products/solenoid-valve-manifold.webp", alt: "Pneumatic solenoid valve manifold with push-in fittings" }],
  },
  {
    id: "blades",
    title: "Slitting & Razor Blades",
    lead: "Circular slitting knives and razor blades for clean, burr-free edges on film, foil, paper and laminates — ground to size for your slitter.",
    types: ["Circular top & bottom knives", "3-hole razor blades", "Carbide & tool-steel grades", "Custom bore & bevel to drawing"],
    images: [
      { src: "/products/slitting-circular-blades.webp", alt: "Assorted circular slitting knives" },
      { src: "/products/razor-blades.webp", alt: "Three-hole industrial razor blades" },
    ],
  },
  {
    id: "mandrels",
    title: "Mandrels & Sleeves",
    lead: "Air shafts, mandrels and sleeves for unwind and rewind stations — new supply, repair and re-tubing to keep cores gripping true.",
    types: ["Lug & strip-type air shafts", "Slotted mandrels", "Core sleeves & adaptors", "Bladder repair & balancing"],
    images: [
      { src: "/products/air-shafts.webp", alt: "Pair of strip-type air shafts" },
      { src: "/products/lug-air-shaft.webp", alt: "Lug-type air shaft close-up" },
      { src: "/products/slotted-mandrel.webp", alt: "Slotted steel mandrel" },
    ],
  },
];