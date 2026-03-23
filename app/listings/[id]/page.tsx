"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const FALLBACK_LISTINGS = [
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

function Nav({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(10,12,15,0.95)" : "rgba(10,12,15,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", transition: "all 0.4s" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 72 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#0fa,#0af)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#0a0c0f" }}>CS</div>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 20, color: "#fff" }}>CareStay <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.6)" }}>Suites</span></span>
        </Link>
        <div className="nav-links">
          {[{ l: "Listings", h: "/#listings" }, { l: "Healthcare", h: "/#healthcare" }, { l: "About", h: "/about" }, { l: "Contact", h: "/#contact" }].map(i => <a key={i.l} href={i.h} className="nav-link">{i.l}</a>)}
          <a href="/#contact" className="nav-cta">Inquire Now</a>
        </div>
        <button className="nav-mobile" onClick={() => setOpen(!open)} style={{ background: "none", border: "none", fontSize: 28, color: "#fff", cursor: "pointer" }}>{open ? "\u2715" : "\u2630"}</button>
      </div>
      {open && (
        <div style={{ background: "rgba(10,12,15,0.98)", padding: "16px 24px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {[{ l: "Listings", h: "/#listings" }, { l: "Healthcare", h: "/#healthcare" }, { l: "About", h: "/about" }, { l: "Contact", h: "/#contact" }].map(i => <a key={i.l} href={i.h} onClick={() => setOpen(false)} style={{ display: "block", color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 17, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{i.l}</a>)}
          <a href="/#contact" onClick={() => setOpen(false)} style={{ display: "block", background: "linear-gradient(135deg,#0fa,#0af)", color: "#0a0c0f", textAlign: "center", padding: 16, borderRadius: 10, fontWeight: 700, fontSize: 16, marginTop: 16, textDecoration: "none" }}>Inquire Now</a>
        </div>
      )}
    </nav>
  );
}

interface ListingData { id: number | string; title: string; location: string; beds: number; baths: number; price: number; sqft: number; img: string; tag: string; available: boolean; desc: string; description?: string; images?: string[] }

export default function ListingPage() {
  const params = useParams();
  const rawId = params.id as string;
  const numericId = Number(rawId);
  const fallback = FALLBACK_LISTINGS.find((l) => l.id === numericId);
  const [listing, setListing] = useState<ListingData | null>(fallback || null);
  const [loading, setLoading] = useState(!fallback);
  const [scrolled, setScrolled] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedImg, setSelectedImg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [moveIn, setMoveIn] = useState("");
  const [duration, setDuration] = useState("");
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    fetch(`/api/listings`)
      .then(r => r.json())
      .then(data => {
        if (data.status === "success" && data.listings) {
          const match = data.listings.find((l: { id: number | string }) => String(l.id) === rawId);
          if (match) {
            setListing({
              id: match.id, title: match.title, location: match.location, beds: match.beds, baths: match.baths,
              price: match.price, sqft: match.sqft, img: match.images?.[0] || match.img, tag: match.location || "GTA",
              available: true, desc: match.description || "", description: match.description, images: match.images,
            });
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [rawId]);
  const handleSubmit = async () => {
    await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, phone, moveIn, duration, listing: listing?.title }) });
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>Loading...</div>
      </div>
    );
  }

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
        .nav-links{display:flex;align-items:center;gap:28px}
        .nav-mobile{display:none}
        .nav-link{color:rgba(255,255,255,0.7);text-decoration:none;font-size:14px;font-weight:500}
        .nav-link:hover{color:#fff}
        .nav-cta{background:linear-gradient(135deg,#0fa,#0af);color:#0a0c0f;padding:10px 22px;border-radius:8px;font-weight:700;font-size:13px;text-decoration:none}
        @media(max-width:768px){
          .nav-links{display:none!important}
          .nav-mobile{display:block!important}
        }
      `}</style>

      <Nav scrolled={scrolled} />

      <main style={{ paddingTop: 72 }}>
        {/* Hero Image */}
        <div style={{ position: "relative", width: "100%", height: "clamp(300px, 50vh, 520px)", overflow: "hidden" }}>
          <img
            src={selectedImg || listing.img}
            alt={listing.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0a0c0f 0%, transparent 50%)" }} />
        </div>

        {/* Image Gallery Strip */}
        {listing.images && listing.images.length > 1 && (
          <div className="wrap" style={{ marginTop: -40, position: "relative", zIndex: 3, marginBottom: -40 }}>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}>
              {listing.images.slice(0, 8).map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(imgUrl)}
                  style={{ flexShrink: 0, width: 80, height: 56, borderRadius: 8, overflow: "hidden", border: (selectedImg || listing.img) === imgUrl ? "2px solid #0fa" : "2px solid transparent", cursor: "pointer", padding: 0, background: "none" }}
                >
                  <img src={imgUrl} alt={`${listing.title} ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </button>
              ))}
            </div>
          </div>
        )}

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

              <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.7)", marginBottom: 48 }}>{listing.desc || listing.description || ""}</p>

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

                {!submitted ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Full Name</div>
                      <input type="text" placeholder="Jane Smith" value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "13px 16px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</div>
                      <input type="email" placeholder="jane@hospital.ca" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "13px 16px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Phone</div>
                      <input type="tel" placeholder="(647) 000-0000" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "13px 16px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Move-in Date</div>
                      <input type="text" placeholder="e.g., April 15" value={moveIn} onChange={e => setMoveIn(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "13px 16px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Duration</div>
                      <input type="text" placeholder="e.g., 3 months" value={duration} onChange={e => setDuration(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "13px 16px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                    </div>
                    <button onClick={handleSubmit} style={{ width: "100%", padding: "16px 0", background: "linear-gradient(135deg,#0fa,#0af)", color: "#0a0c0f", borderRadius: 10, fontWeight: 700, fontSize: 15, textAlign: "center", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                      Submit Inquiry
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "24px 0", marginBottom: 20 }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>✓</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Inquiry Sent</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>We&apos;ll be in touch within 24 hours.</div>
                  </div>
                )}

                <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(0,255,170,0.05)", borderRadius: 10, border: "1px solid rgba(0,255,170,0.1)" }}>
                  <div style={{ fontSize: 13, color: "#0fa", fontWeight: 600, marginBottom: 4 }}>Healthcare Rate</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>Special pricing available for nurses, doctors, and medical staff with valid credentials.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="wrap" style={{ padding: "60px 24px 40px" }}>
          <Link href="/#listings" style={{ color: "#0fa", fontSize: 14, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid rgba(0,255,170,0.3)", paddingBottom: 2 }}>
            Browse all suites
          </Link>
        </div>

        {/* Feedback Section */}
        <section style={{ background: "#0d1117", padding: "60px 24px", textAlign: "center" }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Designed For You. Shaped By You.</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 20 }}>We&apos;re always improving CareStay based on feedback from healthcare professionals like you.</p>
            <a href="mailto:feedback@carestaysuites.com" style={{ color: "#0fa", fontSize: 14, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid rgba(0,255,170,0.3)", paddingBottom: 2 }}>Send us feedback →</a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: "#0a0c0f", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "48px 24px 32px" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
            <div style={{ maxWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#0fa,#0af)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#0a0c0f" }}>CS</div>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>CareStay Suites</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>Premium furnished housing for healthcare professionals across the Greater Toronto Area.</p>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Quick Links</div>
              {[{ label: "Browse Suites", href: "/#listings" }, { label: "Healthcare", href: "/#healthcare" }, { label: "How It Works", href: "/#about" }, { label: "Contact", href: "/#contact" }].map(l => (
                <a key={l.label} href={l.href} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none", marginBottom: 8 }}>{l.label}</a>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Contact</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>info@carestaysuites.com</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>(647) 499-3889</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Toronto, Ontario</p>
            </div>
          </div>
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>© 2026 CareStay Suites. All rights reserved.</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Operated by BookedHosts</span>
          </div>
        </div>
      </footer>
    </>
  );
}
