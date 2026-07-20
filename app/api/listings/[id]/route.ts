import { NextResponse } from "next/server";
import { getListing, extractAmenityNames, extractBedroomCount } from "@/app/lib/hostaway";
import { redis } from "@/app/lib/redis";
import { filterPublicAmenities, getPublicListingDescription } from "@/app/lib/public-listing-copy";
import { getPublicAreaLabel, getPublicShowcaseDescription } from "@/app/lib/public-location";

interface ListingOverride { priceOverride?: number; hidden?: boolean; soakingTub?: boolean; carestayStandard?: boolean; titleOverride?: string; descriptionOverride?: string; nearbyHospital?: string; hospitalDistance?: string; sortOrder?: number; featured?: boolean; videoUrl?: string; availabilityStatus?: string }
interface CustomListing { id: string; title: string; location: string; beds: number; baths: number; price: number; sqft: number; img: string; images: string[]; description: string; nearbyHospital: string; hospitalDistance: string; soakingTub: boolean; carestayStandard: boolean; sortOrder?: number; featured?: boolean; videoUrl?: string; hidden?: boolean }
interface OverridesData { listings: Record<string, ListingOverride>; customListings: CustomListing[] }

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;

  try {
    const overrides = (await redis.get<OverridesData>("admin:overrides")) || { listings: {}, customListings: [] };
    // Check if this is a custom listing (string ID like "custom-...")
    if (rawId.startsWith("custom-")) {
      const cl = overrides.customListings.find(c => c.id === rawId);
      if (!cl || cl.hidden) {
        return NextResponse.json({ status: "error", message: "Listing not found" }, { status: 404 });
      }
      const publicLocation = getPublicAreaLabel(cl.location);
      return NextResponse.json({
        status: "success",
        listing: {
          id: cl.id, title: `Example · ${cl.title}`, location: publicLocation, beds: cl.beds, baths: cl.baths,
          price: 0, sqft: cl.sqft, img: cl.images?.[0] || cl.img,
          images: cl.images?.length ? cl.images : (cl.img ? [cl.img] : []),
          description: getPublicShowcaseDescription(cl.title, publicLocation), available: false, amenities: [],
          maxGuests: 0, bedrooms: cl.beds || 1,
          soakingTub: cl.soakingTub, carestayStandard: cl.carestayStandard,
          nearbyHospital: cl.nearbyHospital, hospitalDistance: cl.hospitalDistance,
          sortOrder: cl.sortOrder ?? 50, featured: cl.featured || false, videoUrl: cl.videoUrl || "", isCustom: true,
          inventorySource: "showcase", bookable: false, availabilityStatus: "Example",
        },
      });
    }

    // HostAway listing (numeric ID)
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ status: "error", message: "Invalid listing ID" }, { status: 400 });
    }

    const listing = await getListing(id);
    const ov = overrides.listings[rawId] || {};
    if (!listing || listing.isActive === 0 || ov.hidden) {
      return NextResponse.json({ status: "error", message: "Listing not found" }, { status: 404 });
    }

    const title = ov.titleOverride || listing.name;
    const location = listing.city || "Toronto";
    const availabilityStatus = ov.availabilityStatus || "Available";
    const bookable = !["Booked", "Waitlist Only"].includes(availabilityStatus);
    const transformed = {
      id: listing.id,
      title,
      location,
      beds: listing.bedsNumber || listing.beds || 1,
      baths: listing.bathrooms || 1,
      price: ov.priceOverride ?? (listing.price ? Math.round(listing.price * 30) : 0),
      sqft: listing.squareFeet || 0,
      img: listing.pictures?.[0]?.originalUrl || listing.pictures?.[0]?.url || listing.images?.[0]?.url || listing.listingImages?.[0]?.url || listing.thumbnailUrl || "",
      images: (listing.pictures?.map((p) => p.originalUrl || p.url) || listing.images?.map((p) => p.url) || listing.listingImages?.map((p) => p.url) || (listing.thumbnailUrl ? [listing.thumbnailUrl] : [])),
      description: getPublicListingDescription({
        title,
        location,
        beds: listing.bedsNumber || listing.beds || 1,
        bedrooms: extractBedroomCount(listing),
        description: ov.descriptionOverride || listing.description || "",
      }),
      available: bookable,
      amenities: filterPublicAmenities(extractAmenityNames(listing)),
      maxGuests: listing.personCapacity || listing.maxGuests || listing.guestsIncluded || 0,
      bedrooms: extractBedroomCount(listing),
      soakingTub: ov.soakingTub || false,
      carestayStandard: ov.carestayStandard || false,
      nearbyHospital: ov.nearbyHospital || "",
      hospitalDistance: ov.hospitalDistance || "",
      sortOrder: ov.sortOrder ?? 50,
      featured: ov.featured === true,
      videoUrl: ov.videoUrl || "",
      availabilityStatus,
      inventorySource: "hostaway",
      bookable,
    };

    return NextResponse.json({ status: "success", listing: transformed });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}
