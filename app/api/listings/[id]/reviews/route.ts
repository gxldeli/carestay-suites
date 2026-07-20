import { NextResponse } from "next/server";
import { redis } from "@/app/lib/redis";
import { hasRestrictedDurationLanguage } from "@/app/lib/public-listing-copy";
import { getListing } from "@/app/lib/hostaway";

interface ReviewItem {
  id: string;
  name: string;
  stars: number;
  text: string;
  date: string;
  verified: boolean;
  stayInfo?: string;
}

interface OverridesData {
  listings?: Record<string, { hidden?: boolean }>;
  customListings?: Array<{ id: string; hidden?: boolean }>;
  reviews?: Record<string, { totalCount: number; items: ReviewItem[] }>;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const overrides = await redis.get<OverridesData>("admin:overrides");
    if (id.startsWith("custom-")) {
      const customListing = overrides?.customListings?.find((listing) => listing.id === id);
      if (!customListing || customListing.hidden) {
        return NextResponse.json({ status: "error", message: "Listing not found" }, { status: 404 });
      }
    } else {
      const listingId = Number(id);
      if (!Number.isInteger(listingId)) {
        return NextResponse.json({ status: "error", message: "Listing not found" }, { status: 404 });
      }
      const listing = await getListing(listingId);
      if (!listing || listing.isActive === 0 || overrides?.listings?.[id]?.hidden) {
        return NextResponse.json({ status: "error", message: "Listing not found" }, { status: 404 });
      }
    }

    const reviews = (overrides?.reviews?.[id]?.items || [])
      .filter((review) => !review.id.startsWith("rev-gen-") && !hasRestrictedDurationLanguage(review.text))
      .map(({ id, name, stars, text, date, verified }) => ({ id, name, stars, text, date, verified }));
    return NextResponse.json(
      { status: "success", reviews: { totalCount: reviews.length, items: reviews } },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ status: "success", reviews: { totalCount: 0, items: [] } });
  }
}
