"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

const LISTINGS = [
  { id: 1, title: "The Pinnacle Suite", location: "Downtown Toronto", beds: 1, baths: 1, price: 2800, sqft: 580, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", tag: "Near UHN", available: true, desc: "A sleek studio in the heart of downtown Toronto, steps from University Health Network. Fully furnished with blackout blinds, high-speed Wi-Fi, and everything a healthcare professional needs." },
  { id: 2, title: "Lakeview Residence", location: "Harbourfront", beds: 2, baths: 1, price: 3600, sqft: 820, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80", tag: "Near St. Michael's", available: true, desc: "Spacious two-bedroom with stunning lake views. Walking distance to St. Michael's Hospital. In-suite laundry, full kitchen, and a dedicated workspace." },
  { id: 3, title: "Midtown Medical Suite", location: "Yonge & Eglinton", beds: 1, baths: 1, price: 2600, sqft: 540, img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80", tag: "Near Sunnybrook", available: false, desc: "Cozy midtown suite near Sunnybrook Health Sciences Centre. Quick TTC access, quiet neighbourhood, and move-in ready with all essentials." },
  { id: 4, title: "King West Luxury", location: "King West Village", beds: 2, baths: 2, price: 4100, sqft: 920, img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80", tag: "Near Toronto Western", available: true, desc: "Premium two-bed, two-bath in King West. Minutes from Toronto Western Hospital. Rooftop terrace access, gym, and concierge." },
  { id: 5, title: "Scarborough Heights", location: "Scarborough", beds: 2, baths: 1, price: 2800, sqft: 780, img: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80", tag: "Near Scarborough Health", available: true, desc: "Bright and spacious two-bedroom near Scarborough Health Network. Free parking included, quiet residential area, and fully equipped kitchen." },
  { id: 6, title: "North York Terrace", location: "North York", beds: 1, baths: 1, price: 2500, sqft: 520, img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80", tag: "Near North York General", available: true, desc: "Affordable one-bedroom near North York General Hospital. Direct subway access, on-site laundry, and a peaceful terrace." },
];

const CARESTAY_STANDARD = [
  { icon: "🕶", name: "Blue Light Glasses", desc: "3 pairs in different strengths" },
  { icon: "👕", name: "Spare Scrubs", desc: "S, M, L — always a backup ready" },
  { icon: "🦶", name: "Foot Massager", desc: "Shiatsu relief after 12hr shifts" },
  { icon: "🌙", name: "Blackout + White Noise", desc: "Day-sleep setup for nights" },
  { icon: "💆", name: "Massage Gun", desc: "Full body recovery tool" },
];

export default function ListingPage() {
  const params = useParams();
  const id = Number(params.id);
  const listing = LISTINGS.find((l) => l.id === id);

  if (!listing) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700 }}>Listing not found</h1>
        <Link href="/#listings" style={{ color: "#0fa", textDecoration: "none", fontWeight: 600 }}>Back to all suites</Link>
      </div>
    );
  }

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'DM Sans',system-ui,sans-serif;color:#fff;background:#0a0c0f;-webkit-font-smoothing:antialiased}
        .wrap{max-width:1200px;margin:0 auto;width:100%;padding:0 24px}
      `}</style>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,12,15,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <Link href="/" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: "#fff", textDecoration: "none" }}>
            CareStay<span style={{ color: "#0fa" }}>.</span>
          </Link>
          <Link href="/#listings" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
            All Suites
          </Link>
        </div>
      </nav>

      <main style={{ paddingTop: 64 }}>
        {/* Hero Image */}
        <div style={{ position: "relative", width: "100%", height: "clamp(300px, 50vh, 520px)", overflow: "hidden" }}>
          <img
            src={listing.img}
            alt={listing.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0a0c0f 0%, transparent 50%)" }} />
        </div>

        {/* Content */}
        <div className="wrap" style={{ marginTop: -80, position: "relative", zIndex: 2 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 40, alignItems: "start" }}>
            {/* Left — Details */}
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <span style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)", color: "#0fa", padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{listing.tag}</span>
                <span style={{ background: listing.available ? "rgba(0,255,170,0.15)" : "rgba(255,77,77,0.15)", color: listing.available ? "#0fa" : "#f66", padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                  {listing.available ? "Available" : "Waitlist"}
                </span>
              </div>

              <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, fontWeight: 700, lineHeight: 1.1, marginBottom: 8 }}>{listing.title}</h1>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", marginBottom: 32 }}>{listing.location}</p>

              <div style={{ display: "flex", gap: 24, marginBottom: 32, fontSize: 14, color: "rgba(255,255,255,0.6)" }}>
                <span>{listing.beds} Bed{listing.beds > 1 ? "s" : ""}</span>
                <span>{listing.baths} Bath{listing.baths > 1 ? "s" : ""}</span>
                <span>{listing.sqft} sqft</span>
              </div>

              <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.7)", marginBottom: 48 }}>{listing.desc}</p>

              {/* CareStay Standard */}
              <div style={{ marginBottom: 48 }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, marginBottom: 20 }}>The CareStay Standard</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {CARESTAY_STANDARD.map((item) => (
                    <div key={item.name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px 18px", display: "flex", gap: 14, alignItems: "center" }}>
                      <span style={{ fontSize: 24 }}>{item.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Booking Card */}
            <div style={{ position: "sticky", top: 88 }}>
              <div style={{ background: "#12151a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 28 }}>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 36, color: "#fff" }}>${listing.price.toLocaleString()}</span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", marginLeft: 6 }}>/mo</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Move-in</div>
                    <div style={{ fontSize: 14, color: "#fff" }}>Flexible</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Minimum Stay</div>
                    <div style={{ fontSize: 14, color: "#fff" }}>1 Month</div>
                  </div>
                </div>

                <a
                  href={`https://wa.me/16476091604?text=${encodeURIComponent(`Hi, I'm interested in ${listing.title} (${listing.location}). Is it still available?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "block", width: "100%", padding: "16px 0", background: "linear-gradient(135deg,#0fa,#0af)", color: "#0a0c0f", borderRadius: 10, fontWeight: 700, fontSize: 15, textAlign: "center", textDecoration: "none", marginBottom: 10 }}
                >
                  Inquire Now
                </a>
                <a
                  href="/#contact"
                  style={{ display: "block", width: "100%", padding: "16px 0", background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, fontWeight: 700, fontSize: 15, textAlign: "center", textDecoration: "none" }}
                >
                  Contact Us
                </a>

                <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(0,255,170,0.05)", borderRadius: 10, border: "1px solid rgba(0,255,170,0.1)" }}>
                  <div style={{ fontSize: 13, color: "#0fa", fontWeight: 600, marginBottom: 4 }}>Healthcare Rate</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>Special pricing available for nurses, doctors, and medical staff with valid credentials.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="wrap" style={{ padding: "60px 24px 80px" }}>
          <Link href="/#listings" style={{ color: "#0fa", fontSize: 14, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid rgba(0,255,170,0.3)", paddingBottom: 2 }}>
            Browse all suites
          </Link>
        </div>
      </main>
    </>
  );
}
