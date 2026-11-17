/* The three live CareStay suites used on the avatar landing pages.
   Amenities come from Hostaway (Nov 2026). Photos are optimized copies in /public/suites.
   Street numbers stay off public pages (see app/lib/public-location.ts). */

export type Suite = {
  id: number; // Hostaway listing id → /listings/{id}
  name: string;
  area: string;
  sleeps: number;
  photos: { src: string; alt: string }[];
  business: string[];
  couples: string[];
  couplesTagline: string;
  businessTagline: string;
};

export const SUITES: Suite[] = [
  {
    id: 496695,
    name: "The Earl",
    area: "Downtown · Wellesley & Sherbourne",
    sleeps: 5,
    photos: [
      { src: "/suites/earl-living-fireplace.webp", alt: "Living room with gas fireplace and bay windows" },
      { src: "/suites/earl-soaking-tub.webp", alt: "Freestanding soaking tub and rain shower" },
      { src: "/suites/earl-patio-evening.webp", alt: "Private garden patio with seating and a bottle of wine" },
      { src: "/suites/earl-kitchen.webp", alt: "Kitchen with gas range and wine fridge" },
      { src: "/suites/earl-desk.webp", alt: "Desk nook by the garden door" },
    ],
    businessTagline: "Chef's kitchen, desk nook, parking included.",
    business: ["Desk nook + fast Wi-Fi", "Gas range, dishwasher, wine fridge", "Washer + dryer in the suite", "Free parking", "Private entrance", "Rain shower"],
    couplesTagline: "Our most romantic suite.",
    couples: ["Freestanding soaking tub", "Gas fireplace", "Private garden patio", "Wine fridge", "Rain shower", "Private entrance"],
  },
  {
    id: 591279,
    name: "Bathurst Suite 2",
    area: "The Annex · Bathurst near Bloor",
    sleeps: 4,
    photos: [
      { src: "/suites/bathurst2-bed.webp", alt: "Bed with a navy tufted headboard and soft pillows" },
      { src: "/suites/bathurst2-kitchen-dining.webp", alt: "Bright kitchen and dining table" },
      { src: "/suites/bathurst2-bedroom-desk.webp", alt: "Bedroom with a desk and lamp" },
      { src: "/suites/bathurst2-coffee.webp", alt: "Coffee maker and air fryer on the counter" },
      { src: "/suites/bathurst2-living.webp", alt: "Living room with smart TV" },
    ],
    businessTagline: "Private entrance, real desk, laundry in the suite.",
    business: ["Laptop-friendly workspace", "Full kitchen + coffee station", "Washer + dryer in the suite", "Private entrance", "Air conditioning", "Smart TV with Netflix"],
    couplesTagline: "Cozy, quiet, all yours.",
    couples: ["Tufted headboard, hotel-style bedding", "Private entrance", "Full kitchen for breakfast in", "Smart TV with Netflix", "Wine glasses ready", "Air conditioning"],
  },
  {
    id: 591280,
    name: "Bathurst Suite 3",
    area: "The Annex · Bathurst near Bloor",
    sleeps: 4,
    photos: [
      { src: "/suites/bathurst3-bed.webp", alt: "Bed with layered pillows and bedside lamps" },
      { src: "/suites/bathurst3-living.webp", alt: "Living room with sofa and work desk" },
      { src: "/suites/bathurst3-kitchen.webp", alt: "White kitchen with stainless appliances" },
      { src: "/suites/bathurst3-desk.webp", alt: "Desk with a brass lamp" },
      { src: "/suites/bathurst3-sconces.webp", alt: "Warm wall sconces over the living room" },
    ],
    businessTagline: "Desk, private bath, everything for the week.",
    business: ["Desk with task lamp", "Full kitchen, real knives + cutlery", "Washer + dryer, supplies stocked", "Private bathroom", "Air conditioning", "Smart TV with Netflix"],
    couplesTagline: "Warm light, soft bed, nobody else.",
    couples: ["Warm sconce lighting", "Hotel-style bedding", "Private bathroom", "Full kitchen", "Smart TV with Netflix", "Air conditioning"],
  },
];

/* Prices are Eli's call. Leave a value null and the page shows "Quoted with your dates".
   [SUB: Eli sets every number below before ads point here.] */
export const PRICING: Record<string, number | null> = {
  "setup-little-things": null,
  "setup-the-evening": null,
  "setup-the-big-one": null,
};

export function priceLabel(key: string): string {
  const value = PRICING[key];
  return typeof value === "number" ? `$${value.toLocaleString("en-CA")}` : "Quoted with your dates";
}
