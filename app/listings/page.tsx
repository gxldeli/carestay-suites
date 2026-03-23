"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Listing { id: number | string; title: string; location: string; beds: number; baths: number; price: number; sqft: number; img: string; available: boolean }

export default function AllListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/listings")
      .then(r => r.json())
      .then(data => {
        if (data.status === "success") setListings(data.listings || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
        .listings-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .listing-card{background:#12151a;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);transition:transform 0.2s}
        .listing-card:hover{transform:translateY(-4px)}
        .listing-img{width:100%;height:200px;object-fit:cover;display:block}
        .listing-body{padding:16px 18px}
        .listing-tag{background:rgba(0,0,0,0.7);backdrop-filter:blur(10px);color:#0fa;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:700}
        .listing-avail{background:rgba(0,255,170,0.15);color:#0fa;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:700}
        @media(max-width:900px){.listings-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:600px){.listings-grid{grid-template-columns:1fr}.nav-links{display:none!important}.nav-mobile{display:block!important}}
      `}</style>

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,12,15,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 72 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#0fa,#0af)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#0a0c0f" }}>CS</div>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 20, color: "#fff" }}>CareStay <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.6)" }}>Suites</span></span>
          </Link>
          <div className="nav-links">
            {["Listings", "Healthcare", "About", "Contact"].map(i => <a key={i} href={`/#${i.toLowerCase()}`} className="nav-link">{i}</a>)}
            <a href="/#contact" className="nav-cta">Inquire Now</a>
          </div>
        </div>
      </nav>

      <main style={{ paddingTop: 72 }}>
        <div className="wrap" style={{ padding: "60px 24px 80px" }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700, marginBottom: 8 }}>All Suites</h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", marginBottom: 40 }}>{listings.length} properties available across the GTA</p>

          {loading ? (
            <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.4)" }}>Loading listings...</div>
          ) : (
            <div className="listings-grid">
              {listings.map((l) => (
                <Link key={l.id} href={`/listings/${l.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="listing-card">
                    <div style={{ position: "relative", overflow: "hidden" }}>
                      <img src={l.img} alt={l.title} className="listing-img" />
                      <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
                        <span className="listing-tag">{l.location}</span>
                        <span className="listing-avail">Available</span>
                      </div>
                    </div>
                    <div className="listing-body">
                      <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 20, color: "#fff", marginBottom: 4 }}>{l.title}</h3>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>{l.location}</p>
                      <div style={{ display: "flex", gap: 14, marginBottom: 14, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                        <span>{l.beds} Bed</span><span>{l.baths} Bath</span><span>{l.sqft} sqft</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14 }}>
                        <div>
                          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 24, color: "#fff" }}>${l.price.toLocaleString()}</span>
                          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginLeft: 4 }}>/mo</span>
                        </div>
                        <span style={{ background: "rgba(0,255,170,0.1)", color: "#0fa", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>View Suite →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
