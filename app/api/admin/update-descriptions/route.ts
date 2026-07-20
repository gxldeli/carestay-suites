import { NextResponse } from "next/server";
import { redis } from "@/app/lib/redis";
import { buildProfessionalListingDescription } from "@/app/lib/public-listing-copy";
import { isAdminRequestAuthorized } from "@/app/lib/admin-auth";

interface CustomListing {
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
  sortOrder?: number;
  featured?: boolean;
  videoUrl?: string;
  hidden?: boolean;
}

interface OverridesData {
  listings: Record<string, unknown>;
  customListings: CustomListing[];
  reviews?: Record<string, unknown>;
}

function generateDescription(cl: CustomListing): string {
  return buildProfessionalListingDescription(cl);
}

export async function GET(request: Request) {
  if (!await isAdminRequestAuthorized(request)) {
    return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const force = searchParams.get("force") !== "false";

  try {
    const data = await redis.get<OverridesData>("admin:overrides");
    if (!data || !data.customListings?.length) {
      return NextResponse.json({ status: "success", message: "No custom listings found", updated: [] });
    }

    const updated: string[] = [];

    for (const cl of data.customListings) {
      if (force || !cl.description || cl.description.length < 200) {
        cl.description = generateDescription(cl);
        updated.push(cl.title);
      }
    }

    if (updated.length > 0) {
      await redis.set("admin:overrides", data);
    }

    return NextResponse.json({
      status: "success",
      message: `Updated ${updated.length} of ${data.customListings.length} listings`,
      updated,
      skipped: data.customListings.filter(cl => !updated.includes(cl.title)).map(cl => cl.title),
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Failed to update descriptions" },
      { status: 500 }
    );
  }
}
