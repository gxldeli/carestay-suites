const HOSTAWAY_CLIENT_ID = process.env.HOSTAWAY_CLIENT_ID || "";
const HOSTAWAY_CLIENT_SECRET = process.env.HOSTAWAY_CLIENT_SECRET || "";
const HOSTAWAY_API_BASE = "https://api.hostaway.com/v1";

let cachedToken: { token: string; expires: number } | null = null;

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 5 min buffer)
  if (cachedToken && Date.now() < cachedToken.expires - 300000) {
    return cachedToken.token;
  }

  if (!HOSTAWAY_CLIENT_ID || !HOSTAWAY_CLIENT_SECRET) {
    throw new Error("HostAway credentials not configured");
  }

  const res = await fetch(`${HOSTAWAY_API_BASE}/accessTokens`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: HOSTAWAY_CLIENT_ID,
      client_secret: HOSTAWAY_CLIENT_SECRET,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HostAway auth failed: ${res.status} — ${body}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    // Token lasts 24 months but we refresh every 23 hours just in case
    expires: Date.now() + 23 * 60 * 60 * 1000,
  };

  return cachedToken.token;
}

export interface HostAwayListing {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bedroomsNumber: number;
  bathrooms: number;
  maxGuests: number;
  beds: number;
  bedsNumber: number;
  personCapacity: number;
  guestsIncluded: number;
  roomsNumber: number;
  listingRooms: Array<{ roomType?: string; type?: string; [key: string]: unknown }>;
  listingBedTypes: unknown[];
  squareFeet: number;
  propertyTypeId: number;
  roomTypeId: number;
  bathroomType: string;
  thumbnailUrl: string;
  pictures: Array<{ url: string; caption: string; originalUrl?: string }>;
  images: Array<{ url: string; caption?: string; originalUrl?: string }>;
  listingImages: Array<{ url: string; originalUrl?: string }>;
  amenities: string[];
  listingAmenities: Array<{ amenityId: number; amenityName?: string; name?: string }>;
  price: number;
  currencyCode: string;
  isActive: number;
  tags: string[];
  [key: string]: unknown;
}

// HostAway amenityId → human-readable name mapping
const AMENITY_ID_MAP: Record<number, string> = {
  1: "TV", 2: "Internet", 3: "Wireless Internet", 4: "Air Conditioning", 5: "Wheelchair Accessible",
  6: "Pool", 7: "Kitchen", 8: "Free Parking", 9: "Hot Tub", 10: "Washer",
  11: "Dryer", 12: "Breakfast", 13: "Gym", 14: "Indoor Fireplace", 15: "Buzzer",
  16: "Doorman", 17: "Hair Dryer", 18: "Heating", 19: "Laptop Friendly Workspace", 20: "Iron",
  21: "Family Friendly", 22: "Smoke Detector", 23: "Carbon Monoxide Detector", 24: "First Aid Kit",
  25: "Safety Card", 26: "Fire Extinguisher", 27: "Essentials", 28: "Shampoo", 29: "Hangers",
  30: "Lock on Bedroom Door", 31: "Elevator", 33: "Pets Allowed", 34: "Smoking Allowed",
  35: "Suitable for Events", 36: "Cable TV", 37: "Coffee Maker", 38: "Cooking Basics",
  39: "Dishes and Silverware", 40: "Dishwasher", 41: "Microwave", 42: "Refrigerator", 43: "Oven",
  44: "Stove", 45: "BBQ Grill", 46: "Patio or Balcony", 47: "Garden or Backyard",
  48: "Beach Essentials", 49: "Private Entrance", 50: "Bed Linens", 51: "Extra Pillows and Blankets",
  52: "Ethernet Connection", 53: "Luggage Dropoff Allowed", 54: "Long Term Stays Allowed",
  55: "Cleaning Before Checkout", 56: "Waterfront", 57: "Beachfront",
  58: "Ski In Ski Out", 59: "Self Check-in", 60: "Smart Lock", 61: "Lockbox",
};

// Extract bedroom count from listing, trying multiple HostAway field names and listingRooms
export function extractBedroomCount(listing: HostAwayListing): number {
  // Try direct fields first
  if (listing.bedrooms && listing.bedrooms > 0) return listing.bedrooms;
  if (listing.bedroomsNumber && listing.bedroomsNumber > 0) return listing.bedroomsNumber;
  if (listing.roomsNumber && listing.roomsNumber > 0) return listing.roomsNumber;
  // Try counting bedrooms from listingRooms array
  if (listing.listingRooms && Array.isArray(listing.listingRooms) && listing.listingRooms.length > 0) {
    const bedroomRooms = listing.listingRooms.filter((r) => {
      const type = (r.roomType || r.type || "").toString().toLowerCase();
      return type.includes("bedroom") || type.includes("bed room");
    });
    if (bedroomRooms.length > 0) return bedroomRooms.length;
  }
  return 0;
}

export function extractAmenityNames(listing: HostAwayListing): string[] {
  // Try listingAmenities (array of objects) first — this is the standard HostAway format
  if (listing.listingAmenities && Array.isArray(listing.listingAmenities) && listing.listingAmenities.length > 0) {
    return listing.listingAmenities.map((a) => {
      if (a.amenityName) return a.amenityName;
      if (a.name) return a.name;
      return AMENITY_ID_MAP[a.amenityId] || `Amenity ${a.amenityId}`;
    }).filter(Boolean);
  }
  // Fall back to amenities if it's already a string array
  if (listing.amenities && Array.isArray(listing.amenities) && listing.amenities.length > 0) {
    // Could be string[] or could be objects — handle both
    return listing.amenities.map((a: unknown) => {
      if (typeof a === "string") return a;
      if (typeof a === "object" && a !== null) {
        const obj = a as Record<string, unknown>;
        return (obj.amenityName || obj.name || AMENITY_ID_MAP[obj.amenityId as number] || "") as string;
      }
      return "";
    }).filter(Boolean);
  }
  return [];
}

export async function getListings(): Promise<HostAwayListing[]> {
  const token = await getAccessToken();

  const res = await fetch(`${HOSTAWAY_API_BASE}/listings?limit=100&includeResources=1`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    // Cache for 5 minutes on Vercel
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  if (data.status !== "success") {
    return [];
  }

  return data.result || [];
}

export async function getListing(id: number): Promise<HostAwayListing | null> {
  const token = await getAccessToken();

  const res = await fetch(`${HOSTAWAY_API_BASE}/listings/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  if (data.status !== "success") {
    return null;
  }
  return data.result;
}

export async function getReservations(params?: { status?: string; listingId?: string }): Promise<Record<string, unknown>[]> {
  const token = await getAccessToken();
  const qs = new URLSearchParams({ limit: "100", sortOrder: "desc" });
  if (params?.status) qs.set("status", params.status);
  if (params?.listingId) qs.set("listingMapId", params.listingId);
  const res = await fetch(`${HOSTAWAY_API_BASE}/reservations?${qs.toString()}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.status === "success" ? (data.result || []) : [];
}
