"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

interface Listing { id: number | string; title: string; location: string; beds: number; baths: number; price: number; sqft: number; img: string; available: boolean; maxGuests?: number; bedrooms?: number; reviewCount?: number; reviewAvg?: number; availabilityStatus?: string }

function availabilityBadge(status?: string): { label: string; color: string; bg: string } {
  if (status === "Almost Booked") return { label: "Almost Booked", color: "#B45309", bg: "#FDF0E0" };
  if (status === "Waitlist Only") return { label: "Waitlist", color: "#1D4ED8", bg: "#E8EEFC" };
  if (status === "Booked") return { label: "Booked", color: "#B91C1C", bg: "#FBE9E9" };
  return { label: "Available", color: "#0E7C4A", bg: "#E7F5EE" };
}

export default function AllListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bedFilter, setBedFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");

  useEffect(() => {
    document.title = "Suites & Locations | CareStay Suites — Corporate Housing Toronto";
  }, []);

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
        .suites-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
        .filter-selects{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .city-scroll{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;-ms-overflow-style:none;scrollbar-width:none}
        .city-scroll::-webkit-scrollbar{display:none}
        .suite-select{appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%235C5853' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:38px;cursor:pointer}
        @media(max-width:980px){.suites-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:760px){.suites-grid{grid-template-columns:1fr}.filter-selects{grid-template-columns:1fr}}
      `}</style>

      <SiteNav />

      <main>
        {/* ── Page header ── */}
        <section className="section-tight" style={{ paddingBottom: 36 }}>
          <div className="wrap">
            <div className="eyebrow" style={{ marginBottom: 14 }}>Suites &amp; locations</div>
            <h1 className="h-display" style={{ fontSize: "clamp(34px, 5vw, 52px)", marginBottom: 14 }}>Find your suite in Toronto.</h1>
            <p className="lede" style={{ maxWidth: 560 }}>Fully equipped, professionally managed, ready when you are.</p>
          </div>
        </section>

        {/* ── Filters ── */}
        <section>
          <div className="wrap">
            <div style={{ position: "relative", marginBottom: 12 }}>
              <Search size={17} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--ink-faint)", pointerEvents: "none" }} />
              <input
                type="text"
                placeholder="Search by name or location..."
                className="form-input"
                style={{ paddingLeft: 44 }}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-selects" style={{ marginBottom: 16 }}>
              <select className="form-input suite-select" value={bedFilter} onChange={e => setBedFilter(e.target.value)}>
                <option value="all">All Beds</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3+ Bedrooms</option>
              </select>
              <select className="form-input suite-select" value={priceFilter} onChange={e => setPriceFilter(e.target.value)}>
                <option value="all">Any Price</option>
                <option value="under2500">Under $2,500</option>
                <option value="2500-3500">$2,500–$3,500</option>
                <option value="over3500">Over $3,500</option>
              </select>
              <select className="form-input suite-select" value={areaFilter} onChange={e => setAreaFilter(e.target.value)}>
                <option value="all">All Areas</option>
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>

            {/* City pills — horizontal scroll */}
            <div className="city-scroll" style={{ marginBottom: 36 }}>
              {["All", ...cities].map(city => {
                const isActive = city === "All" ? areaFilter === "all" : areaFilter === city;
                return (
                  <button
                    key={city}
                    onClick={() => setAreaFilter(city === "All" ? "all" : city)}
                    style={{
                      padding: "8px 18px",
                      borderRadius: 999,
                      border: isActive ? "1px solid var(--accent)" : "1px solid var(--line)",
                      background: isActive ? "var(--accent)" : "var(--surface)",
                      color: isActive ? "#fff" : "var(--ink-soft)",
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: "var(--font-body)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {city}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Results ── */}
        <section style={{ paddingBottom: 96 }}>
          <div className="wrap">
            {loading ? (
              <div style={{ textAlign: "center", padding: "72px 0", color: "var(--ink-faint)", fontSize: 15 }}>Loading suites...</div>
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
                <div style={{ textAlign: "center", padding: "72px 0", color: "var(--ink-faint)", fontSize: 15 }}>
                  No suites match your filters. Try broadening your search.
                </div>
              ) : (
                <div className="suites-grid">
                  {filtered.map((l) => {
                    const badge = availabilityBadge(l.availabilityStatus);
                    return (
                      <Link key={l.id} href={`/listings/${l.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <article className="card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                          {l.img ? (
                            <img src={l.img} alt={l.title} style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
                          ) : (
                            <div className="photo-slot" style={{ height: 220, borderRadius: 0 }}>[SUITE_PHOTO]</div>
                          )}
                          <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
                              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 20, color: "var(--ink)", lineHeight: 1.25 }}>{l.title}</h3>
                              <span style={{ background: badge.bg, color: badge.color, padding: "4px 11px", borderRadius: 999, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0, marginTop: 2 }}>{badge.label}</span>
                            </div>
                            <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginBottom: l.reviewCount ? 6 : 12 }}>{l.location}</p>
                            {l.reviewCount ? (
                              <p style={{ fontSize: 12.5, color: "#B98900", marginBottom: 10, fontWeight: 600 }}>
                                ★ {l.reviewAvg?.toFixed(1)} · {l.reviewCount} review{l.reviewCount !== 1 ? "s" : ""}
                              </p>
                            ) : null}
                            <p style={{ fontSize: 13, color: "var(--ink-faint)", marginBottom: 16 }}>
                              {[
                                l.maxGuests ? `${l.maxGuests} guest${l.maxGuests !== 1 ? "s" : ""}` : null,
                                l.bedrooms ? `${l.bedrooms} bedroom${l.bedrooms !== 1 ? "s" : ""}` : null,
                                l.beds ? `${l.beds} bed${l.beds !== 1 ? "s" : ""}` : null,
                                l.baths ? `${l.baths} bath${l.baths !== 1 ? "s" : ""}` : null,
                              ].filter(Boolean).join(" · ")}
                            </p>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--line)", paddingTop: 14, marginTop: "auto" }}>
                              <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 21, color: "var(--ink)" }}>From ${l.price.toLocaleString()}</span>
                              <span style={{ color: "var(--accent)", fontSize: 14, fontWeight: 700 }}>View suite →</span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
