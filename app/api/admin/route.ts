import { NextResponse } from "next/server";

/* ─── In-memory overrides store (will upgrade to Vercel KV later) ─── */

export interface ListingOverride {
  priceOverride?: number;
  hidden?: boolean;
  soakingTub?: boolean;
  carestayStandard?: boolean;
  titleOverride?: string;
  descriptionOverride?: string;
  nearbyHospital?: string;
  hospitalDistance?: string;
}

export interface CustomListing {
  id: string;
  title: string;
  location: string;
  beds: number;
  baths: number;
  price: number;
  sqft: number;
  img: string;
  images: string[];
  description: string;
  nearbyHospital: string;
  hospitalDistance: string;
  soakingTub: boolean;
  carestayStandard: boolean;
}

interface OverridesData {
  listings: Record<string, ListingOverride>;
  customListings: CustomListing[];
}

// Global in-memory store — persists across requests within the same serverless instance
const globalStore = globalThis as unknown as { __adminOverrides?: OverridesData };
if (!globalStore.__adminOverrides) {
  globalStore.__adminOverrides = { listings: {}, customListings: [] };
}

function getOverrides(): OverridesData {
  return globalStore.__adminOverrides!;
}

function setOverrides(data: OverridesData) {
  globalStore.__adminOverrides = data;
}

export async function GET() {
  return NextResponse.json({ status: "success", data: getOverrides() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, action, payload } = body;

    if (password !== "carestay2026") {
      return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    const overrides = getOverrides();

    if (action === "updateListing") {
      const { id, ...fields } = payload as { id: string } & ListingOverride;
      overrides.listings[id] = { ...overrides.listings[id], ...fields };
      console.log("[Admin API] Updated listing", id, "fields:", fields, "result:", overrides.listings[id]);
    } else if (action === "addCustomListing") {
      const listing = payload as Omit<CustomListing, "id">;
      const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      overrides.customListings.push({ ...listing, id });
    } else if (action === "deleteCustomListing") {
      const { id } = payload as { id: string };
      overrides.customListings = overrides.customListings.filter((l) => l.id !== id);
    } else if (action === "updateCustomListing") {
      const { id, ...fields } = payload as { id: string } & Partial<CustomListing>;
      const idx = overrides.customListings.findIndex((l) => l.id === id);
      if (idx !== -1) overrides.customListings[idx] = { ...overrides.customListings[idx], ...fields };
    } else {
      return NextResponse.json({ status: "error", message: "Unknown action" }, { status: 400 });
    }

    setOverrides(overrides);
    return NextResponse.json({ status: "success", data: overrides });
  } catch (error) {
    console.error("[Admin API] Error:", error);
    return NextResponse.json({ status: "error", message: "Server error" }, { status: 500 });
  }
}
