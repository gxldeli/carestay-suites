// HostAway API Client
// Credentials are stored in Vercel environment variables

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
    console.error("[HostAway] Missing credentials — HOSTAWAY_CLIENT_ID:", HOSTAWAY_CLIENT_ID ? "set" : "MISSING", "HOSTAWAY_CLIENT_SECRET:", HOSTAWAY_CLIENT_SECRET ? "set" : "MISSING");
    throw new Error("HostAway credentials not configured");
  }

  console.log("[HostAway] Requesting access token for client_id:", HOSTAWAY_CLIENT_ID);

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
    console.error(`[HostAway] Auth failed: ${res.status} ${res.statusText}`, body);
    throw new Error(`HostAway auth failed: ${res.status} — ${body}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    // Token lasts 24 months but we refresh every 23 hours just in case
    expires: Date.now() + 23 * 60 * 60 * 1000,
  };

  console.log("[HostAway] Access token obtained successfully");
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
  bathrooms: number;
  maxGuests: number;
  squareFeet: number;
  propertyTypeId: number;
  roomTypeId: number;
  bathroomType: string;
  thumbnailUrl: string;
  pictures: Array<{ url: string; caption: string }>;
  amenities: string[];
  price: number;
  currencyCode: string;
  isActive: number;
  tags: string[];
}

export async function getListings(): Promise<HostAwayListing[]> {
  const token = await getAccessToken();

  console.log("[HostAway] Fetching listings...");
  const res = await fetch(`${HOSTAWAY_API_BASE}/listings?limit=100&includeResources=1`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    // Cache for 5 minutes on Vercel
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`[HostAway] Listings fetch failed: ${res.status} ${res.statusText}`, body);
    return [];
  }

  const data = await res.json();
  
  if (data.status !== "success") {
    console.error("HostAway API error:", data.result);
    return [];
  }

  // Filter to only listings tagged with "carestay"
  // If no tag filter needed, remove this filter
  console.log("[HostAway] Raw listings count:", (data.result || []).length);
  if (data.result?.[0]) console.log("[HostAway] First listing:", JSON.stringify(data.result[0]).substring(0, 500));
  const listings = data.result || [];

  return listings;
}

export async function getListing(id: number): Promise<HostAwayListing | null> {
  const token = await getAccessToken();

  console.log(`[HostAway] Fetching listing ${id}...`);
  const res = await fetch(`${HOSTAWAY_API_BASE}/listings/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`[HostAway] Listing ${id} fetch failed: ${res.status} ${res.statusText}`, body);
    return null;
  }
  const data = await res.json();
  if (data.status !== "success") {
    console.error(`[HostAway] Listing ${id} API error:`, data);
    return null;
  }
  return data.result;
}

export async function getListingCalendar(
  listingId: number,
  startDate: string,
  endDate: string
) {
  const token = await getAccessToken();

  const res = await fetch(
    `${HOSTAWAY_API_BASE}/listings/${listingId}/calendar?startDate=${startDate}&endDate=${endDate}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) return [];
  const data = await res.json();
  if (data.status !== "success") return [];
  return data.result || [];
}

export async function getListingPricing(listingId: number) {
  const token = await getAccessToken();

  const res = await fetch(
    `${HOSTAWAY_API_BASE}/listings/${listingId}/pricingPeriods`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) return null;
  const data = await res.json();
  if (data.status !== "success") return null;
  return data.result;
}
