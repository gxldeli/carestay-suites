import { NextResponse } from "next/server";
import { getListing } from "@/app/lib/hostaway";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json(
      { status: "error", message: "Invalid listing ID" },
      { status: 400 }
    );
  }

  try {
    const listing = await getListing(id);
    if (!listing) {
      return NextResponse.json(
        { status: "error", message: "Listing not found" },
        { status: 404 }
      );
    }

    const transformed = {
      id: listing.id,
      title: listing.name,
      location: listing.city || "Toronto",
      beds: listing.bedrooms || 1,
      baths: listing.bathrooms || 1,
      price: listing.price ? Math.round(listing.price * 30) : 0,
      sqft: listing.squareFeet || 0,
      img: listing.pictures?.[0]?.originalUrl || listing.pictures?.[0]?.url || listing.images?.[0]?.url || listing.listingImages?.[0]?.url || listing.thumbnailUrl || "",
      images: (listing.pictures?.map((p) => p.originalUrl || p.url) || listing.images?.map((p) => p.url) || listing.listingImages?.map((p) => p.url) || (listing.thumbnailUrl ? [listing.thumbnailUrl] : [])),
      description: listing.description || "",
      available: true,
      amenities: listing.amenities || [],
      address: listing.address || "",
      latitude: listing.latitude,
      longitude: listing.longitude,
      maxGuests: listing.maxGuests,
    };

    return NextResponse.json({ status: "success", listing: transformed });
  } catch (error) {
    console.error("[API /listings/id] Error:", error instanceof Error ? error.message : error);
    console.error("[API /listings/id] Stack:", error instanceof Error ? error.stack : "N/A");
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Failed to fetch listing" },
      { status: 500 }
    );
  }
}
