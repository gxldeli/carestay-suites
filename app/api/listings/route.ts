import { NextResponse } from "next/server";
import { getListings, extractAmenityNames } from "@/app/lib/hostaway";
import { redis } from "@/app/lib/redis";

// Upstash Redis overrides store
interface ListingOverride { priceOverride?: number; hidden?: boolean; soakingTub?: boolean; carestayStandard?: boolean; titleOverride?: string; descriptionOverride?: string; nearbyHospital?: string; hospitalDistance?: string; sortOrder?: number; featured?: boolean; videoUrl?: string }
interface CustomListing { id: string; title: string; location: string; beds: number; baths: number; price: number; sqft: number; img: string; images: string[]; description: string; nearbyHospital: string; hospitalDistance: string; soakingTub: boolean; carestayStandard: boolean; sortOrder?: number; featured?: boolean }
interface OverridesData { listings: Record<string, ListingOverride>; customListings: CustomListing[] }

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeHidden = searchParams.get("includeHidden") === "true";
    const listings = await getListings();

    const overrides = (await redis.get<OverridesData>("admin:overrides")) || { listings: {}, customListings: [] };

    // Transform HostAway data into our frontend format
    const transformed = listings
      .map((l) => {
        const ov = overrides.listings[String(l.id)] || {};
        return {
          id: l.id,
          title: ov.titleOverride || l.name,
          location: l.city || "Toronto",
          beds: l.beds || l.bedrooms || 1,
          baths: l.bathrooms || 1,
          price: ov.priceOverride ?? (l.price ? Math.round(l.price * 30) : 0),
          sqft: l.squareFeet || 0,
          img: l.pictures?.[0]?.originalUrl || l.pictures?.[0]?.url || l.images?.[0]?.url || l.listingImages?.[0]?.url || l.thumbnailUrl || "",
          images: (l.pictures?.map((p) => p.originalUrl || p.url) || l.images?.map((p) => p.url) || l.listingImages?.map((p) => p.url) || (l.thumbnailUrl ? [l.thumbnailUrl] : [])),
          description: ov.descriptionOverride || l.description || "",
          available: true,
          amenities: extractAmenityNames(l),
          address: l.address || "",
          latitude: l.latitude,
          longitude: l.longitude,
          maxGuests: l.personCapacity || l.maxGuests || l.guestsIncluded || 0,
          bedrooms: l.bedrooms || 0,
          soakingTub: ov.soakingTub || false,
          carestayStandard: ov.carestayStandard || false,
          hidden: ov.hidden || false,
          nearbyHospital: ov.nearbyHospital || "",
          hospitalDistance: ov.hospitalDistance || "",
          sortOrder: ov.sortOrder ?? 50,
          featured: ov.featured || false,
          videoUrl: ov.videoUrl || "",
        };
      })
      .filter((l) => includeHidden || !l.hidden);

    // Append custom listings
    const custom = overrides.customListings.map((cl) => ({
      id: cl.id,
      title: cl.title,
      location: cl.location,
      beds: cl.beds,
      baths: cl.baths,
      price: cl.price,
      sqft: cl.sqft,
      img: cl.images?.[0] || cl.img,
      images: cl.images?.length ? cl.images : (cl.img ? [cl.img] : []),
      description: cl.description,
      available: true,
      amenities: [] as string[],
      address: "",
      latitude: 0,
      longitude: 0,
      soakingTub: cl.soakingTub,
      carestayStandard: cl.carestayStandard,
      hidden: false,
      nearbyHospital: cl.nearbyHospital,
      hospitalDistance: cl.hospitalDistance,
      sortOrder: cl.sortOrder ?? 50,
      featured: cl.featured || false,
      isCustom: true,
    }));

    const all = [...transformed, ...custom].sort((a, b) => (a.sortOrder ?? 50) - (b.sortOrder ?? 50));

    return NextResponse.json({
      status: "success",
      listings: all,
      count: all.length,
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
