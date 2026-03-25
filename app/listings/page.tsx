"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

interface Listing { id: number | string; title: string; location: string; beds: number; baths: number; price: number; sqft: number; img: string; available: boolean; maxGuests?: number; bedrooms?: number }

export default function AllListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bedFilter, setBedFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  useEffect(() => {
    fetch("/api/listings")
      .then(r => r.json())
      .then(data => {
        if (data.status === "success") setListings(data.listings || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Dynamic cities from actual listing data
  const cities = useMemo(() => {
    const unique = Array.from(new Set(listings.map(l => l.location).filter(Boolean)));
    unique.sort((a, b) => a.localeCompare(b));
    return unique;
  }, [listings]);

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
        .listing-img{width:100%;height:220px;object-fit:cover;display:block}
        .listing-body{padding:16px 18px}
        .listing-tag{background:rgba(0,0,0,0.7);backdrop-filter:blur(10px);color:#0fa;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:700}
        .listing-avail{background:rgba(0,255,170,0.15);color:#0fa;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:700}
        .filter-input{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:10px 16px;color:#fff;font-size:14px;outline:none;font-family:inherit;height:42px;line-height:1}
        .filter-input:focus{border-color:rgba(0,255,170,0.4)}
        .filter-select{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:10px 14px;color:#fff;font-size:13px;outline:none;font-family:inherit;cursor:pointer;appearance:none;-webkit-appearance:none;height:42px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='rgba(255,255,255,0.4)' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px}
        .filter-select option{background:#12151a;color:#fff}
        .filter-dropdowns{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:100%}
        .city-scroll{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;margin-bottom:16px;-ms-overflow-style:none;scrollbar-width:none}
        .city-scroll::-webkit-scrollbar{display:none}
        @media(max-width:900px){.listings-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:600px){.listings-grid{grid-template-columns:1fr}.nav-links{display:none!important}.nav-mobile{display:block!important}.filter-dropdowns{grid-template-columns:1fr}}
      `}</style>

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,12,15,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 72 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#0fa,#0af)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#0a0c0f" }}>CS</div>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 20, color: "#fff" }}>CareStay <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.6)" }}>Suites</span></span>
          </Link>
          <div className="nav-links">
            {[{ label: "Listings", href: "/listings" }, { label: "Healthcare", href: "/healthcare" }, { label: "Corporate", href: "/corporate" }, { label: "About", href: "/about" }, { label: "Contact", href: "/#contact" }].map(i => <a key={i.label} href={i.href} className="nav-link">{i.label}</a>)}
            <a href="/#contact" className="nav-cta">Inquire Now</a>
          </div>
        </div>
      </nav>

      <main style={{ paddingTop: 72 }}>
        <div className="wrap" style={{ padding: "60px 24px 80px" }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700, marginBottom: 8 }}>All Suites</h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", marginBottom: 20 }}>{listings.length} properties available across Ontario</p>

          {/* Search */}
          <div style={{ marginBottom: 12 }}>
            <input type="text" placeholder="Search by name or location..." className="filter-input" style={{ width: "100%" }} value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {/* Filter Dropdowns */}
          <div className="filter-dropdowns" style={{ marginBottom: 14 }}>
            <select className="filter-select" style={{ width: "100%" }} value={bedFilter} onChange={e => setBedFilter(e.target.value)}>
              <option value="all">All Beds</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3+ Bedrooms</option>
            </select>
            <select className="filter-select" style={{ width: "100%" }} value={priceFilter} onChange={e => setPriceFilter(e.target.value)}>
              <option value="all">Any Price</option>
              <option value="under2500">Under $2,500/mo</option>
              <option value="2500-3500">$2,500 - $3,500/mo</option>
              <option value="over3500">$3,500+/mo</option>
            </select>
            <select className="filter-select" style={{ width: "100%" }} value={areaFilter} onChange={e => setAreaFilter(e.target.value)}>
              <option value="all">All Areas</option>
              {cities.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>

          {/* City Buttons — horizontal scroll */}
          <div className="city-scroll">
            {["All", ...cities].map(city => {
              const isActive = city === "All" ? areaFilter === "all" : areaFilter === city;
              return (
                <button key={city} onClick={() => setAreaFilter(city === "All" ? "all" : city)} style={{ padding: "7px 16px", borderRadius: 20, border: isActive ? "1px solid #0fa" : "1px solid rgba(255,255,255,0.12)", background: isActive ? "rgba(0,255,170,0.15)" : "rgba(255,255,255,0.04)", color: isActive ? "#0fa" : "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {city}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.4)" }}>Loading listings...</div>
          ) : (() => {
            const filtered = listings.filter(l => {
              const q = search.toLowerCase();
              if (q && !l.title.toLowerCase().includes(q) && !l.location.toLowerCase().includes(q)) return false;
              if (bedFilter === "1" && l.beds !== 1) return false;
              if (bedFilter === "2" && l.beds !== 2) return false;
              if (bedFilter === "3" && l.beds < 3) return false;
              if (priceFilter === "under2500" && l.price >= 2500) return false;
              if (priceFilter === "2500-3500" && (l.price < 2500 || l.price > 3500)) return false;
              if (priceFilter === "over3500" && l.price <= 3500) return false;
              if (areaFilter !== "all" && !l.location.toLowerCase().includes(areaFilter.toLowerCase())) return false;
              return true;
            });
            return filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.4)" }}>No listings match your filters. Try broadening your search.</div>
            ) : (
            <div className="listings-grid">
              {filtered.map((l) => (
                <Link key={l.id} href={`/listings/${l.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="listing-card">
                    <div style={{ position: "relative", overflow: "hidden" }}>
                      <img src={l.img} alt={l.title} className="listing-img" />
                      <div style={{ position: "absolute", bottom: 10, left: 10, display: "flex", gap: 6 }}>
                        <span className="listing-tag">{l.location}</span>
                        <span className="listing-avail">Available</span>
                      </div>
                    </div>
                    <div className="listing-body">
                      <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 20, color: "#fff", marginBottom: 4 }}>{l.title}</h3>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>{l.location}</p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 14 }}>
                        {[
                          l.maxGuests ? `${l.maxGuests} guest${l.maxGuests !== 1 ? "s" : ""}` : null,
                          l.bedrooms ? `${l.bedrooms} bedroom${l.bedrooms !== 1 ? "s" : ""}` : null,
                          l.beds ? `${l.beds} bed${l.beds !== 1 ? "s" : ""}` : null,
                          l.baths ? `${l.baths} bath${l.baths !== 1 ? "s" : ""}` : null,
                        ].filter(Boolean).join(" · ")}
                      </p>
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
            );
          })()}
        </div>
      </main>
    </>
  );
}
