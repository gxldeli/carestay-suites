import { NextResponse } from "next/server";
import { redis } from "@/app/lib/redis";

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
}

interface OverridesData {
  listings: Record<string, unknown>;
  customListings: CustomListing[];
  reviews?: Record<string, unknown>;
}

function bedDetails(beds: number): string {
  if (beds === 0) return "Queen bed in an open-concept studio layout";
  if (beds === 1) return "Queen bed with premium linens";
  if (beds === 2) return "Queen bed in the primary bedroom, double bed in the second";
  return `King bed in the primary suite, queen and double beds in the additional ${beds - 1} bedrooms`;
}

function generateDescription(cl: CustomListing): string {
  const bedsLabel = cl.beds === 0 ? "studio" : `${cl.beds}-bedroom`;
  const lines: string[] = [];

  lines.push(`Welcome to ${cl.title} — a fully furnished ${bedsLabel} suite in ${cl.location}, ${cl.hospitalDistance || "minutes"} from ${cl.nearbyHospital || "major hospitals"}. Designed for healthcare professionals on 30+ day assignments.`);
  lines.push("");
  lines.push("The space");
  lines.push(`${bedDetails(cl.beds)}. Clean, well-maintained, and professionally managed between every guest.`);
  lines.push("");
  lines.push("Full kitchen for meal prep between shifts — no more $30/day Uber Eats.");
  lines.push("In-unit washer and dryer — your scrubs are clean without a midnight laundromat run.");
  lines.push("Dedicated workspace for charting and documentation.");
  lines.push("High-speed WiFi throughout.");
  lines.push("Smart TV with streaming for your days off.");
  if (cl.soakingTub) lines.push("Deep soaking tub for post-shift recovery.");
  if (cl.beds === 0) lines.push("Cozy studio layout perfect for solo assignments.");
  lines.push("");
  lines.push("The CareStay Standard");
  lines.push("Every suite comes with: blue light blocking glasses, spare scrubs (S/M/L), shiatsu foot massager, blackout curtains, white noise machine, and a massage gun. Waiting for you on arrival.");
  lines.push("");
  lines.push("Things to know");
  lines.push("- Month-to-month — no lease trap if your contract changes");
  lines.push("- All-in pricing — the number you see is the number you pay");
  lines.push("- Video walkthrough available before you commit");
  lines.push("- Non-smoking property");
  lines.push("- Quiet hours 10pm-8am");

  return lines.join("\n");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("password");

  if (password !== "carestay2026") {
    return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await redis.get<OverridesData>("admin:overrides");
    if (!data || !data.customListings?.length) {
      return NextResponse.json({ status: "success", message: "No custom listings found", updated: [] });
    }

    const updated: string[] = [];

    for (const cl of data.customListings) {
      if (!cl.description || cl.description.length < 200) {
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
