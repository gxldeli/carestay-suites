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

    // Log FULL first reservation with every single field
    if (raw.length > 0) {
      const sample = raw[0];
      console.log("=== FULL HOSTAWAY RESERVATION OBJECT ===");
      console.log(JSON.stringify(sample, null, 2));
      // Also log just the keys and money-related values
      const moneyFields: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(sample)) {
        if (typeof v === "number" || (typeof v === "string" && /^\d+\.?\d*$/.test(v)) || k.toLowerCase().includes("price") || k.toLowerCase().includes("fee") || k.toLowerCase().includes("payout") || k.toLowerCase().includes("total") || k.toLowerCase().includes("cost") || k.toLowerCase().includes("amount") || k.toLowerCase().includes("discount") || k.toLowerCase().includes("commission") || k.toLowerCase().includes("revenue") || k.toLowerCase().includes("payment") || k.toLowerCase().includes("money") || k.toLowerCase().includes("finance")) {
          moneyFields[k] = v;
        }
      }
      console.log("=== MONEY-RELATED FIELDS ===", JSON.stringify(moneyFields, null, 2));
    }

    const reservations = raw.map((r: Record<string, unknown>) => {
      // Try every possible field name for financial data
      const fin = r.finance as Record<string, unknown> | undefined;
      const money = r.money as Record<string, unknown> | undefined;
      const prices = r.prices as Record<string, unknown> | undefined;

      const totalPrice = Number(r.totalPrice || fin?.totalPrice || money?.totalPrice || prices?.totalPrice || r.price || 0);
      const basePrice = Number(r.basePrice || fin?.basePrice || money?.basePrice || r.price || r.totalPrice || fin?.totalPrice || 0);
      const hostPayout = Number(r.hostPayout || r.expectedPayout || fin?.hostPayout || fin?.expectedPayout || money?.hostPayout || 0);
      const cleaningFee = Number(r.cleaningFee || fin?.cleaningFee || money?.cleaningFee || 0);
      const hostServiceFee = Number(r.hostServiceFee || r.hostChannelFee || r.channelCommissionAmount || fin?.hostServiceFee || 0);
      const guestServiceFee = Number(r.guestServiceFee || fin?.guestServiceFee || 0);
      const discount = Math.abs(Number(r.discount || r.promotionDiscount || r.couponDiscount || fin?.discount || 0));
      const nights = Number(r.nights || r.numberOfNights || 0);
      const pricePerNight = nights > 0 ? Math.round((basePrice || totalPrice) / nights) : Number(r.pricePerNight || 0);

      // Build rawFinance with every money-related field for debugging
      const rawFinance: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(r)) {
        if (k.toLowerCase().includes("price") || k.toLowerCase().includes("fee") || k.toLowerCase().includes("payout") || k.toLowerCase().includes("total") || k.toLowerCase().includes("cost") || k.toLowerCase().includes("amount") || k.toLowerCase().includes("discount") || k.toLowerCase().includes("commission") || k.toLowerCase().includes("revenue") || k.toLowerCase().includes("night")) {
          rawFinance[k] = v;
        }
      }
      if (fin) rawFinance._finance = fin;
      if (money) rawFinance._money = money;
      if (prices) rawFinance._prices = prices;

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
        basePrice,
        hostPayout,
        cleaningFee,
        hostServiceFee,
        guestServiceFee,
        discount,
        pricePerNight,
        numberOfGuests: Number(r.numberOfGuests || r.adults || 1),
        status: r.status || "unknown",
        currency: r.currency || "CAD",
        rawFinance,
      };
    });

    return NextResponse.json({ status: "success", reservations, count: reservations.length });
  } catch (e) {
    return NextResponse.json({ status: "error", message: e instanceof Error ? e.message : "Failed to fetch reservations" }, { status: 500 });
  }
}
