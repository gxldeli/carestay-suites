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

    const reservations = raw.map((r: Record<string, unknown>) => ({
      id: r.id,
      guestName: r.guestName || r.guestFirstName || "Unknown Guest",
      listingName: r.listingName || `Listing ${r.listingMapId || r.listingId}`,
      listingId: r.listingMapId || r.listingId,
      channelName: r.channelName || r.source || "Direct",
      checkIn: r.arrivalDate || r.checkInDate || "",
      checkOut: r.departureDate || r.checkOutDate || "",
      totalPrice: Number(r.totalPrice || r.hostPayout || 0),
      basePrice: Number(r.basePrice || r.price || 0),
      cleaningFee: Number(r.cleaningFee || 0),
      channelCommission: Number(r.channelCommissionAmount || r.commission || 0),
      numberOfGuests: Number(r.numberOfGuests || r.adults || 1),
      status: r.status || "unknown",
      currency: r.currency || "CAD",
    }));

    return NextResponse.json({ status: "success", reservations, count: reservations.length });
  } catch (e) {
    return NextResponse.json({ status: "error", message: e instanceof Error ? e.message : "Failed to fetch reservations" }, { status: 500 });
  }
}
