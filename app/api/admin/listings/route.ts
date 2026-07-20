import { NextResponse } from "next/server";
import { getListings } from "@/app/lib/hostaway";

export async function GET(request: Request) {
  if (request.headers.get("x-admin-password") !== "carestay2026") {
    return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
  }

  try {
    const listings = await getListings();
    const compactListings = listings.map((listing) => ({
      id: listing.id,
      title: listing.name,
      location: listing.city || "Toronto",
      beds: listing.bedsNumber || listing.beds || 1,
      baths: listing.bathrooms || 1,
      price: listing.price ? Math.round(listing.price * 30) : 0,
      sqft: listing.squareFeet || 0,
      img: listing.pictures?.[0]?.originalUrl || listing.pictures?.[0]?.url || listing.images?.[0]?.url || listing.listingImages?.[0]?.url || listing.thumbnailUrl || "",
      description: listing.description || "",
    }));

    return NextResponse.json(
      { status: "success", listings: compactListings, count: compactListings.length },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Failed to fetch listings", listings: [] },
      { status: 500 }
    );
  }
}
