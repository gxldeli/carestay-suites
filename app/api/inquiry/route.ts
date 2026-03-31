import { NextResponse } from "next/server";
import crypto from "crypto";

const FB_PIXEL_ID = "1241092834855360";
const FB_ACCESS_TOKEN = "EAATiWAQZBD7MBREzVRvP4HpiHklupj4YQseq5cVBgU794txvfvnkvjz4DKK9mgAUDySab0ZAEuYEH0wpgTZBUYT6ZBpiZBv1Mjvk09hFHLSLgZBoCSA0D6dNRZBrL2FC6RsZClZCLsmsoS4GF9fN4v5mcjjMzHjl51QY66YuVl2zzy6SyG4tRYE6wQAgcDtnhewZDZD";

async function sendFacebookConversion(email: string, name: string) {
  const hashedEmail = crypto.createHash("sha256").update(email.toLowerCase().trim()).digest("hex");
  const hashedName = name ? crypto.createHash("sha256").update(name.toLowerCase().trim()).digest("hex") : undefined;
  const eventData = {
    data: [{
      event_name: "Lead",
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      user_data: { em: [hashedEmail], ...(hashedName && { fn: [hashedName] }) },
    }],
    access_token: FB_ACCESS_TOKEN,
  };
  try {
    await fetch(`https://graph.facebook.com/v19.0/${FB_PIXEL_ID}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });
  } catch {
    // silently fail — don't break the form submission
  }
}

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

    // Send server-side Facebook Conversion
    if (email) {
      sendFacebookConversion(email, name || "");
    }

    return NextResponse.json({ status: "success" });
  } catch {
    return NextResponse.json({ status: "error", message: "Failed to submit inquiry" }, { status: 500 });
  }
}
