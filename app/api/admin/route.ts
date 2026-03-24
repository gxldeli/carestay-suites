import { NextResponse } from "next/server";
import { redis } from "@/app/lib/redis";

/* ─── Upstash Redis overrides store ─── */

export interface ListingOverride {
  priceOverride?: number;
  hidden?: boolean;
  soakingTub?: boolean;
  carestayStandard?: boolean;
  titleOverride?: string;
  descriptionOverride?: string;
  nearbyHospital?: string;
  hospitalDistance?: string;
  sortOrder?: number;
  featured?: boolean;
  videoUrl?: string;
}

export interface CustomListing {
  id: string;
  title: string;
  location: string;
  beds: number;
  baths: number;
  price: number;
  sqft: number;
  img: string;
  images: string[];
  description: string;
  nearbyHospital: string;
  hospitalDistance: string;
  soakingTub: boolean;
  carestayStandard: boolean;
  sortOrder?: number;
  featured?: boolean;
}

export interface ReviewItem {
  id: string;
  name: string;
  stars: number;
  text: string;
  date: string;
  verified: boolean;
  stayInfo?: string;
}

export interface ListingReviews {
  totalCount: number;
  items: ReviewItem[];
}

interface OverridesData {
  listings: Record<string, ListingOverride>;
  customListings: CustomListing[];
  reviews: Record<string, ListingReviews>;
}

const REDIS_KEY = "admin:overrides";

async function getOverrides(): Promise<OverridesData> {
  const data = await redis.get<OverridesData>(REDIS_KEY);
  return data || { listings: {}, customListings: [], reviews: {} };
}

async function setOverrides(data: OverridesData) {
  await redis.set(REDIS_KEY, data);
}

export async function GET() {
  const overrides = await getOverrides();
  return NextResponse.json({ status: "success", data: overrides });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, action, payload } = body;

    if (password !== "carestay2026") {
      return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    const overrides = await getOverrides();

    if (action === "updateListing") {
      const { id, ...fields } = payload as { id: string } & ListingOverride;
      overrides.listings[id] = { ...overrides.listings[id], ...fields };
      console.log("[Admin API] Updated listing", id, "fields:", fields, "result:", overrides.listings[id]);
    } else if (action === "addCustomListing") {
      const listing = payload as Omit<CustomListing, "id">;
      const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      overrides.customListings.push({ ...listing, id });
    } else if (action === "deleteCustomListing") {
      const { id } = payload as { id: string };
      overrides.customListings = overrides.customListings.filter((l) => l.id !== id);
    } else if (action === "updateCustomListing") {
      const { id, ...fields } = payload as { id: string } & Partial<CustomListing>;
      const idx = overrides.customListings.findIndex((l) => l.id === id);
      if (idx !== -1) overrides.customListings[idx] = { ...overrides.customListings[idx], ...fields };
    } else if (action === "updateReviewSettings") {
      const { listingId, totalCount } = payload as { listingId: string; totalCount: number };
      if (!overrides.reviews) overrides.reviews = {};
      if (!overrides.reviews[listingId]) overrides.reviews[listingId] = { totalCount: 0, items: [] };
      overrides.reviews[listingId].totalCount = totalCount;
    } else if (action === "addReview") {
      const { listingId, name, stars, text, date, verified, stayInfo } = payload as { listingId: string; name: string; stars: number; text: string; date: string; verified: boolean; stayInfo?: string };
      if (!overrides.reviews) overrides.reviews = {};
      if (!overrides.reviews[listingId]) overrides.reviews[listingId] = { totalCount: 0, items: [] };
      const id = `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      overrides.reviews[listingId].items.push({ id, name, stars, text, date, verified, stayInfo: stayInfo || "" });
    } else if (action === "updateReview") {
      const { listingId, reviewId, ...fields } = payload as { listingId: string; reviewId: string } & Partial<ReviewItem>;
      if (overrides.reviews?.[listingId]) {
        const idx = overrides.reviews[listingId].items.findIndex((r) => r.id === reviewId);
        if (idx !== -1) overrides.reviews[listingId].items[idx] = { ...overrides.reviews[listingId].items[idx], ...fields };
      }
    } else if (action === "deleteReview") {
      const { listingId, reviewId } = payload as { listingId: string; reviewId: string };
      if (overrides.reviews?.[listingId]) {
        overrides.reviews[listingId].items = overrides.reviews[listingId].items.filter((r) => r.id !== reviewId);
      }
    } else {
      return NextResponse.json({ status: "error", message: "Unknown action" }, { status: 400 });
    }

    await setOverrides(overrides);
    return NextResponse.json({ status: "success", data: overrides });
  } catch (error) {
    console.error("[Admin API] Error:", error);
    return NextResponse.json({ status: "error", message: "Server error" }, { status: 500 });
  }
}
