import { NextResponse } from "next/server";
import { redis } from "@/app/lib/redis";

interface ReviewItem { id: string; name: string; stars: number; text: string; date: string; verified: boolean; stayInfo?: string }
interface ListingReviews { totalCount: number; items: ReviewItem[] }
interface ListingOverride { featured?: boolean; hidden?: boolean; [key: string]: unknown }
interface CustomListing { id: string; title: string; featured?: boolean; hidden?: boolean; nearbyHospital?: string; [key: string]: unknown }
interface OverridesData { listings: Record<string, ListingOverride>; customListings: CustomListing[]; reviews: Record<string, ListingReviews> }

/* ─── Data Pools ─── */

const NAMES = [
  "Sarah M.", "Jessica R.", "Michael T.", "Amanda K.", "David L.", "Rachel W.", "James P.", "Nicole B.",
  "Christopher H.", "Emily S.", "Daniel F.", "Lauren G.", "Andrew C.", "Stephanie D.", "Ryan J.", "Megan V.",
  "Kevin O.", "Ashley N.", "Brandon E.", "Olivia Z.", "Marcus D.", "Priya S.", "Jason K.", "Natalie C.",
  "Trevor M.", "Alicia R.", "Derek W.", "Hannah L.", "Tyler B.", "Samantha H.", "Connor J.", "Michelle F.",
  "Patrick G.", "Brittany A.", "Jordan N.", "Rebecca T.", "Alex P.", "Christina V.", "Sean O.", "Diana E.",
];

const HOSPITALS = [
  "Toronto General", "Sunnybrook", "SickKids", "Mount Sinai", "St. Michael's",
  "Humber River", "North York General", "Scarborough Health", "Princess Margaret", "Toronto Western",
];

// Short reviews (1 sentence)
const SHORT_REVIEWS = [
  "Clean, comfortable, and close to the hospital. Exactly what I needed.",
  "Great place. Would definitely book again for my next assignment.",
  "Solid choice for travel nurses. No complaints.",
  "Professional management team. Quick responses, clean turnover, no drama.",
  "Close to transit and the hospital. Walked to work most days.",
  "Felt safe and comfortable from day one. Exactly what I was hoping for.",
  "Better than a hotel for extended stays. Actually feels like a home.",
  "Recommended to two other nurses on my unit. Both loved their suites too.",
  "The soaking tub alone was worth it after back-to-back shifts. Really thoughtful setup.",
  "Great workspace for charting after shifts. Fast WiFi, good desk setup.",
];

// Medium reviews (2 sentences)
const MEDIUM_REVIEWS = [
  "Perfect for my assignment at {hospital}. The blackout curtains and white noise machine made day-sleeping after night shifts actually possible.",
  "Third time using CareStay and they're consistently good. The amenity kit is a thoughtful touch that shows they actually understand healthcare workers.",
  "Moved in with one suitcase and everything was ready. Kitchen stocked, bed comfortable, WiFi fast — made the transition to a new city painless.",
  "Way better than the corporate housing my agency offered. The soaking tub after a 12-hour ER shift was exactly what I needed.",
  "Quiet building, great location near transit, and the CareStay Standard kit was a nice surprise. The foot massager is no joke after being on your feet all day.",
  "Month-to-month was perfect since my assignment at {hospital} got extended twice. No penalties, no hassle, just flexibility.",
  "Finally a furnished rental that doesn't require a massive deposit or year-long lease. Exactly what travel nurses need.",
  "Blue light glasses in the amenity kit were unexpected but so appreciated. Someone on this team actually works night shifts or knows someone who does.",
  "Used this during my rotation at {hospital} and it was a game-changer. Five-minute commute meant I could actually sleep between shifts.",
  "The kitchen setup was a huge plus — I could meal prep instead of eating hospital cafeteria food every day. Saved money and ate better.",
];

// Long reviews (3 sentences)
const LONG_REVIEWS = [
  "I was skeptical about booking online for a 2-month stay, but this place exceeded expectations. Everything was exactly as shown, the management team responded within minutes, and the location was perfect for my rotation at {hospital}. Already recommended it to two colleagues.",
  "After getting burned by a fake listing on another site, I was nervous about booking again. CareStay was the complete opposite experience — verified property, professional management, and every amenity they promised was actually there. Will absolutely use them for my next Ontario assignment.",
  "This was my first travel nurse assignment and finding housing was the most stressful part. CareStay made it easy — month-to-month, no massive deposit, and the suite was move-in ready. The spare scrubs in the closet made me laugh but honestly came in handy twice.",
  "Stayed here during a particularly intense stretch at {hospital} and this suite was my sanctuary. Coming home to a clean, well-designed space with a soaking tub completely changed how I recovered between shifts. Worth every penny for the mental health benefits alone.",
  "I've done six travel assignments across three provinces and this is the best furnished rental I've found. The CareStay team clearly listened to healthcare workers when designing these units. Blackout curtains, stocked kitchen, fast WiFi, foot massager — they thought of everything.",
];

// Stay durations with approximate days for spacing calculation
const STAY_OPTIONS: { label: string; days: number }[] = [
  { label: "Stayed 6 weeks", days: 42 },
  { label: "Stayed 2 months", days: 60 },
  { label: "Stayed 3 months", days: 90 },
  { label: "Stayed 8 weeks", days: 56 },
  { label: "Stayed 10 weeks", days: 70 },
  { label: "Stayed 1 month", days: 30 },
];

/* ─── Helpers ─── */

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle<T>(arr: T[]): T[] { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function featuredStars(): number {
  const r = Math.random();
  if (r < 0.55) return 5;
  if (r < 0.8) return 4.5;
  return 4;
}

function nonFeaturedStars(): number {
  const r = Math.random();
  if (r < 0.3) return 5;
  if (r < 0.6) return 4.5;
  if (r < 0.85) return 4;
  return 3.5;
}

/**
 * Generate non-overlapping review dates spread across June 2025 – Feb 2026.
 * Each review gets a date that is the END of their stay, spaced apart by at least
 * the stay duration + a small gap so stays don't overlap.
 */
function generateDatesAndStays(count: number): { date: string; stay: { label: string; days: number } }[] {
  const rangeStart = new Date("2025-06-01").getTime();
  const rangeEnd = new Date("2026-02-28").getTime();
  const totalDays = Math.floor((rangeEnd - rangeStart) / (1000 * 60 * 60 * 24));

  // Pick random stay durations
  const stays = Array.from({ length: count }, () => pick(STAY_OPTIONS));

  // Calculate total days needed (sum of stays + gaps of ~14 days between)
  const totalNeeded = stays.reduce((sum, s) => sum + s.days, 0) + (count - 1) * 14;

  // Gap between end of one stay and start of next — ensures at least 28 days between review dates
  const gap = totalNeeded > totalDays ? Math.max(7, Math.floor((totalDays - stays.reduce((s, x) => s + x.days, 0)) / Math.max(count - 1, 1))) : rand(21, 35);

  const results: { date: string; stay: { label: string; days: number } }[] = [];
  let cursor = rangeStart + rand(0, 14) * 86400000; // start within first 2 weeks

  for (let i = 0; i < count; i++) {
    const stayEnd = cursor + stays[i].days * 86400000;
    const reviewDate = new Date(Math.min(stayEnd, rangeEnd));
    results.push({
      date: reviewDate.toISOString().split("T")[0],
      stay: stays[i],
    });
    cursor = stayEnd + gap * 86400000;
  }

  return results;
}

function pickReviewText(stars: number, hospital: string, usedTexts: Set<string>): string {
  // 5-star reviews get longer texts, lower stars get shorter
  let pool: string[];
  if (stars === 5) {
    pool = [...shuffle(LONG_REVIEWS), ...shuffle(MEDIUM_REVIEWS), ...shuffle(SHORT_REVIEWS)];
  } else if (stars >= 4) {
    pool = [...shuffle(MEDIUM_REVIEWS), ...shuffle(SHORT_REVIEWS), ...shuffle(LONG_REVIEWS)];
  } else {
    pool = [...shuffle(SHORT_REVIEWS), ...shuffle(MEDIUM_REVIEWS)];
  }

  for (const t of pool) {
    const text = t.replace(/\{hospital\}/g, hospital);
    if (!usedTexts.has(text)) {
      usedTexts.add(text);
      return text;
    }
  }
  // Fallback: use any text even if used
  return pool[0].replace(/\{hospital\}/g, hospital);
}

/* ─── Main Handler ─── */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("password") !== "carestay2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await redis.get<OverridesData>("admin:overrides");
  if (!data) return NextResponse.json({ error: "No data in Redis" }, { status: 500 });
  if (!data.reviews) data.reviews = {};

  const results: Record<string, { featured: boolean; totalCount: number; writtenReviews: number; avgStars: number }> = {};

  // Fetch all HostAway listings from the API to get every listing ID (not just overridden ones)
  let apiListingIds: { id: string; hospital?: string }[] = [];
  try {
    const baseUrl = new URL(request.url).origin;
    const res = await fetch(`${baseUrl}/api/listings?includeHidden=true`);
    const json = await res.json();
    if (json.status === "success" && json.listings) {
      apiListingIds = json.listings
        .filter((l: { isCustom?: boolean }) => !l.isCustom)
        .map((l: { id: number | string; nearbyHospital?: string }) => ({
          id: String(l.id),
          hospital: l.nearbyHospital || undefined,
        }));
    }
  } catch { /* fall back to override keys only */ }

  // Collect all visible listings — use API listing IDs for HostAway (covers ALL listings, not just overridden)
  const hostawayIds = apiListingIds.length > 0
    ? apiListingIds.map(l => ({ id: l.id, featured: (data.listings[l.id]?.featured === true), hospital: l.hospital }))
    : Object.entries(data.listings).filter(([, ov]) => !ov.hidden).map(([id, ov]) => ({ id, featured: ov.featured === true, hospital: undefined as string | undefined }));

  const customIds = data.customListings
    .filter(cl => !cl.hidden)
    .map(cl => ({ id: cl.id, featured: cl.featured === true, hospital: cl.nearbyHospital || undefined }));

  const allListings = [...hostawayIds, ...customIds];

  // Global name pool — shuffle once, cycle through to minimize cross-listing repeats
  const globalNames = shuffle(NAMES);
  let nameIdx = 0;

  // Global text tracker to reduce repeats across listings
  const globalUsedTexts = new Set<string>();

  for (const listing of allListings) {
    const isFeatured = listing.featured;
    const reviewCount = isFeatured ? rand(4, 6) : rand(2, 3);
    const totalCount = isFeatured ? rand(12, 25) : rand(5, 15);

    // Get unique names for this listing
    const listingNames: string[] = [];
    for (let i = 0; i < reviewCount; i++) {
      listingNames.push(globalNames[nameIdx % globalNames.length]);
      nameIdx++;
    }

    // Generate non-overlapping dates and stay durations
    const datesAndStays = generateDatesAndStays(reviewCount);

    // Generate star ratings
    const stars: number[] = [];
    for (let i = 0; i < reviewCount; i++) {
      stars.push(isFeatured ? featuredStars() : nonFeaturedStars());
    }

    // Build reviews — vary hospital per review
    const items: ReviewItem[] = [];
    const shuffledHospitals = shuffle(HOSPITALS);

    for (let i = 0; i < reviewCount; i++) {
      const hospital = listing.hospital || shuffledHospitals[i % shuffledHospitals.length];
      const text = pickReviewText(stars[i], hospital, globalUsedTexts);
      items.push({
        id: `rev-gen-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: listingNames[i],
        stars: stars[i],
        text,
        date: datesAndStays[i].date,
        verified: isFeatured ? true : Math.random() > 0.3,
        stayInfo: datesAndStays[i].stay.label,
      });
    }

    // Sort: highest stars first, then longest reviews first (best reviews at top)
    items.sort((a, b) => {
      if (b.stars !== a.stars) return b.stars - a.stars;
      return b.text.length - a.text.length;
    });

    data.reviews[listing.id] = { totalCount, items };

    const avgStars = items.length > 0 ? items.reduce((s, r) => s + r.stars, 0) / items.length : 0;
    results[listing.id] = { featured: isFeatured, totalCount, writtenReviews: items.length, avgStars: Math.round(avgStars * 10) / 10 };
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
