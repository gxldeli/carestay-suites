"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

/* ─── STATIC LISTINGS (will be replaced by API) ─── */
const LISTINGS: Record<string, {
  title: string; location: string; neighborhood: string;
  beds: number; baths: number; price: number; sqft: number;
  images: string[]; nearbyHospital: string; hospitalDistance: string;
  available: boolean; description: string;
  amenities: string[];
}> = {
  "1": { title: "The Pinnacle Suite", location: "Downtown Toronto", neighborhood: "Discovery District", beds: 1, baths: 1, price: 2800, sqft: 580, images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80","https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80"], nearbyHospital: "Toronto General Hospital", hospitalDistance: "8 min drive", available: true, description: "Modern 1-bedroom in the heart of downtown, steps from the PATH system. Floor-to-ceiling windows with city views. Perfect for medical professionals at UHN.", amenities: ["WiFi","Parking","In-Unit Laundry","Gym","Concierge","Smart Lock","Full Kitchen","Smart TV"] },
  "2": { title: "Lakeview Residence", location: "Harbourfront", neighborhood: "CityPlace", beds: 2, baths: 1, price: 3600, sqft: 820, images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80"], nearbyHospital: "St. Michael's Hospital", hospitalDistance: "12 min drive", available: true, description: "Spacious 2-bedroom with stunning lake views. Open concept living with premium finishes. Easy TTC access to all downtown hospitals.", amenities: ["WiFi","Parking","In-Unit Laundry","Pool","Lake View","Smart Lock","Full Kitchen","Smart TV"] },
  "3": { title: "Midtown Medical Suite", location: "Yonge & Eglinton", neighborhood: "Midtown", beds: 1, baths: 1, price: 2600, sqft: 540, images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80","https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80"], nearbyHospital: "Sunnybrook Hospital", hospitalDistance: "15 min drive", available: false, description: "Bright 1-bedroom in the midtown core. Walking distance to Yonge-Eglinton Centre. Quick commute to Sunnybrook via Bayview.", amenities: ["WiFi","Parking","In-Unit Laundry","Rooftop","Gym","Smart Lock","Full Kitchen"] },
  "4": { title: "King West Luxury", location: "King West Village", neighborhood: "King West", beds: 2, baths: 2, price: 4100, sqft: 920, images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80","https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80"], nearbyHospital: "Toronto Western Hospital", hospitalDistance: "10 min drive", available: true, description: "Premium 2-bed/2-bath in one of Toronto's most desirable neighborhoods. High-end finishes throughout. Minutes from UHN's Toronto Western campus.", amenities: ["WiFi","Parking","In-Unit Laundry","Gym","Rooftop","Concierge","Smart Lock","Full Kitchen","Smart TV","Soaking Tub"] },
  "5": { title: "Scarborough Heights", location: "Scarborough", neighborhood: "Scarborough Town Centre", beds: 2, baths: 1, price: 2800, sqft: 780, images: ["https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1200&q=80","https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80"], nearbyHospital: "Scarborough Health Network", hospitalDistance: "7 min drive", available: true, description: "Affordable 2-bedroom close to Scarborough Health Network. Quiet residential area with easy highway access. Great value for longer stays.", amenities: ["WiFi","Parking","In-Unit Laundry","Balcony","Full Kitchen","Soaking Tub"] },
  "6": { title: "North York Terrace", location: "North York", neighborhood: "Yonge & Sheppard", beds: 1, baths: 1, price: 2500, sqft: 520, images: ["https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80","https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1200&q=80"], nearbyHospital: "North York General Hospital", hospitalDistance: "10 min drive", available: true, description: "Modern 1-bedroom steps from Sheppard-Yonge subway. Quick access to North York General. Building has gym, party room, and rooftop terrace.", amenities: ["WiFi","Parking","In-Unit Laundry","Gym","Subway Access","Smart Lock","Full Kitchen"] },
};

const CARESTAY_STANDARD = [
  { icon: "🕶", name: "Blue Light Glasses" },
  { icon: "👕", name: "Spare Scrubs (S/M/L)" },
  { icon: "🦶", name: "Foot Massager" },
  { icon: "🌙", name: "Blackout + White Noise" },
  { icon: "💆", name: "Massage Gun" },
];

/* ─── STYLES ─── */
function Styles() {
  return <style>{`
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'DM Sans',system-ui,sans-serif;color:#fff;background:#0a0c0f}
    .detail-wrap{max-width:1000px;margin:0 auto;padding:100px 24px 60px}
    .back-link{color:rgba(255,255,255,0.5);text-decoration:none;font-size:14px;display:inline-flex;align-items:center;gap:6px;margin-bottom:24px}
    .back-link:hover{color:#0fa}
    .gallery{display:grid;grid-template-columns:2fr 1fr;gap:8px;border-radius:16px;overflow:hidden;margin-bottom:32px}
    .gallery-main{width:100%;height:400px;object-fit:cover;display:block}
    .gallery-side{display:flex;flex-direction:column;gap:8px}
    .gallery-side img{width:100%;height:196px;object-fit:cover;display:block}
    .detail-grid{display:grid;grid-template-columns:1.4fr 1fr;gap:40px;align-items:start}
    .detail-left h1{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:700;margin-bottom:8px}
    .detail-loc{font-size:15px;color:rgba(255,255,255,0.5);margin-bottom:20px}
    .detail-specs{display:flex;gap:20px;margin-bottom:24px;flex-wrap:wrap}
    .detail-spec{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px 18px;text-align:center}
    .detail-spec-num{font-size:18px;font-weight:700;color:#fff}
    .detail-spec-label{font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.04em;margin-top:2px}
    .detail-desc{font-size:15px;color:rgba(255,255,255,0.6);line-height:1.7;margin-bottom:28px}
    .detail-section-title{font-size:14px;font-weight:700;color:#0fa;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:14px}
    .amenities-grid{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px}
    .amenity-tag{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:8px 14px;font-size:13px;color:rgba(255,255,255,0.7)}
    .standard-row{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:28px}
    .standard-chip{background:rgba(0,255,170,0.06);border:1px solid rgba(0,255,170,0.15);border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:8px;font-size:13px;color:#0fa;font-weight:600}
    .hospital-badge{background:rgba(0,170,255,0.08);border:1px solid rgba(0,170,255,0.15);border-radius:12px;padding:16px 20px;display:flex;align-items:center;gap:14px;margin-bottom:28px}
    .hospital-icon{width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,#0fa,#0af);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
    .hospital-name{font-size:15px;font-weight:700;color:#fff}
    .hospital-dist{font-size:13px;color:rgba(255,255,255,0.5)}
    .sidebar{position:sticky;top:100px}
    .sidebar-card{background:#12151a;border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:28px 24px}
    .sidebar-price{font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:700;color:#fff}
    .sidebar-mo{font-size:16px;color:rgba(255,255,255,0.4);margin-left:4px}
    .sidebar-note{font-size:12px;color:rgba(255,255,255,0.35);margin-top:4px;margin-bottom:20px}
    .sidebar-input{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px 14px;color:#fff;font-size:14px;outline:none;font-family:inherit;margin-bottom:10px}
    .sidebar-input:focus{border-color:rgba(0,255,170,0.4)}
    .sidebar-label{display:block;font-size:11px;font-weight:600;color:rgba(255,255,255,0.45);margin-bottom:5px;text-transform:uppercase;letter-spacing:0.04em}
    .sidebar-btn{width:100%;background:linear-gradient(135deg,#0fa,#0af);color:#0a0c0f;padding:15px;border-radius:10px;font-weight:800;font-size:15px;border:none;cursor:pointer;font-family:inherit;margin-top:6px}
    .sidebar-fine{font-size:11px;color:rgba(255,255,255,0.25);text-align:center;margin-top:10px}
    .avail-badge{display:inline-block;padding:6px 14px;border-radius:8px;font-size:12px;font-weight:700;margin-bottom:16px}
    .avail-yes{background:rgba(0,255,170,0.12);color:#0fa}
    .avail-no{background:rgba(255,77,77,0.12);color:#f66}
    .tub-badge{background:rgba(0,255,170,0.06);border:1px solid rgba(0,255,170,0.12);border-radius:8px;padding:8px 14px;font-size:13px;color:#0fa;font-weight:600;display:inline-flex;align-items:center;gap:6px}

    @media(max-width:768px){
      .gallery{grid-template-columns:1fr}
      .gallery-main{height:280px}
      .gallery-side{flex-direction:row}
      .gallery-side img{height:140px;width:50%}
      .detail-grid{grid-template-columns:1fr}
      .sidebar{position:static;margin-top:32px}
      .detail-left h1{font-size:28px}
    }
  `}</style>;
}

export default function ListingDetail() {
  const params = useParams();
  const id = params?.id as string;
  const listing = LISTINGS[id];
  const [submitted, setSubmitted] = useState(false);

  if (!listing) {
    return (
      <>
        <Styles />
        <div className="detail-wrap" style={{ textAlign: "center", paddingTop: 200 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, marginBottom: 16 }}>Suite Not Found</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>This listing may no longer be available.</p>
          <Link href="/" style={{ color: "#0fa", textDecoration: "none", fontWeight: 600 }}>← Back to all suites</Link>
        </div>
      </>
    );
  }

  const hasTub = listing.amenities.includes("Soaking Tub");

  return (
    <>
      <Styles />
      <div className="detail-wrap">
        {/* Back */}
        <Link href="/" className="back-link">← Back to all suites</Link>

        {/* Gallery */}
        <div className="gallery">
          <img src={listing.images[0]} alt={listing.title} className="gallery-main" />
          <div className="gallery-side">
            {listing.images.slice(1, 3).map((img, i) => (
              <img key={i} src={img} alt={`${listing.title} ${i + 2}`} />
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="detail-grid">
          {/* Left */}
          <div className="detail-left">
            <div className={`avail-badge ${listing.available ? "avail-yes" : "avail-no"}`}>
              {listing.available ? "✓ Available Now" : "Waitlist"}
            </div>
            <h1>{listing.title}</h1>
            <p className="detail-loc">{listing.neighborhood}, {listing.location}</p>

            {/* Specs */}
            <div className="detail-specs">
              <div className="detail-spec"><div className="detail-spec-num">{listing.beds}</div><div className="detail-spec-label">Bedrooms</div></div>
              <div className="detail-spec"><div className="detail-spec-num">{listing.baths}</div><div className="detail-spec-label">Bathrooms</div></div>
              <div className="detail-spec"><div className="detail-spec-num">{listing.sqft}</div><div className="detail-spec-label">Sq Ft</div></div>
            </div>

            {/* Description */}
            <p className="detail-desc">{listing.description}</p>

            {/* Hospital */}
            <div className="hospital-badge">
              <div className="hospital-icon">🏥</div>
              <div>
                <div className="hospital-name">{listing.nearbyHospital}</div>
                <div className="hospital-dist">{listing.hospitalDistance} from this suite</div>
              </div>
            </div>

            {/* Tub badge */}
            {hasTub && (
              <div style={{ marginBottom: 28 }}>
                <span className="tub-badge">🛁 Soaking Tub Included</span>
              </div>
            )}

            {/* CareStay Standard */}
            <div className="detail-section-title">The CareStay Standard — Included</div>
            <div className="standard-row">
              {CARESTAY_STANDARD.map((s, i) => (
                <div key={i} className="standard-chip">{s.icon} {s.name}</div>
              ))}
            </div>

            {/* Amenities */}
            <div className="detail-section-title">Amenities</div>
            <div className="amenities-grid">
              {listing.amenities.filter(a => a !== "Soaking Tub").map((a, i) => (
                <span key={i} className="amenity-tag">{a}</span>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            <div className="sidebar-card">
              <div>
                <span className="sidebar-price">${listing.price.toLocaleString()}</span>
                <span className="sidebar-mo">/month</span>
              </div>
              <p className="sidebar-note">All-in pricing. No hidden fees. Utilities included.</p>

              {!submitted ? (
                <>
                  <div><label className="sidebar-label">Full Name</label><input className="sidebar-input" placeholder="Jane Smith" /></div>
                  <div><label className="sidebar-label">Email</label><input className="sidebar-input" type="email" placeholder="jane@hospital.ca" /></div>
                  <div><label className="sidebar-label">Phone</label><input className="sidebar-input" type="tel" placeholder="(647) 000-0000" /></div>
                  <div><label className="sidebar-label">Move-in Date</label><input className="sidebar-input" placeholder="e.g., April 15" /></div>
                  <div><label className="sidebar-label">Duration</label><input className="sidebar-input" placeholder="e.g., 3 months" /></div>
                  <button className="sidebar-btn" onClick={() => setSubmitted(true)}>Request This Suite</button>
                  <p className="sidebar-fine">We respond within 24 hours. No obligation.</p>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>✓</div>
                  <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Request Received</p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>We&apos;ll be in touch within 24 hours.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div style={{ marginTop: 60, background: "rgba(0,255,170,0.03)", border: "1px solid rgba(0,255,170,0.1)", borderRadius: 16, padding: "36px 28px", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Designed For You. Shaped By You.</h3>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 20px" }}>
            Every CareStay suite is built around what healthcare professionals actually need. If there&apos;s something that would make your stay better — we want to hear it. If it makes sense, we add it to every property.
          </p>
          <a href="mailto:feedback@carestaysuites.com?subject=Suite Feedback" style={{ display: "inline-block", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Share Your Feedback →</a>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: "#0a0c0f", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "48px 24px 32px", marginTop: 60 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40 }}>
          <div style={{ maxWidth: 280 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#0fa,#0af)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#0a0c0f" }}>CS</div>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>CareStay Suites</span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>Premium furnished housing for healthcare professionals across the Greater Toronto Area.</p>
          </div>
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Quick Links</div>
              {[["Browse Suites", "/#listings"], ["Healthcare", "/#healthcare"], ["How It Works", "/#about"], ["Contact", "/#contact"]].map(([label, href]) => (
                <Link key={label} href={href} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none", marginBottom: 8 }}>{label}</Link>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Contact</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>info@carestaysuites.com</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>(647) 499-3889</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Toronto, Ontario</p>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1000, margin: "32px auto 0", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>© 2026 CareStay Suites. All rights reserved.</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Operated by BookedHosts</span>
        </div>
      </footer>
    </>
  );
}
