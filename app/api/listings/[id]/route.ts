import { NextResponse } from "next/server";
import { getListing, extractAmenityNames, extractBedroomCount } from "@/app/lib/hostaway";
import { redis } from "@/app/lib/redis";

interface CustomListing { id: string; title: string; location: string; beds: number; baths: number; price: number; sqft: number; img: string; images: string[]; description: string; nearbyHospital: string; hospitalDistance: string; soakingTub: boolean; carestayStandard: boolean; sortOrder?: number; featured?: boolean; videoUrl?: string; hidden?: boolean }
interface OverridesData { listings: Record<string, unknown>; customListings: CustomListing[] }

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const rawId = params.id;

  try {
    // Check if this is a custom listing (string ID like "custom-...")
    if (rawId.startsWith("custom-")) {
      const overrides = (await redis.get<OverridesData>("admin:overrides")) || { listings: {}, customListings: [] };
      const cl = overrides.customListings.find(c => c.id === rawId);
      if (!cl) {
        return NextResponse.json({ status: "error", message: "Listing not found" }, { status: 404 });
      }
      return NextResponse.json({
        status: "success",
        listing: {
          id: cl.id, title: cl.title, location: cl.location, beds: cl.beds, baths: cl.baths,
          price: cl.price, sqft: cl.sqft, img: cl.images?.[0] || cl.img,
          images: cl.images?.length ? cl.images : (cl.img ? [cl.img] : []),
          description: cl.description, available: true, amenities: [],
          address: "", latitude: 0, longitude: 0,
          maxGuests: cl.beds * 2 || 2, bedrooms: cl.beds || 1,
          soakingTub: cl.soakingTub, carestayStandard: cl.carestayStandard,
          nearbyHospital: cl.nearbyHospital, hospitalDistance: cl.hospitalDistance,
          sortOrder: cl.sortOrder ?? 50, featured: cl.featured || false, videoUrl: cl.videoUrl || "", isCustom: true,
        },
      });
    }

    // HostAway listing (numeric ID)
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ status: "error", message: "Invalid listing ID" }, { status: 400 });
    }

    const listing = await getListing(id);
    if (!listing) {
      return NextResponse.json({ status: "error", message: "Listing not found" }, { status: 404 });
    }

    const transformed = {
      id: listing.id,
      title: listing.name,
      location: listing.city || "Toronto",
      beds: listing.bedsNumber || listing.beds || 1,
      baths: listing.bathrooms || 1,
      price: listing.price ? Math.round(listing.price * 30) : 0,
      sqft: listing.squareFeet || 0,
      img: listing.pictures?.[0]?.originalUrl || listing.pictures?.[0]?.url || listing.images?.[0]?.url || listing.listingImages?.[0]?.url || listing.thumbnailUrl || "",
      images: (listing.pictures?.map((p) => p.originalUrl || p.url) || listing.images?.map((p) => p.url) || listing.listingImages?.map((p) => p.url) || (listing.thumbnailUrl ? [listing.thumbnailUrl] : [])),
      description: listing.description || "",
      available: true,
      amenities: extractAmenityNames(listing),
      address: listing.address || "",
      latitude: listing.latitude,
      longitude: listing.longitude,
      maxGuests: listing.personCapacity || listing.maxGuests || listing.guestsIncluded || 0,
      bedrooms: extractBedroomCount(listing),
    };

    return NextResponse.json({ status: "success", listing: transformed });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Failed to fetch listing" },
      { status: 500 }
    );
  }
}
