import { NextResponse } from "next/server";
import { getAvailableListings } from "@/app/lib/hostaway";
import { redis } from "@/app/lib/redis";
import { getTorontoToday, isValidDateInput } from "@/app/lib/date-input";

interface OverridesData {
  listings?: Record<string, { hidden?: boolean }>;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = Number(searchParams.get("guests") || "1");

  if (!isValidDateInput(checkIn) || !isValidDateInput(checkOut) || checkIn < getTorontoToday() || checkOut <= checkIn) {
    return NextResponse.json(
      { status: "error", message: "Choose a valid check-in and check-out date." },
      { status: 400 },
    );
  }

  if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
    return NextResponse.json(
      { status: "error", message: "Guest count must be between 1 and 20." },
      { status: 400 },
    );
  }

  try {
    const [matches, overrides] = await Promise.all([
      getAvailableListings({ checkIn, checkOut, guests }),
      redis.get<OverridesData>("admin:overrides"),
    ]);
    const listingOverrides = overrides?.listings || {};
    const listingIds = matches
      .filter((listing) => listing.isActive !== 0 && !listingOverrides[String(listing.id)]?.hidden)
      .map((listing) => String(listing.id));

    return NextResponse.json(
      { status: "success", verified: true, listingIds, count: listingIds.length },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
    );
  } catch {
    return NextResponse.json(
      { status: "error", verified: false, message: "Live availability could not be confirmed." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
