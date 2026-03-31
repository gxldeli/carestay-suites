import { NextResponse } from "next/server";
import { redis } from "@/app/lib/redis";

interface ReviewItem { id: string; name: string; stars: number; text: string; date: string; verified: boolean; stayInfo?: string }
interface ListingReviews { totalCount: number; items: ReviewItem[] }
interface ListingOverride { featured?: boolean; hidden?: boolean; [key: string]: unknown }
interface CustomListing { id: string; title: string; featured?: boolean; hidden?: boolean; nearbyHospital?: string; [key: string]: unknown }
interface OverridesData { listings: Record<string, ListingOverride>; customListings: CustomListing[]; reviews: Record<string, ListingReviews> }

const NAMES = ["Sarah M.", "Jessica R.", "Michael T.", "Amanda K.", "David L.", "Rachel W.", "James P.", "Nicole B.", "Christopher H.", "Emily S.", "Daniel F.", "Lauren G.", "Andrew C.", "Stephanie D.", "Ryan J.", "Megan V.", "Kevin O.", "Ashley N.", "Brandon E.", "Olivia Z."];

const TEMPLATES = [
  "Perfect for my 6-week assignment at {hospital}. Everything I needed was already here. The blackout curtains were a lifesaver for night shifts.",
  "Clean, comfortable, and close to the hospital. Exactly what the listing showed. No surprises.",
  "Third time booking with CareStay. Consistent quality every time. The foot massager after a 12-hour shift is everything.",
  "Moved in with just my suitcase. Kitchen was stocked, bed was comfortable, WiFi was fast. Made a stressful relocation so much easier.",
  "Way better than the last furnished rental I tried. Actually felt like someone thought about what healthcare workers need.",
  "Quiet building, great location, and the CareStay amenity kit is a nice touch. Blue light glasses were unexpected but appreciated.",
  "Used this for a 3-month contract. Month-to-month was perfect since my assignment got extended twice.",
  "Finally a place that doesn't require a massive deposit or year-long lease. Exactly what travel nurses need.",
  "The soaking tub alone was worth it after back-to-back shifts. Really thoughtful setup.",
  "Professional management team. Quick responses, clean turnover, no drama. Will book again.",
  "Recommended to two other nurses on my unit. Both loved their suites too.",
  "Great workspace for charting after shifts. Fast WiFi, good desk setup.",
  "Close to transit and the hospital. Walked to work most days.",
  "Felt safe and comfortable from day one. Exactly what I was hoping for.",
  "Better than a hotel for extended stays. Actually feels like a home.",
];

const STAY_INFO = ["Stayed 2 months", "Stayed 6 weeks", "Stayed 3 months", "Stayed 8 weeks", "Stayed 1 month", "Stayed 10 weeks", "Stayed in January", "Stayed in February", "Stayed in March"];

const HOSPITALS = ["Toronto General", "Sunnybrook", "SickKids", "Mount Sinai", "St. Michael's", "Humber River", "North York General", "Scarborough Health"];

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle<T>(arr: T[]): T[] { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function randomDate(): string {
  const start = new Date("2025-10-01").getTime();
  const end = new Date("2026-03-31").getTime();
  const d = new Date(start + Math.random() * (end - start));
  return d.toISOString().split("T")[0];
}

function randomStars(): number {
  const r = Math.random();
  if (r < 0.55) return 5;
  if (r < 0.85) return 4;
  return 4;
}

function generateReview(hospital?: string, usedNames?: Set<string>): ReviewItem {
  let name = pick(NAMES);
  if (usedNames) {
    const available = NAMES.filter(n => !usedNames.has(n));
    name = available.length > 0 ? pick(available) : pick(NAMES);
    usedNames.add(name);
  }
  const h = hospital || pick(HOSPITALS);
  const text = pick(TEMPLATES).replace("{hospital}", h);
  return {
    id: `rev-gen-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    stars: randomStars(),
    text,
    date: randomDate(),
    verified: true,
    stayInfo: pick(STAY_INFO),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("password") !== "carestay2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await redis.get<OverridesData>("admin:overrides");
  if (!data) return NextResponse.json({ error: "No data in Redis" }, { status: 500 });
  if (!data.reviews) data.reviews = {};

  const results: Record<string, { featured: boolean; totalCount: number; writtenReviews: number }> = {};

  // Collect all listing IDs — HostAway overrides with featured flag
  const hostawayIds = Object.entries(data.listings)
    .filter(([, ov]) => !ov.hidden)
    .map(([id, ov]) => ({ id, featured: ov.featured === true, hospital: undefined as string | undefined }));

  // Custom listings
  const customIds = data.customListings
    .filter(cl => !cl.hidden)
    .map(cl => ({ id: cl.id, featured: cl.featured === true, hospital: cl.nearbyHospital || undefined }));

  const allListings = [...hostawayIds, ...customIds];

  for (const listing of allListings) {
    const usedTemplates = shuffle(TEMPLATES);
    const usedNames = new Set<string>();

    if (listing.featured) {
      // Featured: 8-20 totalCount, 4-6 written reviews
      const totalCount = rand(8, 20);
      const reviewCount = rand(4, 6);
      const items: ReviewItem[] = [];
      for (let i = 0; i < reviewCount; i++) {
        const review = generateReview(listing.hospital, usedNames);
        // Use different templates for each review
        if (i < usedTemplates.length) {
          const h = listing.hospital || pick(HOSPITALS);
          review.text = usedTemplates[i].replace("{hospital}", h);
        }
        items.push(review);
      }
      data.reviews[listing.id] = { totalCount, items };
      results[listing.id] = { featured: true, totalCount, writtenReviews: items.length };
    } else {
      // Non-featured: 5-15 totalCount, no written reviews
      const totalCount = rand(5, 15);
      data.reviews[listing.id] = { totalCount, items: [] };
      results[listing.id] = { featured: false, totalCount, writtenReviews: 0 };
    }
  }

  await redis.set("admin:overrides", data);

  const featuredCount = Object.values(results).filter(r => r.featured).length;
  const nonFeaturedCount = Object.values(results).filter(r => !r.featured).length;

  return NextResponse.json({
    status: "success",
    summary: {
      featuredListings: featuredCount,
      nonFeaturedListings: nonFeaturedCount,
      totalListingsProcessed: Object.keys(results).length,
    },
    details: results,
  });
}
