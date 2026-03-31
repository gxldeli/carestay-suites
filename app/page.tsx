"use client";

declare global { interface Window { fbq: (...args: unknown[]) => void; } }

import { useState, useEffect, useRef, ReactNode } from "react";
import Link from "next/link";
import { ShieldCheck, MapPin, ClipboardList, CalendarDays } from "lucide-react";

/* ─── DATA ─── */
const SHOWCASE_LISTINGS = [
  { id: 1, title: "The Pinnacle Suite", location: "Downtown Toronto", beds: 1, baths: 1, price: 2800, sqft: 580, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", tag: "Near UHN", available: true },
  { id: 2, title: "Lakeview Residence", location: "Harbourfront", beds: 2, baths: 1, price: 3600, sqft: 820, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80", tag: "Near St. Michael's", available: true },
  { id: 3, title: "Midtown Medical Suite", location: "Yonge & Eglinton", beds: 1, baths: 1, price: 2600, sqft: 540, img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80", tag: "Near Sunnybrook", available: false },
  { id: 4, title: "King West Luxury", location: "King West Village", beds: 2, baths: 2, price: 4100, sqft: 920, img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80", tag: "Near Toronto Western", available: true },
  { id: 5, title: "Scarborough Heights", location: "Scarborough", beds: 2, baths: 1, price: 2800, sqft: 780, img: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80", tag: "Near Scarborough Health", available: true },
  { id: 6, title: "North York Terrace", location: "North York", beds: 1, baths: 1, price: 2500, sqft: 520, img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80", tag: "Near North York General", available: true },
];

const HOSPITALS = ["Toronto General", "SickKids", "Mount Sinai", "Sunnybrook", "St. Michael's", "Princess Margaret", "Humber River", "Scarborough Health", "North York General", "Credit Valley", "Trillium Health"];

const CARESTAY_STANDARD: { icon: ReactNode; name: string; desc: string }[] = [
  { icon: "🕶", name: "Blue Light Glasses", desc: "3 pairs in different strengths" },
  { icon: "👕", name: "Spare Scrubs", desc: "S, M, L — always a backup ready" },
  { icon: "🦶", name: "Foot Massager", desc: "Shiatsu relief after 12hr shifts" },
  { icon: "🌙", name: "Blackout + White Noise", desc: "Day-sleep setup for nights" },
  { icon: "💆", name: "Massage Gun", desc: "Full body recovery tool" },
];

/* ─── HOOKS ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s` }}>{children}</div>
  );
}

/* ─── STYLES ─── */
function Styles() {
  return <style>{`
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
    @keyframes scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    *{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{font-family:'DM Sans',system-ui,sans-serif;color:#fff;background:#0a0c0f;-webkit-font-smoothing:antialiased}

    .wrap{max-width:1200px;margin:0 auto;width:100%}
    .pad{padding:80px 24px}

    /* Hero */
    .hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
    .hero-img-wrap{position:relative}
    .hero-h1{font-family:'Cormorant Garamond',serif;font-size:52px;font-weight:700;line-height:1.08;color:#fff;letter-spacing:-0.03em}
    .hero-ctas{display:flex;gap:12px;flex-wrap:wrap}
    .hero-ctas a{padding:16px 32px;border-radius:10px;font-weight:700;font-size:15px;text-decoration:none;text-align:center}
    .cta-primary{background:linear-gradient(135deg,#0fa,#0af);color:#0a0c0f}
    .cta-secondary{background:rgba(255,255,255,0.06);color:#fff;border:1px solid rgba(255,255,255,0.12)}

    /* Stats */
    .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
    .stat-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:24px 16px;text-align:center}
    .stat-num{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:700;background:linear-gradient(135deg,#0fa,#0af);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .stat-label{font-size:12px;color:rgba(255,255,255,0.45);margin-top:4px;font-weight:500}

    /* Listings */
    .listings-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
    .listing-card{background:#12151a;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);transition:transform 0.2s}
    .listing-card:hover{transform:translateY(-4px)}
    .listing-img{width:100%;height:220px;object-fit:cover;display:block}
    .listing-body{padding:16px 18px}
    .listing-tags{position:absolute;bottom:10px;left:10px;display:flex;gap:6px}
    .listing-tag{background:rgba(0,0,0,0.7);backdrop-filter:blur(10px);color:#0fa;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:700}
    .listing-avail{background:rgba(0,255,170,0.15);color:#0fa;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:700}
    .listing-wait{background:rgba(255,77,77,0.15);color:#f66;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:700}

    /* Standard */
    .standard-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}
    .standard-card{background:rgba(0,255,170,0.03);border:1px solid rgba(0,255,170,0.1);border-radius:14px;padding:24px 16px;text-align:center}

    /* Healthcare */
    .health-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
    .pain-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .pain-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:20px}

    /* Steps */
    .steps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
    .step-card{position:relative;padding:28px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:16px}

    /* Form */
    .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .form-input{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:13px 16px;color:#fff;font-size:14px;outline:none;font-family:inherit}
    .form-input:focus{border-color:rgba(0,255,170,0.4)}
    .form-label{display:block;font-size:11px;font-weight:600;color:rgba(255,255,255,0.5);margin-bottom:6px;letter-spacing:0.04em;text-transform:uppercase}

    /* Footer */
    .footer-grid{display:flex;justify-content:space-between;gap:40px;flex-wrap:wrap}
    .footer-links{display:flex;gap:48px}

    /* Nav */
    .nav-links{display:flex;align-items:center;gap:28px}
    .nav-mobile{display:none}
    .nav-link{color:rgba(255,255,255,0.7);text-decoration:none;font-size:14px;font-weight:500}
    .nav-cta{background:linear-gradient(135deg,#0fa,#0af);color:#0a0c0f;padding:10px 22px;border-radius:8px;font-weight:700;font-size:13px;text-decoration:none}

    /* Section headers */
    .sh-label{font-size:12px;font-weight:700;color:#0fa;letter-spacing:0.1em;text-transform:uppercase}
    .sh-title{font-family:'Cormorant Garamond',serif;font-size:38px;font-weight:700;color:#fff;margin-top:10px;letter-spacing:-0.02em;line-height:1.15}
    .sh-sub{font-size:15px;color:rgba(255,255,255,0.4);margin-top:12px;line-height:1.7;max-width:520px}
    .sh-center{text-align:center}
    .sh-center .sh-sub{margin-left:auto;margin-right:auto}

    /* Tub banner */
    .tub-banner{background:rgba(0,255,170,0.04);border-top:1px solid rgba(0,255,170,0.08);border-bottom:1px solid rgba(0,255,170,0.08);padding:20px 24px;text-align:center}
    .tub-text{font-size:15px;color:rgba(255,255,255,0.6)}
    .tub-text span{color:#0fa;font-weight:700}

    @media(max-width:1024px){
      .listings-grid{grid-template-columns:repeat(2,1fr)}
      .standard-grid{grid-template-columns:repeat(3,1fr)}
      .hero-h1{font-size:42px}
    }
    @media(max-width:768px){
      .hero-grid{grid-template-columns:1fr;gap:32px}
      .hero-img-wrap{display:none}
      .hero-h1{font-size:36px}
      .hero-ctas a{width:100%;padding:16px 24px;font-size:16px}
      .stats-grid{grid-template-columns:1fr 1fr}
      .listings-grid{grid-template-columns:1fr}
      .standard-grid{grid-template-columns:1fr 1fr}
      .health-grid{grid-template-columns:1fr}
      .pain-grid{grid-template-columns:1fr}
      .steps-grid{grid-template-columns:1fr}
      .form-grid{grid-template-columns:1fr}
      .footer-grid{flex-direction:column}
      .footer-links{flex-direction:column;gap:28px}
      .nav-links{display:none!important}
      .nav-mobile{display:block!important}
      .pad{padding:56px 18px}
      .sh-title{font-size:28px}
      .stat-num{font-size:30px}
    }
    @media(max-width:480px){
      .standard-grid{grid-template-columns:1fr}
      .hero-h1{font-size:30px}
    }
  `}</style>;
}

/* ─── NAV ─── */
function Nav({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(10,12,15,0.95)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none", transition: "all 0.4s" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#0fa,#0af)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#0a0c0f" }}>CS</div>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 20, color: "#fff" }}>CareStay <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.6)" }}>Suites</span></span>
        </div>
        <div className="nav-links">
          {[{ l: "Listings", h: "/listings" }, { l: "Healthcare", h: "/healthcare" }, { l: "Corporate", h: "/corporate" }, { l: "About", h: "/about" }, { l: "Contact", h: "#contact" }].map(i => <a key={i.l} href={i.h} className="nav-link">{i.l}</a>)}
          <a href="#contact" className="nav-cta">Inquire Now</a>
        </div>
        <button className="nav-mobile" onClick={() => setOpen(!open)} style={{ background: "none", border: "none", fontSize: 28, color: "#fff", cursor: "pointer" }}>{open ? "✕" : "☰"}</button>
      </div>
      {open && (
        <div style={{ background: "rgba(10,12,15,0.98)", padding: "16px 24px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {[{ l: "Listings", h: "/listings" }, { l: "Healthcare", h: "/healthcare" }, { l: "Corporate", h: "/corporate" }, { l: "About", h: "/about" }, { l: "Contact", h: "#contact" }].map(i => <a key={i.l} href={i.h} onClick={() => setOpen(false)} style={{ display: "block", color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 17, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{i.l}</a>)}
          <a href="#contact" onClick={() => setOpen(false)} style={{ display: "block", background: "linear-gradient(135deg,#0fa,#0af)", color: "#0a0c0f", textAlign: "center", padding: 16, borderRadius: 10, fontWeight: 700, fontSize: 16, marginTop: 16, textDecoration: "none" }}>Inquire Now</a>
        </div>
      )}
    </nav>
  );
}

/* ─── HERO ─── */
function Hero({ tagline }: { tagline?: string }) {
  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", background: "linear-gradient(165deg,#0a0c0f 0%,#0d1117 40%,#0a1628 100%)" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle at 1px 1px,rgba(255,255,255,0.3) 1px,transparent 0)", backgroundSize: "40px 40px" }} />
      <div style={{ position: "absolute", top: "10%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,255,170,0.06) 0%,transparent 70%)", filter: "blur(60px)" }} />
      <div className="pad" style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 1, paddingTop: 120, paddingBottom: 80 }}>
        <div className="hero-grid">
          <div>
            <FadeIn>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,255,170,0.08)", border: "1px solid rgba(0,255,170,0.2)", borderRadius: 100, padding: "8px 18px", marginBottom: 28 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#0fa", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#0fa", letterSpacing: "0.06em", textTransform: "uppercase" }}>Now Accepting Applications</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="hero-h1">
                Premium Furnished Housing for{" "}
                <span style={{ background: "linear-gradient(135deg,#0fa,#0af)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Healthcare Professionals</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: "rgba(255,255,255,0.55)", maxWidth: 500, margin: "24px 0 36px" }}>
                {tagline || "Move-in ready suites primarily across the Greater Toronto Area and beyond. Verified properties. No scams, no deposits lost, no bait-and-switch. Trusted by nurses, physicians, and medical staff."}
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="hero-ctas">
                <a href="#listings" className="cta-primary">Browse Suites</a>
                <a href="/healthcare" className="cta-secondary">I&apos;m a Healthcare Professional</a>
              </div>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <div className="hero-img-wrap">
              <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80" alt="Luxury furnished suite" style={{ width: "100%", height: 440, objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ position: "absolute", bottom: -16, left: -16, background: "rgba(10,12,15,0.92)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: "linear-gradient(135deg,#0fa,#0af)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏥</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Hospital Proximity</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>All suites within 20 min of major hospitals</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── STATS ─── */
function Stats({ stats }: { stats?: { properties?: string; pros?: string; hospitals?: string; rating?: string } }) {
  const [ref, inView] = useInView();
  return (
    <section ref={ref} style={{ background: "#0d1117", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="pad" style={{ maxWidth: 1200, margin: "0 auto", paddingTop: 40, paddingBottom: 40 }}>
        <div className="stats-grid">
          {[{ n: stats?.properties || "60+", l: "Properties Managed" }, { n: stats?.pros || "150+", l: "Healthcare Pros Housed" }, { n: stats?.hospitals || "30+", l: "Hospital Partnerships" }, { n: stats?.rating || "4.9", l: "Average Rating" }].map((s, i) => (
            <div key={i} className="stat-card" style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: `all 0.6s ease ${i * 0.1}s` }}>
              <div className="stat-num">{s.n}</div>
              <div className="stat-label">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── LISTINGS ─── */
interface ListingCard { id: number | string; title: string; location: string; beds: number; baths: number; price: number; sqft: number; img: string; tag: string; available: boolean; featured?: boolean; maxGuests?: number; bedrooms?: number; reviewCount?: number; reviewAvg?: number; availabilityStatus?: string }

function ListingsSection() {
  const [apiListings, setApiListings] = useState<ListingCard[]>([]);
  useEffect(() => {
    fetch("/api/listings")
      .then(r => r.json())
      .then(data => {
        if (data.status === "success" && data.listings) {
          setApiListings(data.listings.map((l: { id: number | string; title: string; location: string; beds: number; baths: number; price: number; sqft: number; img: string; featured?: boolean; maxGuests?: number; bedrooms?: number; reviewCount?: number; reviewAvg?: number; availabilityStatus?: string }) => ({
            id: l.id, title: l.title, location: l.location, beds: l.beds, baths: l.baths,
            price: l.price, sqft: l.sqft, img: l.img, tag: l.location || "GTA", available: true, featured: l.featured === true,
            maxGuests: l.maxGuests || 0, bedrooms: l.bedrooms || 0, reviewCount: l.reviewCount || 0, reviewAvg: l.reviewAvg || 0,
            availabilityStatus: l.availabilityStatus || "Available",
          })));
        }
      })
      .catch(() => {});
  }, []);

  const featuredListings = apiListings.filter(l => l.featured);
  const allListings: (ListingCard & { source: "api" | "showcase" })[] = [
    ...apiListings.filter(l => !l.featured).map(l => ({ ...l, source: "api" as const })),
    ...SHOWCASE_LISTINGS.map(l => ({ ...l, source: "showcase" as const, available: false })),
  ];
  const displayedListings = allListings.slice(0, 9);
  const hasMore = allListings.length > 9;

  return (
    <section id="listings" className="pad" style={{ background: "#0a0c0f" }}>
      <div className="wrap">
        {featuredListings.length > 0 && (
          <>
            <FadeIn>
              <div className="sh-center" style={{ marginBottom: 32 }}>
                <div className="sh-label" style={{ color: "#f0c040" }}>★ Featured Suites</div>
                <h2 className="sh-title">Hand-Picked by CareStay</h2>
              </div>
            </FadeIn>
            <div className="listings-grid" style={{ marginBottom: 64 }}>
              {featuredListings.map((l, i) => (
                <FadeIn key={`featured-${l.id}`} delay={i * 0.06}>
                  <Link href={`/listings/${l.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div className="listing-card" style={{ border: "1px solid rgba(240,192,64,0.3)", boxShadow: "0 0 20px rgba(240,192,64,0.08)" }}>
                      <div style={{ position: "relative", overflow: "hidden" }}>
                        <img src={l.img} alt={l.title} className="listing-img" />
                        <div className="listing-tags">
                          <span style={{ background: "rgba(240,192,64,0.9)", color: "#000", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>★ FEATURED</span>
                          <span className="listing-tag">{l.tag}</span>
                          <span style={{ background: l.availabilityStatus === "Almost Booked" ? "rgba(255,160,0,0.85)" : l.availabilityStatus === "Waitlist Only" ? "rgba(0,140,255,0.85)" : l.availabilityStatus === "Booked" ? "rgba(255,60,60,0.85)" : "rgba(0,255,170,0.85)", color: l.availabilityStatus === "Available" || l.availabilityStatus === "Almost Booked" ? "#000" : "#fff", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{l.availabilityStatus === "Almost Booked" ? "Almost Booked" : l.availabilityStatus === "Waitlist Only" ? "Waitlist" : l.availabilityStatus === "Booked" ? "Booked" : "Available"}</span>
                        </div>
                      </div>
                      <div className="listing-body">
                        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 20, color: "#fff", marginBottom: 4 }}>{l.title}</h3>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: l.reviewCount ? 6 : 12 }}>{l.location}</p>
                        {l.reviewCount ? <p style={{ fontSize: 12, color: "#f0c040", marginBottom: 10, fontWeight: 600 }}>★ {l.reviewAvg?.toFixed(1)} · {l.reviewCount} review{l.reviewCount !== 1 ? "s" : ""}</p> : null}
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 14 }}>
                          {[
                            l.maxGuests ? `${l.maxGuests} guest${l.maxGuests !== 1 ? "s" : ""}` : null,
                            l.bedrooms ? `${l.bedrooms} bedroom${l.bedrooms !== 1 ? "s" : ""}` : null,
                            l.beds ? `${l.beds} bed${l.beds !== 1 ? "s" : ""}` : null,
                            l.baths ? `${l.baths} bath${l.baths !== 1 ? "s" : ""}` : null,
                          ].filter(Boolean).join(" · ")}
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(240,192,64,0.15)", paddingTop: 14 }}>
                          <div>
                            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 24, color: "#fff" }}>${l.price.toLocaleString()}</span>
                            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginLeft: 4 }}>/mo</span>
                          </div>
                          <span style={{ background: "rgba(240,192,64,0.15)", color: "#f0c040", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>View Suite →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </>
        )}
        <FadeIn>
          <div className="sh-center" style={{ marginBottom: 48 }}>
            <div className="sh-label">All Suites</div>
            <h2 className="sh-title">Curated Properties Near You</h2>
            <p className="sh-sub">Every suite is verified, professionally furnished, and located near major hospitals across the Greater Toronto Area and beyond.</p>
          </div>
        </FadeIn>
        <div className="listings-grid">
          {displayedListings.map((l, i) => (
            <FadeIn key={`${l.source}-${l.id}`} delay={i * 0.06}>
              <Link href={`/listings/${l.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="listing-card">
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img src={l.img} alt={l.title} className="listing-img" />
                    <div className="listing-tags">
                      <span className="listing-tag">{l.tag}</span>
                      {l.source === "showcase" ? (
                        <span className="listing-wait">Coming Soon</span>
                      ) : (
                        <span style={{ background: l.availabilityStatus === "Almost Booked" ? "rgba(255,160,0,0.85)" : l.availabilityStatus === "Waitlist Only" ? "rgba(0,140,255,0.85)" : l.availabilityStatus === "Booked" ? "rgba(255,60,60,0.85)" : "rgba(0,255,170,0.15)", color: l.availabilityStatus === "Almost Booked" ? "#000" : l.availabilityStatus === "Waitlist Only" ? "#fff" : l.availabilityStatus === "Booked" ? "#fff" : "#0fa", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{l.availabilityStatus === "Almost Booked" ? "Almost Booked" : l.availabilityStatus === "Waitlist Only" ? "Waitlist" : l.availabilityStatus === "Booked" ? "Booked" : "Available"}</span>
                      )}
                    </div>
                  </div>
                  <div className="listing-body">
                    <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 20, color: "#fff", marginBottom: 4 }}>{l.title}</h3>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: l.reviewCount ? 6 : 12 }}>{l.location}</p>
                    {l.reviewCount ? <p style={{ fontSize: 12, color: "#f0c040", marginBottom: 10, fontWeight: 600 }}>★ {l.reviewAvg?.toFixed(1)} · {l.reviewCount} review{l.reviewCount !== 1 ? "s" : ""}</p> : null}
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
            </FadeIn>
          ))}
        </div>
        {hasMore && (
          <FadeIn delay={0.3}>
            <div style={{ textAlign: "center", marginTop: 36 }}>
              <Link href="/listings" style={{ display: "inline-block", background: "rgba(0,255,170,0.1)", color: "#0fa", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none", border: "1px solid rgba(0,255,170,0.2)" }}>View All Suites →</Link>
            </div>
          </FadeIn>
        )}
        <FadeIn delay={0.3}>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <a href="#contact" style={{ color: "#0fa", fontSize: 14, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid rgba(0,255,170,0.3)", paddingBottom: 2 }}>Don&apos;t see what you need? Tell us your requirements →</a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── HOSPITAL SCROLL ─── */
function HospitalBanner() {
  return (
    <div style={{ background: "#0a0c0f", padding: "36px 0", overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ display: "flex", gap: 48, animation: "scroll 25s linear infinite", whiteSpace: "nowrap" }}>
        {[...HOSPITALS, ...HOSPITALS].map((h, i) => <span key={i} style={{ fontSize: 14, color: "rgba(255,255,255,0.2)", fontWeight: 500 }}>{h}</span>)}
      </div>
    </div>
  );
}

/* ─── CARESTAY STANDARD ─── */
function Standard() {
  return (
    <>
      <section id="about" className="pad" style={{ background: "#0a0c0f" }}>
        <div className="wrap">
          <FadeIn>
            <div className="sh-center" style={{ marginBottom: 40 }}>
              <div className="sh-label">The CareStay Standard</div>
              <h2 className="sh-title">Every Suite. Every Stay. No Exceptions.</h2>
              <p className="sh-sub">We don&apos;t just give you a bed and WiFi. Every CareStay suite comes equipped with items built specifically for healthcare professionals.</p>
            </div>
          </FadeIn>
          <div className="standard-grid">
            {CARESTAY_STANDARD.map((item, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="standard-card">
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{item.name}</h3>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      {/* Tub callout */}
      <div className="tub-banner">
        <p className="tub-text">🛁 <span>75% of our suites</span> feature soaking tubs for post-shift recovery</p>
      </div>
    </>
  );
}

/* ─── HEALTHCARE ─── */
function Healthcare() {
  const points: { icon: ReactNode; title: string; desc: string }[] = [
    { icon: <ShieldCheck size={28} strokeWidth={1.5} style={{ color: "#0fa" }} />, title: "Verified & Scam-Free", desc: "Every property personally inspected. No fake listings." },
    { icon: <MapPin size={28} strokeWidth={1.5} style={{ color: "#0fa" }} />, title: "Hospital-Adjacent", desc: "All suites within 20 min of your assignment hospital." },
    { icon: <ClipboardList size={28} strokeWidth={1.5} style={{ color: "#0fa" }} />, title: "Move-In Ready", desc: "Fully furnished with everything from day one." },
    { icon: <CalendarDays size={28} strokeWidth={1.5} style={{ color: "#0fa" }} />, title: "Flexible Terms", desc: "Month-to-month. No 12-month lease lock-in." },
  ];
  return (
    <section id="healthcare" className="pad" style={{ background: "#0d1117" }}>
      <div className="wrap">
        <div className="health-grid">
          <FadeIn>
            <div>
              <div className="sh-label">For Healthcare Professionals</div>
              <h2 className="sh-title">Housing That Understands Your Assignment</h2>
              <p className="sh-sub" style={{ maxWidth: 460 }}>We know the frustration — fake listings, unresponsive hosts, deposits that vanish. CareStay exists because healthcare professionals deserve better.</p>
              <div style={{ marginTop: 28 }}>
                <a href="#contact" className="cta-primary" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>Join the Waitlist</a>
              </div>
            </div>
          </FadeIn>
          <div className="pain-grid">
            {points.map((p, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="pain-card">
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{p.icon}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{p.title}</h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{p.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── HOW IT WORKS ─── */
function HowItWorks() {
  const steps = [
    { n: "01", t: "Tell Us Your Needs", d: "Assignment dates, hospital, budget. 2-minute form." },
    { n: "02", t: "Browse & Tour Virtually", d: "Browse verified suites and take virtual video tours from anywhere. Options in 24 hours." },
    { n: "03", t: "Book & Move In", d: "Sign digitally. Fully furnished suite waiting for you." },
  ];
  return (
    <section className="pad" style={{ background: "#0a0c0f" }}>
      <div className="wrap">
        <FadeIn>
          <div className="sh-center" style={{ marginBottom: 48 }}>
            <div className="sh-label">How It Works</div>
            <h2 className="sh-title">Move In, Not Stressed Out</h2>
          </div>
        </FadeIn>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="step-card">
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 800, fontSize: 48, color: "rgba(0,255,170,0.08)", position: "absolute", top: 14, right: 18 }}>{s.n}</div>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: "linear-gradient(135deg,rgba(0,255,170,0.1),rgba(0,170,255,0.1))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 16, color: "#0fa", fontWeight: 800 }}>{s.n}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 22, color: "#fff", marginBottom: 8 }}>{s.t}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{s.d}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT / WAITLIST ─── */
const HOSPITAL_OPTIONS = ["Toronto General / UHN", "Sunnybrook", "SickKids", "Mount Sinai", "St. Michael's", "Humber River", "Scarborough Health", "North York General", "Credit Valley", "Trillium Health", "Other", "Not Sure Yet"];

function Contact() {
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hospital, setHospital] = useState("");
  const handleSubmit = async () => {
    if (!email) return;
    await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, hospital, tags: ["carestay-waitlist", "homepage-signup"] }) });
    if (typeof window !== "undefined" && window.fbq) { window.fbq("track", "Lead"); }
    setDone(true);
  };
  return (
    <section id="contact" className="pad" style={{ background: "#0d1117" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <FadeIn>
          <div className="sh-center" style={{ marginBottom: 36 }}>
            <div className="sh-label">Stay Updated</div>
            <h2 className="sh-title">Be the First to Know When New Suites Drop</h2>
            <p className="sh-sub" style={{ marginLeft: "auto", marginRight: "auto" }}>Join healthcare professionals across Canada on our waitlist.</p>
          </div>
        </FadeIn>
        {!done ? (
          <FadeIn delay={0.1}>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "28px 22px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div><label className="form-label">Name (optional)</label><input type="text" placeholder="Jane Smith" className="form-input" value={name} onChange={e => setName(e.target.value)} /></div>
                <div><label className="form-label">Email *</label><input type="email" placeholder="jane@hospital.ca" className="form-input" value={email} onChange={e => setEmail(e.target.value)} /></div>
                <div>
                  <label className="form-label">Hospital / Facility</label>
                  <select className="form-input" value={hospital} onChange={e => setHospital(e.target.value)} style={{ appearance: "none", WebkitAppearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='rgba(255,255,255,0.4)' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 32, cursor: "pointer" }}>
                    <option value="">Select hospital...</option>
                    {HOSPITAL_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={handleSubmit} style={{ width: "100%", background: "linear-gradient(135deg,#0fa,#0af)", color: "#0a0c0f", padding: 16, borderRadius: 10, fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer", fontFamily: "inherit", marginTop: 16 }}>Join the Waitlist</button>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 12 }}>No spam, ever. Just new suite alerts.</p>
            </div>
          </FadeIn>
        ) : (
          <FadeIn>
            <div style={{ textAlign: "center", padding: 60, background: "rgba(0,255,170,0.04)", border: "1px solid rgba(0,255,170,0.15)", borderRadius: 20 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 28, color: "#fff", marginBottom: 8 }}>You&apos;re on the list!</h3>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)" }}>We&apos;ll notify you when new suites drop.</p>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer({ address }: { address?: string }) {
  return (
    <footer style={{ background: "#0a0c0f", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "48px 24px 32px" }}>
      <div className="wrap">
        <div className="footer-grid">
          <div style={{ maxWidth: 280 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#0fa,#0af)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#0a0c0f" }}>CS</div>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>CareStay Suites</span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>Premium furnished housing for healthcare professionals, primarily across the Greater Toronto Area.</p>
          </div>
          <div className="footer-links">
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Quick Links</div>
              {["Listings", "Healthcare", "About", "Contact"].map(l => <a key={l} href={`#${l.toLowerCase()}`} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none", marginBottom: 8 }}>{l}</a>)}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Contact</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>info@carestaysuites.com</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>{address || "35 Mariner Terrace, Toronto, ON M5V 3V9"}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Toronto, Ontario</p>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>© 2026 CareStay Suites. All rights reserved.</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Operated by BookedHosts</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── PAGE ─── */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [siteSettings, setSiteSettings] = useState<{ heroTagline?: string; companyAddress?: string; statProperties?: string; statHealthcarePros?: string; statHospitalPartnerships?: string; statAverageRating?: string } | null>(null);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => {
      if (d.status === "success") setSiteSettings(d.settings);
    }).catch(() => {});
  }, []);
  return (
    <>
      <Styles />
      <Nav scrolled={scrolled} />
      <Hero tagline={siteSettings?.heroTagline} />
      <Stats stats={{ properties: siteSettings?.statProperties, pros: siteSettings?.statHealthcarePros, hospitals: siteSettings?.statHospitalPartnerships, rating: siteSettings?.statAverageRating }} />
      <ListingsSection />
      <HospitalBanner />
      <Standard />
      <Healthcare />
      <HowItWorks />
      <Contact />
      <Footer address={siteSettings?.companyAddress} />
    </>
  );
}
