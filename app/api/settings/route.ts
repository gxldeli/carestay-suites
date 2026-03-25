import { NextResponse } from "next/server";
import { redis } from "@/app/lib/redis";

export interface SiteSettings {
  contactEmail: string;
  heroTagline: string;
  statProperties: string;
  statHealthcarePros: string;
  statHospitalPartnerships: string;
  statAverageRating: string;
}

const DEFAULTS: SiteSettings = {
  contactEmail: "info@carestaysuites.com",
  heroTagline: "Move-in ready suites primarily across the Greater Toronto Area and beyond. Verified properties. No scams, no deposits lost, no bait-and-switch. Trusted by nurses, physicians, and medical staff.",
  statProperties: "60+",
  statHealthcarePros: "150+",
  statHospitalPartnerships: "30+",
  statAverageRating: "4.9",
};

export async function GET() {
  try {
    const settings = await redis.get<SiteSettings>("admin:siteSettings");
    return NextResponse.json({ status: "success", settings: { ...DEFAULTS, ...settings } });
  } catch {
    return NextResponse.json({ status: "success", settings: DEFAULTS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.password !== "carestay2026") {
      return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }
    const current = await redis.get<SiteSettings>("admin:siteSettings") || {};
    const updated = { ...DEFAULTS, ...current, ...body.settings };
    delete (updated as Record<string, unknown>).password;
    await redis.set("admin:siteSettings", updated);
    return NextResponse.json({ status: "success", settings: updated });
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Failed to save" }, { status: 500 });
  }
}
