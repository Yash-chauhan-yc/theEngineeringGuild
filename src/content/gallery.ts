/**
 * Retrofit gallery — before / after showcase.
 *
 * ⚠️ REPLACE THESE PLACEHOLDERS WITH YOUR OWN PROJECT PHOTOS before going live.
 * The SVG artwork below is a stand-in so the layout works out of the box;
 * buyers trust real before/after shots of your own jobs.
 *
 * To use your own photos: drop them in /public/gallery/ and set
 *   before: "/gallery/press-01-before.jpg", after: "/gallery/press-01-after.jpg"
 */
export type GalleryCategory = "Press Retrofit" | "Drive Upgrade" | "Roller Restoration" | "Control Panel";

export type GalleryItem = {
  id: string;
  title: string;
  machine: string;
  category: GalleryCategory;
  location: string;
  duration: string;
  summary: string;
  outcomes: string[];
  before: string;
  after: string;
};

// Placeholder artwork shipped in /public/gallery — swap for real .jpg/.webp photos.
const ph = (id: string, state: "before" | "after") => `/gallery/${id}-${state}.svg`;

export const GALLERY: GalleryItem[] = [
  {
    id: "web-offset-drive",
    title: "Web-offset press drive migration",
    machine: "4-colour web-offset press",
    category: "Press Retrofit",
    location: "Placeholder — your client city",
    duration: "9 days on site",
    summary: "Obsolete DC drives and relay logic replaced with a synchronised servo line shaft and a modern PLC/HMI.",
    outcomes: ["Line shaft replaced by 3-axis electronic sync", "Registration drift eliminated", "Full parameter backup handed over"],
    before: ph("web-offset-drive", "before"),
    after: ph("web-offset-drive", "after"),
  },
  {
    id: "rewinder-servo",
    title: "Slitter-rewinder servo upgrade",
    machine: "Slitter-rewinder, 1300 mm",
    category: "Drive Upgrade",
    location: "Placeholder — your client city",
    duration: "5 days on site",
    summary: "Unwind and rewind drives upgraded with closed-loop tension control and a new operator panel.",
    outcomes: ["Taper tension control added", "Faster changeovers", "Spare drive kept in stock for the client"],
    before: ph("rewinder-servo", "before"),
    after: ph("rewinder-servo", "after"),
  },
  {
    id: "roller-recompound",
    title: "Impression roller re-compounding",
    machine: "Rotogravure impression rollers",
    category: "Roller Restoration",
    location: "Placeholder — your client city",
    duration: "Workshop turnaround",
    summary: "Worn, cracked rubber stripped, cores re-tubed and balanced, then re-compounded and ground to spec.",
    outcomes: ["Shore hardness to specification", "Dynamically balanced cores", "Run-out within tolerance"],
    before: ph("roller-recompound", "before"),
    after: ph("roller-recompound", "after"),
  },
  {
    id: "panel-rebuild",
    title: "Control panel rebuild",
    machine: "Laminator main control panel",
    category: "Control Panel",
    location: "Placeholder — your client city",
    duration: "Panel built in our lab",
    summary: "Cluttered, undocumented panel rebuilt to a clean, labelled layout with new PLC, drives and wiring diagrams.",
    outcomes: ["Fully documented wiring", "Ferruled & labelled terminals", "Faster fault finding for maintenance"],
    before: ph("panel-rebuild", "before"),
    after: ph("panel-rebuild", "after"),
  },
];
