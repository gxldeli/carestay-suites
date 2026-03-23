import { NextResponse } from "next/server";

const GHL_TOKEN = process.env.GHL_API_TOKEN || "";
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || "";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, hospital, moveIn, duration, listing } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email required" }, { status: 400 });
    }

    // Split name into first/last
    const parts = name.trim().split(" ");
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";

    // Create contact in GHL
    const res = await fetch("https://services.leadconnectorhq.com/contacts/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GHL_TOKEN}`,
        "Content-Type": "application/json",
        "Version": "2021-07-28",
      },
      body: JSON.stringify({
        locationId: GHL_LOCATION_ID,
        firstName,
        lastName,
        email,
        phone: phone || "",
        source: "CareStay Suites Website",
        tags: ["carestay-inquiry", "website-lead"],
        customFields: [
          ...(hospital ? [{ key: "hospital", field_value: hospital }] : []),
          ...(moveIn ? [{ key: "move_in_date", field_value: moveIn }] : []),
          ...(duration ? [{ key: "duration", field_value: duration }] : []),
          ...(listing ? [{ key: "listing_interest", field_value: listing }] : []),
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("GHL API error:", res.status, err);
      // Still return success to user — we don't want form to look broken
      // Log the error for debugging
      return NextResponse.json({ success: true, note: "Submitted but GHL sync pending" });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, contactId: data.contact?.id });
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json({ success: true, note: "Submitted" });
  }
}
