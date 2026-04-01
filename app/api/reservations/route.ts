import { NextResponse } from "next/server";
import { getReservations } from "@/app/lib/hostaway";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("password") !== "carestay2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const status = searchParams.get("status") || undefined;
    const listingId = searchParams.get("listingId") || undefined;
    const raw = await getReservations({ status, listingId });

    // Log FULL first reservation — every single key
    if (raw.length > 0) {
      console.log("=== HOSTAWAY FULL RESERVATION KEYS ===", Object.keys(raw[0]).join(", "));
      console.log("=== HOSTAWAY FULL RESERVATION ===", JSON.stringify(raw[0], null, 2));
    }

    const reservations = raw.map((r: Record<string, unknown>) => {
      const nights = Number(r.nights || r.numberOfNights || 0);

      // HostAway field exploration — try every known field name
      const totalPrice = Number(r.totalPrice || 0);
      const hostPayout = Number(r.hostPayout || r.expectedPayout || 0);
      const cleaningFee = Number(r.cleaningFee || 0);
      const hostServiceFee = Number(r.hostServiceFee || r.hostChannelFee || r.channelCommissionAmount || 0);
      const guestServiceFee = Number(r.guestServiceFee || 0);
      const discount = Math.abs(Number(r.discount || r.promotionDiscount || r.couponDiscount || 0));

      // basePrice in HostAway is often the room rate BEFORE cleaning and discount
      // totalPrice is often basePrice - discount + cleaningFee (what host receives before platform fee)
      const basePrice = Number(r.basePrice || 0);

      // If we have totalPrice but NOT a separate basePrice, totalPrice likely includes cleaning
      // In that case, room fee = totalPrice - cleaningFee
      const roomFee = basePrice > 0 ? basePrice : (totalPrice > 0 ? totalPrice - cleaningFee : 0);

      const pricePerNight = nights > 0 ? Math.round(roomFee / nights) : Number(r.pricePerNight || 0);

      // Collect ALL fields for raw debugging
      const rawFinance: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(r)) {
        if (v !== null && v !== undefined && v !== "" && v !== 0 && v !== "0" && v !== "0.00") {
          const kl = k.toLowerCase();
          if (kl.includes("price") || kl.includes("fee") || kl.includes("payout") || kl.includes("total") ||
              kl.includes("cost") || kl.includes("amount") || kl.includes("discount") || kl.includes("commission") ||
              kl.includes("revenue") || kl.includes("night") || kl.includes("payment") || kl.includes("money") ||
              kl.includes("finance") || kl.includes("earning") || kl.includes("pricing") || kl.includes("charge")) {
            rawFinance[k] = v;
          }
        }
      }
      // Also grab any nested objects that might contain pricing
      for (const nestedKey of ["finance", "money", "prices", "pricing", "financials", "reservationPricing", "listingMapPricings", "payments", "paymentSchedule"]) {
        if (r[nestedKey] && typeof r[nestedKey] === "object") {
          rawFinance[`_${nestedKey}`] = r[nestedKey];
        }
      }

      return {
        id: r.id,
        guestName: r.guestName || r.guestFirstName || "Unknown Guest",
        listingName: r.listingName || `Listing ${r.listingMapId || r.listingId}`,
        listingId: r.listingMapId || r.listingId,
        channelName: r.channelName || r.source || "Direct",
        checkIn: r.arrivalDate || r.checkInDate || "",
        checkOut: r.departureDate || r.checkOutDate || "",
        nights,
        totalPrice,
        roomFee,
        basePrice,
        hostPayout,
        cleaningFee,
        hostServiceFee,
        guestServiceFee,
        discount,
        pricePerNight,
        numberOfGuests: Number(r.numberOfGuests || r.adults || 1),
        status: r.status || "unknown",
        isConfirmed: r.isConfirmed,
        isPaid: r.isPaid,
        source: r.source,
        channelId: r.channelId,
        currency: r.currency || "CAD",
        rawFinance,
      };
    });

    // Log each reservation's status + guest for debugging
    console.log("=== ALL RESERVATIONS WITH STATUS ===");
    for (const r of reservations) {
      console.log(`  ${r.guestName} | ${r.listingName} | ${r.checkIn} → ${r.checkOut} | status: "${r.status}" | nights: ${r.nights} | payout: $${r.totalPrice}`);
    }

    // Filter out inquiries, cancelled, and other non-confirmed statuses
    // Only keep: new, confirmed, modified, pending, awaitingPayment
    const activeStatuses = new Set(["new", "confirmed", "modified", "pending", "awaitingPayment", "awaitingpayment"]);
    const activeReservations = reservations.filter(r => {
      const s = String(r.status).toLowerCase();
      return activeStatuses.has(s);
    });

    // Deduplicate: if same guest + same property + same check-in, keep the one with more nights (latest modification)
    const deduped: typeof activeReservations = [];
    const seen = new Map<string, number>();
    for (const r of activeReservations) {
      const key = `${r.guestName}-${String(r.listingId)}-${r.checkIn}`;
      const existingIdx = seen.get(key);
      if (existingIdx !== undefined) {
        // Keep the one with more nights (more recent modification)
        if (r.nights > deduped[existingIdx].nights) {
          deduped[existingIdx] = r;
        }
      } else {
        seen.set(key, deduped.length);
        deduped.push(r);
      }
    }

    // Log status distribution for debugging
    const statusCounts: Record<string, number> = {};
    for (const r of reservations) { statusCounts[r.status] = (statusCounts[r.status] || 0) + 1; }
    console.log("=== RESERVATION STATUS COUNTS ===", JSON.stringify(statusCounts));
    console.log(`=== FILTERED: ${reservations.length} total → ${activeReservations.length} active → ${deduped.length} deduped ===`);

    return NextResponse.json({ status: "success", reservations: deduped, count: deduped.length });
  } catch (e) {
    return NextResponse.json({ status: "error", message: e instanceof Error ? e.message : "Failed to fetch reservations" }, { status: 500 });
  }
}
