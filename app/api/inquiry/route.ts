import { NextResponse } from "next/server";
import crypto from "crypto";
import { redis } from "@/app/lib/redis";

const FB_PIXEL_ID = "1241092834855360";
const ALLOWED_TAGS = new Set(["carestay-waitlist", "homepage-signup", "email-popup", "listing-waitlist", "professional-stays", "healthcare", "corporate"]);
const ALLOWED_SOURCES = new Set(["healthcare", "corporate"]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

async function sendFacebookConversion(email: string, name: string) {
  const accessToken = process.env.FB_ACCESS_TOKEN;
  if (!accessToken) return;

  const hashedEmail = crypto.createHash("sha256").update(email.toLowerCase().trim()).digest("hex");
  const hashedName = name ? crypto.createHash("sha256").update(name.toLowerCase().trim()).digest("hex") : undefined;
  const eventData = {
    data: [{
      event_name: "Lead",
      event_time: Math.floor(Date.now() / 1000),
      event_id: `lead_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      action_source: "website",
      event_source_url: "https://www.carestaysuites.com",
      user_data: { em: [hashedEmail], ...(hashedName && { fn: [hashedName] }) },
    }],
    access_token: accessToken,
  };
  try {
    await fetch(`https://graph.facebook.com/v19.0/${FB_PIXEL_ID}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });
  } catch { /* Inquiry delivery should not fail when analytics is unavailable. */ }
}

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rateKey = `carestay:inquiry:${crypto.createHash("sha256").update(forwardedFor).digest("hex").slice(0, 24)}`;
    try {
      const attempts = await redis.incr(rateKey);
      if (attempts === 1) await redis.expire(rateKey, 600);
      if (attempts > 5) {
        return NextResponse.json({ status: "error", message: "Too many inquiries. Please try again shortly." }, { status: 429 });
      }
    } catch { /* Keep the inquiry path available if rate-limit storage is temporarily unavailable. */ }

    const body = await request.json();
    const name = cleanText(body.name, 100);
    const email = cleanText(body.email, 254).toLowerCase();
    const phone = cleanText(body.phone, 40);
    const hospital = cleanText(body.hospital, 140);
    const company = cleanText(body.company, 140);
    const moveIn = cleanText(body.moveIn, 40);
    const moveOut = cleanText(body.moveOut, 40);
    const message = cleanText(body.message, 3000);
    const listing = cleanText(body.listing, 200);
    const requestedSource = cleanText(body.source, 40);
    const source = ALLOWED_SOURCES.has(requestedSource) ? requestedSource : "";
    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ status: "error", message: "A valid email address is required." }, { status: 400 });
    }
    const requestedTags = Array.isArray(body.tags) ? body.tags.filter((tag: unknown): tag is string => typeof tag === "string" && ALLOWED_TAGS.has(tag)) : [];
    if (source === "healthcare") requestedTags.push("healthcare", "professional-stays");
    if (source === "corporate") requestedTags.push("corporate", "professional-stays");
    const tags = Array.from(new Set(requestedTags));

    const ghlWebhook = process.env.GHL_WEBHOOK_URL;
    if (!ghlWebhook) {
      return NextResponse.json({ status: "error", message: "Inquiry service is temporarily unavailable." }, { status: 503 });
    }
    const ghlResponse = await fetch(ghlWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        hospital,
        company,
        moveIn,
        moveOut,
        message,
        listing,
        tags,
        source: source ? `carestay-website-${source}` : "carestay-website",
      }),
    });
    if (!ghlResponse.ok) {
      return NextResponse.json({ status: "error", message: "Inquiry service is temporarily unavailable." }, { status: 502 });
    }

    // Send server-side Facebook Conversion
    if (email && process.env.FB_ACCESS_TOKEN) {
      await sendFacebookConversion(email, name);
    }

    return NextResponse.json({ status: "success" });
  } catch {
    return NextResponse.json({ status: "error", message: "Failed to submit inquiry" }, { status: 500 });
  }
}
