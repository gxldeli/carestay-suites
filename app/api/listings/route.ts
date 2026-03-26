import { NextResponse } from "next/server";
import { getListings, extractAmenityNames, extractBedroomCount } from "@/app/lib/hostaway";
import { redis } from "@/app/lib/redis";

// Upstash Redis overrides store
interface ListingOverride { priceOverride?: number; hidden?: boolean; soakingTub?: boolean; carestayStandard?: boolean; titleOverride?: string; descriptionOverride?: string; nearbyHospital?: string; hospitalDistance?: string; sortOrder?: number; featured?: boolean; videoUrl?: string }
interface CustomListing { id: string; title: string; location: string; beds: number; baths: number; price: number; sqft: number; img: string; images: string[]; description: string; nearbyHospital: string; hospitalDistance: string; soakingTub: boolean; carestayStandard: boolean; sortOrder?: number; featured?: boolean }
interface OverridesData { listings: Record<string, ListingOverride>; customListings: CustomListing[] }

const GTA_HOSPITALS = [
  { name: "Toronto General Hospital", lat: 43.6594, lng: -79.3882 },
  { name: "Sunnybrook Hospital", lat: 43.7225, lng: -79.3728 },
  { name: "SickKids Hospital", lat: 43.6562, lng: -79.3889 },
  { name: "Mount Sinai Hospital", lat: 43.6575, lng: -79.3907 },
  { name: "St. Michael's Hospital", lat: 43.6536, lng: -79.3776 },
  { name: "Humber River Hospital", lat: 43.7485, lng: -79.5217 },
  { name: "Scarborough Health Network", lat: 43.7731, lng: -79.2577 },
  { name: "North York General Hospital", lat: 43.7660, lng: -79.3637 },
  { name: "Credit Valley Hospital", lat: 43.5537, lng: -79.6625 },
  { name: "Trillium Health Partners", lat: 43.5917, lng: -79.5975 },
  { name: "Princess Margaret Cancer Centre", lat: 43.6594, lng: -79.3882 },
  { name: "Toronto Western Hospital", lat: 43.6534, lng: -79.4057 },
  { name: "Michael Garron Hospital", lat: 43.6897, lng: -79.3256 },
  { name: "William Osler Health System", lat: 43.7315, lng: -79.7624 },
];

function findNearestHospital(lat: number, lng: number): { name: string; distance: string } | null {
  if (!lat && !lng) return null;
  const toRad = (d: number) => (d * Math.PI) / 180;
  let best = { name: "", km: Infinity };
  for (const h of GTA_HOSPITALS) {
    const dLat = toRad(h.lat - lat);
    const dLng = toRad(h.lng - lng);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat)) * Math.cos(toRad(h.lat)) * Math.sin(dLng / 2) ** 2;
    const km = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    if (km < best.km) best = { name: h.name, km };
  }
  if (best.km > 50) return null;
  const mins = Math.max(2, Math.round(best.km * 3));
  return { name: best.name, distance: `${mins} min drive` };
}

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
        const autoHospital = (!ov.nearbyHospital && l.latitude && l.longitude) ? findNearestHospital(l.latitude, l.longitude) : null;
        return {
          id: l.id,
          title: ov.titleOverride || l.name,
          location: l.city || "Toronto",
          beds: l.bedsNumber || l.beds || 1,
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
          bedrooms: extractBedroomCount(l),
          soakingTub: ov.soakingTub || false,
          carestayStandard: ov.carestayStandard || false,
          hidden: ov.hidden || false,
          nearbyHospital: ov.nearbyHospital || autoHospital?.name || "",
          hospitalDistance: ov.hospitalDistance || autoHospital?.distance || "",
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
      maxGuests: cl.beds * 2 || 2,
      bedrooms: cl.beds || 1,
      soakingTub: cl.soakingTub,
      carestayStandard: cl.carestayStandard,
      hidden: false,
      nearbyHospital: cl.nearbyHospital,
      hospitalDistance: cl.hospitalDistance,
      sortOrder: cl.sortOrder ?? 50,
      featured: cl.featured || false,
      videoUrl: "",
      isCustom: true,
    }));

    const all = [...transformed, ...custom].sort((a, b) => (a.sortOrder ?? 50) - (b.sortOrder ?? 50));

    return NextResponse.json({
      status: "success",
      listings: all,
      count: all.length,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Failed to fetch listings", listings: [] },
      { status: 500 }
    );
  }
}
