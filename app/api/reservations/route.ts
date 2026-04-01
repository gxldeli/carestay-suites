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

    // Log full first reservation object to see all available fields
    if (raw.length > 0) {
      console.log("HOSTAWAY RESERVATION SAMPLE (all fields):", JSON.stringify(raw[0], null, 2));
    }

    const reservations = raw.map((r: Record<string, unknown>) => {
      const nights = Number(r.nights || 0);
      const totalPrice = Number(r.totalPrice || 0);
      const basePrice = Number(r.basePrice || r.price || 0);
      const hostPayout = Number(r.hostPayout || 0);
      const cleaningFee = Number(r.cleaningFee || 0);
      const hostServiceFee = Number(r.hostServiceFee || r.hostChannelFee || 0);
      const guestServiceFee = Number(r.guestServiceFee || 0);
      const discount = Number(r.discount || r.promotionDiscount || r.couponDiscount || 0);
      const channelCommission = Number(r.channelCommissionAmount || r.commission || 0);
      const pricePerNight = nights > 0 ? Math.round(basePrice / nights) : Number(r.pricePerNight || 0);

      return {
        id: r.id,
        guestName: r.guestName || r.guestFirstName || "Unknown Guest",
        guestEmail: r.guestEmail || "",
        guestPhone: r.guestPhone || "",
        listingName: r.listingName || `Listing ${r.listingMapId || r.listingId}`,
        listingId: r.listingMapId || r.listingId,
        channelName: r.channelName || r.source || "Direct",
        channelId: r.channelId,
        checkIn: r.arrivalDate || r.checkInDate || "",
        checkOut: r.departureDate || r.checkOutDate || "",
        nights,
        totalPrice,
        basePrice,
        hostPayout,
        cleaningFee,
        hostServiceFee,
        guestServiceFee,
        discount: Math.abs(discount),
        channelCommission,
        pricePerNight,
        numberOfGuests: Number(r.numberOfGuests || r.adults || 1),
        status: r.status || "unknown",
        currency: r.currency || "CAD",
        // Pass through any monthly payment data if available
        payments: r.payments || r.paymentSchedule || null,
      };
    });

    return NextResponse.json({ status: "success", reservations, count: reservations.length });
  } catch (e) {
    return NextResponse.json({ status: "error", message: e instanceof Error ? e.message : "Failed to fetch reservations" }, { status: 500 });
  }
}
