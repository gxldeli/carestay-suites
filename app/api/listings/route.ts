import { NextResponse } from "next/server";
import { getListings } from "@/app/lib/hostaway";

// Access the same in-memory overrides store used by /api/admin
interface ListingOverride { priceOverride?: number; hidden?: boolean; soakingTub?: boolean; carestayStandard?: boolean }
interface CustomListing { id: string; title: string; location: string; beds: number; baths: number; price: number; sqft: number; img: string; description: string; nearbyHospital: string; hospitalDistance: string; soakingTub: boolean; carestayStandard: boolean }
interface OverridesData { listings: Record<string, ListingOverride>; customListings: CustomListing[] }
const globalStore = globalThis as unknown as { __adminOverrides?: OverridesData };
function getOverrides(): OverridesData { return globalStore.__adminOverrides || { listings: {}, customListings: [] }; }

export async function GET() {
  try {
    const listings = await getListings();

    const overrides = getOverrides();

    // Transform HostAway data into our frontend format
    const transformed = listings
      .map((l) => {
        const ov = overrides.listings[String(l.id)] || {};
        return {
          id: l.id,
          title: l.name,
          location: l.city || "Toronto",
          beds: l.bedrooms || 1,
          baths: l.bathrooms || 1,
          price: ov.priceOverride ?? (l.price ? Math.round(l.price * 30) : 0),
          sqft: l.squareFeet || 0,
          img: l.thumbnailUrl || l.pictures?.[0]?.url || "",
          images: l.pictures?.map((p) => p.url) || [],
          description: l.description || "",
          available: true,
          amenities: l.amenities || [],
          address: l.address || "",
          latitude: l.latitude,
          longitude: l.longitude,
          soakingTub: ov.soakingTub || false,
          carestayStandard: ov.carestayStandard || false,
          hidden: ov.hidden || false,
        };
      })
      .filter((l) => !l.hidden);

    // Append custom listings
    const custom = overrides.customListings.map((cl) => ({
      id: cl.id,
      title: cl.title,
      location: cl.location,
      beds: cl.beds,
      baths: cl.baths,
      price: cl.price,
      sqft: cl.sqft,
      img: cl.img,
      images: cl.img ? [cl.img] : [],
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
      isCustom: true,
    }));

    const all = [...transformed, ...custom];

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
