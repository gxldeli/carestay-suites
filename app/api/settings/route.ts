import { NextResponse } from "next/server";
import { redis } from "@/app/lib/redis";
import { isAdminRequestAuthorized } from "@/app/lib/admin-auth";

export interface SiteSettings {
  contactEmail: string;
  companyAddress: string;
  heroTagline: string;
  statProperties: string;
  statHealthcarePros: string;
  statHospitalPartnerships: string;
  statAverageRating: string;
  bannerEnabled: boolean;
  bannerText: string;
  bannerButtonText: string;
  bannerLinkUrl: string;
}

const DEFAULTS: SiteSettings = {
  contactEmail: "info@carestaysuites.com",
  companyAddress: "35 Mariner Terrace, Toronto, ON M5V 3V9",
  heroTagline: "Comfortable, fully equipped suites with flexible stays, easy self check-in, and responsive local support from arrival to departure.",
  statProperties: "60+",
  statHealthcarePros: "150+",
  statHospitalPartnerships: "30+",
  statAverageRating: "4.9",
  bannerEnabled: true,
  bannerText: "New furnished suites are added regularly",
  bannerButtonText: "Join",
  bannerLinkUrl: "/#contact",
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
  if (!await isAdminRequestAuthorized(request)) {
    return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const current = await redis.get<SiteSettings>("admin:siteSettings") || {};
    const updated = { ...DEFAULTS, ...current, ...body.settings };
    await redis.set("admin:siteSettings", updated);
    return NextResponse.json({ status: "success", settings: updated });
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Failed to save" }, { status: 500 });
  }
}
