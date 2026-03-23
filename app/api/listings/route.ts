import { NextResponse } from "next/server";
import { getListings } from "@/app/lib/hostaway";

export async function GET() {
  try {
    const listings = await getListings();

    // Transform HostAway data into our frontend format
    const transformed = listings.map((l) => ({
      id: l.id,
      title: l.name,
      location: l.city || "Toronto",
      beds: l.bedrooms || 1,
      baths: l.bathrooms || 1,
      price: l.price ? Math.round(l.price * 30) : 0, // Convert nightly to monthly estimate
      sqft: l.squareFeet || 0,
      img: l.thumbnailUrl || l.pictures?.[0]?.url || "",
      images: l.pictures?.map((p) => p.url) || [],
      description: l.description || "",
      available: true,
      amenities: l.amenities || [],
      address: l.address || "",
      latitude: l.latitude,
      longitude: l.longitude,
    }));

    return NextResponse.json({
      status: "success",
      listings: transformed,
      count: transformed.length,
    });
  } catch (error) {
    console.error("[API /listings] Error:", error instanceof Error ? error.message : error);
    console.error("[API /listings] Stack:", error instanceof Error ? error.stack : "N/A");
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Failed to fetch listings", listings: [] },
      { status: 500 }
    );
  }
}
