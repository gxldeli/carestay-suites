import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, hospital, moveIn, moveOut, message, listing, tags } = body;

    // Forward to GHL (Go High Level) webhook if configured
    const ghlWebhook = process.env.GHL_WEBHOOK_URL;
    if (ghlWebhook) {
      await fetch(ghlWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "",
          email: email || "",
          phone: phone || "",
          hospital: hospital || "",
          moveIn: moveIn || "",
          moveOut: moveOut || "",
          message: message || "",
          listing: listing || "",
          tags: tags || [],
          source: "carestay-website",
        }),
      });
    }

    return NextResponse.json({ status: "success" });
  } catch {
    return NextResponse.json({ status: "error", message: "Failed to submit inquiry" }, { status: 500 });
  }
}
