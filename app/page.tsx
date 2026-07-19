"use client";

declare global { interface Window { fbq: (...args: unknown[]) => void; } }

import { useState, useEffect, useRef, ReactNode } from "react";
import Link from "next/link";
import { ShieldCheck, MapPin, ClipboardList, CalendarDays } from "lucide-react";

/* ─── DATA ─── */
const HOSPITALS = ["Toronto General", "SickKids", "Mount Sinai", "Sunnybrook", "St. Michael's", "Princess Margaret", "Humber River", "Scarborough Health", "North York General", "Credit Valley", "Trillium Health"];

const CARESTAY_STANDARD: { icon: ReactNode; name: string; desc: string }[] = [
  { icon: "🏠", name: "Fully Furnished", desc: "Comfortable spaces ready for everyday living" },
  { icon: "🔑", name: "Easy Check-In", desc: "A straightforward arrival experience" },
  { icon: "📶", name: "Connected", desc: "Reliable Wi-Fi for work and downtime" },
  { icon: "🧹", name: "Professionally Managed", desc: "Property care from a local operations team" },
  { icon: "💬", name: "Responsive Support", desc: "Real help when you need it" },
];

/* ─── HOOKS ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
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
  return <style dangerouslySetInnerHTML={{ __html: `
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
    @keyframes scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    *{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{font-family:'DM Sans',system-ui,sans-serif;color:var(--ink);background:var(--paper);-webkit-font-smoothing:antialiased}

    .wrap{max-width:1200px;margin:0 auto;width:100%}
    .pad{padding:80px 24px}

    /* Hero */
    .hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
    .hero-img-wrap{position:relative}
    .hero-h1{font-family:'Cormorant Garamond',serif;font-size:58px;font-weight:700;line-height:1.02;color:var(--ink);letter-spacing:-0.035em}
    .hero-ctas{display:flex;gap:12px;flex-wrap:wrap}
    .hero-ctas a{padding:16px 30px;border-radius:999px;font-weight:700;font-size:15px;text-decoration:none;text-align:center;transition:transform .2s ease,box-shadow .2s ease,background .2s ease}
    .hero-ctas a:hover{transform:translateY(-2px)}
    .cta-primary{background:var(--accent);color:#fff;box-shadow:0 12px 24px rgba(45,43,255,.2)}
    .cta-secondary{background:var(--surface);color:var(--ink);border:1px solid var(--line)}

    /* Stats */
    .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
    .stat-card{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:24px 16px;text-align:center;box-shadow:var(--shadow)}
    .stat-num{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:700;background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .stat-label{font-size:12px;color:var(--ink-soft);margin-top:4px;font-weight:600}

    /* Listings */
    .listings-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
    .listing-card{background:var(--surface);border-radius:18px;overflow:hidden;border:1px solid var(--line);box-shadow:var(--shadow);transition:transform .2s,box-shadow .2s}
    .listing-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-lift)}
    .listing-img{width:100%;height:220px;object-fit:cover;display:block}
    .listing-body{padding:16px 18px}
    .listing-tags{position:absolute;bottom:10px;left:10px;display:flex;gap:6px}
    .listing-tag{background:rgba(23,38,48,0.82);backdrop-filter:blur(10px);color:#fff;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:700}
    .listing-avail{background:rgba(45,43,255,0.15);color:var(--accent);padding:4px 10px;border-radius:6px;font-size:11px;font-weight:700}
    .listing-wait{background:rgba(23,38,48,0.82);color:#fff;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:700}

    /* Standard */
    .standard-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}
    .standard-card{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:24px 16px;text-align:center;box-shadow:var(--shadow)}

    /* Healthcare */
    .health-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
    .pain-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .pain-card{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:20px}

    /* Steps */
    .steps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
    .step-card{position:relative;padding:28px;background:var(--surface);border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow)}

    /* Form */
    .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .form-input{width:100%;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:13px 16px;color:var(--ink);font-size:14px;outline:none;font-family:inherit}
    .form-input:focus{border-color:rgba(45,43,255,0.4)}
    .form-label{display:block;font-size:11px;font-weight:600;color:rgba(30,42,50,0.5);margin-bottom:6px;letter-spacing:0.04em;text-transform:uppercase}

    /* Footer */
    .footer-grid{display:flex;justify-content:space-between;gap:40px;flex-wrap:wrap}
    .footer-links{display:flex;gap:48px}

    /* Nav */
    .nav-links{display:flex;align-items:center;gap:28px}
    .nav-mobile{display:none}
    .nav-link{color:var(--ink-soft);text-decoration:none;font-size:14px;font-weight:600;transition:color .2s}
    .nav-link:hover{color:var(--accent)}
    .nav-cta{background:var(--accent);color:#fff;padding:11px 22px;border-radius:999px;font-weight:700;font-size:13px;text-decoration:none}

    /* Section headers */
    .sh-label{font-size:12px;font-weight:700;color:var(--accent);letter-spacing:0.1em;text-transform:uppercase}
    .sh-title{font-family:'Cormorant Garamond',serif;font-size:38px;font-weight:700;color:var(--ink);margin-top:10px;letter-spacing:-0.02em;line-height:1.15}
    .sh-sub{font-size:15px;color:var(--ink-soft);margin-top:12px;line-height:1.7;max-width:520px}
    .sh-center{text-align:center}
    .sh-center .sh-sub{margin-left:auto;margin-right:auto}

    /* Tub banner */
    .tub-banner{background:var(--paper-alt);border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:20px 24px;text-align:center}
    .tub-text{font-size:15px;color:rgba(30,42,50,0.6)}
    .tub-text span{color:var(--accent);font-weight:700}

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
  ` }} />;
}

/* ─── NAV ─── */
function Nav({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(255,253,249,0.95)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(30,42,50,0.06)" : "none", transition: "all 0.4s" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,var(--accent),var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#fff" }}>CS</div>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 20, color: "var(--ink)" }}>CareStay <span style={{ fontWeight: 400, color: "rgba(30,42,50,0.6)" }}>Suites</span></span>
        </div>
        <div className="nav-links">
          {[{ l: "Listings", h: "/listings" }, { l: "Healthcare", h: "/healthcare" }, { l: "Corporate", h: "/corporate" }, { l: "About", h: "/about" }, { l: "Contact", h: "#contact" }].map(i => <a key={i.l} href={i.h} className="nav-link">{i.l}</a>)}
          <a href="#contact" className="nav-cta">Inquire Now</a>
        </div>
        <button className="nav-mobile" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)} style={{ background: "none", border: "none", fontSize: 28, color: "var(--ink)", cursor: "pointer" }}>{open ? "✕" : "☰"}</button>
      </div>
      {open && (
        <div style={{ background: "rgba(255,253,249,0.98)", padding: "16px 24px 24px", borderTop: "1px solid rgba(30,42,50,0.06)" }}>
          {[{ l: "Listings", h: "/listings" }, { l: "Healthcare", h: "/healthcare" }, { l: "Corporate", h: "/corporate" }, { l: "About", h: "/about" }, { l: "Contact", h: "#contact" }].map(i => <a key={i.l} href={i.h} onClick={() => setOpen(false)} style={{ display: "block", color: "rgba(30,42,50,0.8)", textDecoration: "none", fontSize: 17, padding: "14px 0", borderBottom: "1px solid rgba(30,42,50,0.06)" }}>{i.l}</a>)}
          <a href="#contact" onClick={() => setOpen(false)} style={{ display: "block", background: "var(--accent)", color: "#fff", textAlign: "center", padding: 16, borderRadius: 10, fontWeight: 700, fontSize: 16, marginTop: 16, textDecoration: "none" }}>Inquire Now</a>
        </div>
      )}
    </nav>
  );
}

/* ─── HERO ─── */
function Hero({ tagline }: { tagline?: string }) {
  const legacyTagline = "Move-in ready suites primarily across the Greater Toronto Area and beyond. Verified properties. No scams, no deposits lost, no bait-and-switch. Trusted by nurses, physicians, and medical staff.";
  const heroTagline = !tagline || tagline === legacyTagline
    ? "Comfortable, fully equipped suites with flexible stays, easy self check-in, and responsive local support from arrival to departure."
    : tagline;

  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", background: "linear-gradient(155deg,#f7f3ed 0%,#fffdf9 48%,#e8eff3 100%)" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle at 1px 1px,rgba(30,42,50,0.3) 1px,transparent 0)", backgroundSize: "40px 40px" }} />
      <div style={{ position: "absolute", top: "10%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(45,43,255,0.06) 0%,transparent 70%)", filter: "blur(60px)" }} />
      <div className="pad" style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 1, paddingTop: 120, paddingBottom: 80 }}>
        <div className="hero-grid">
          <div>
            <FadeIn>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(45,43,255,0.08)", border: "1px solid rgba(45,43,255,0.2)", borderRadius: 100, padding: "8px 18px", marginBottom: 28 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Furnished stays across Toronto</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="hero-h1">
                Furnished stays for{" "}
                <span style={{ background: "linear-gradient(135deg,var(--accent),var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>professionals in Toronto.</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: "rgba(30,42,50,0.55)", maxWidth: 500, margin: "24px 0 36px" }}>
                {heroTagline}
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="hero-ctas">
                <a href="#listings" className="cta-primary">Browse Suites</a>
                <a href="/corporate" className="cta-secondary">For Companies</a>
              </div>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <div className="hero-img-wrap">
              <div style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 28px 64px rgba(30,42,50,0.2)", border: "1px solid rgba(30,42,50,0.08)" }}>
                <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80" alt="Luxury furnished suite" style={{ width: "100%", height: 440, objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ position: "absolute", bottom: -16, left: -16, background: "rgba(255,253,249,0.92)", backdropFilter: "blur(20px)", border: "1px solid rgba(30,42,50,0.08)", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: "linear-gradient(135deg,var(--accent),var(--accent2))", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800 }}>✓</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>Professionally Managed</div>
                  <div style={{ fontSize: 11, color: "rgba(30,42,50,0.5)" }}>Real suites · responsive local support</div>
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
function Stats() {
  const [ref, inView] = useInView();
  const trustPoints = [
    { n: "✓", l: "Professionally Managed" },
    { n: "✓", l: "Fully Equipped Suites" },
    { n: "✓", l: "Flexible Arrangements" },
    { n: "✓", l: "Responsive Local Support" },
  ];
  return (
    <section ref={ref} style={{ background: "var(--paper-alt)", borderTop: "1px solid rgba(30,42,50,0.05)", borderBottom: "1px solid rgba(30,42,50,0.05)" }}>
      <div className="pad" style={{ maxWidth: 1200, margin: "0 auto", paddingTop: 40, paddingBottom: 40 }}>
        <div className="stats-grid">
          {trustPoints.map((s, i) => (
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
  const [listingsLoaded, setListingsLoaded] = useState(false);
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
      .catch(() => {})
      .finally(() => setListingsLoaded(true));
  }, []);

  const featuredListings = apiListings.filter(l => l.featured);
  const allListings = apiListings.filter(l => !l.featured);
  const displayedListings = allListings.slice(0, 9);
  const hasMore = allListings.length > 9;

  return (
    <section id="listings" className="pad" style={{ background: "var(--paper)" }}>
      <div className="wrap">
        {featuredListings.length > 0 && (
          <>
            <FadeIn>
              <div className="sh-center" style={{ marginBottom: 32 }}>
                <div className="sh-label" style={{ color: "var(--gold)" }}>★ Featured Suites</div>
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
                          <span style={{ background: l.availabilityStatus === "Almost Booked" ? "rgba(255,160,0,0.9)" : l.availabilityStatus === "Waitlist Only" ? "rgba(0,112,214,0.9)" : l.availabilityStatus === "Booked" ? "rgba(196,50,50,0.9)" : "rgba(45,43,255,0.9)", color: l.availabilityStatus === "Almost Booked" ? "#1e2a32" : "#fff", padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700 }}>{l.availabilityStatus === "Almost Booked" ? "Almost Booked" : l.availabilityStatus === "Waitlist Only" ? "Waitlist" : l.availabilityStatus === "Booked" ? "Booked" : "Available"}</span>
                        </div>
                      </div>
                      <div className="listing-body">
                        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 20, color: "var(--ink)", marginBottom: 4 }}>{l.title}</h3>
                        <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 12 }}>{l.location}</p>
                        <p style={{ fontSize: 12, color: "rgba(30,42,50,0.5)", marginBottom: 14 }}>
                          {[
                            l.maxGuests ? `${l.maxGuests} guest${l.maxGuests !== 1 ? "s" : ""}` : null,
                            l.bedrooms ? `${l.bedrooms} bedroom${l.bedrooms !== 1 ? "s" : ""}` : null,
                            l.beds ? `${l.beds} bed${l.beds !== 1 ? "s" : ""}` : null,
                            l.baths ? `${l.baths} bath${l.baths !== 1 ? "s" : ""}` : null,
                          ].filter(Boolean).join(" · ")}
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(240,192,64,0.15)", paddingTop: 14 }}>
                          <div>
                            <span style={{ fontSize: 12, color: "var(--ink-faint)", marginRight: 5 }}>From</span>
                            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 24, color: "var(--ink)" }}>${l.price.toLocaleString()}</span>
                          </div>
                          <span style={{ background: "rgba(185,130,79,0.15)", color: "var(--gold)", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>View Suite →</span>
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
            <p className="sh-sub">Professionally managed, furnished suites for work assignments, relocations, insurance placements, and extended travel.</p>
          </div>
        </FadeIn>
        <div className="listings-grid">
          {displayedListings.map((l, i) => (
            <FadeIn key={l.id} delay={i * 0.06}>
              <Link href={`/listings/${l.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="listing-card">
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img src={l.img} alt={l.title} className="listing-img" />
                    <div className="listing-tags">
                      <span className="listing-tag">{l.tag}</span>
                      <span style={{ background: l.availabilityStatus === "Almost Booked" ? "rgba(255,160,0,0.9)" : l.availabilityStatus === "Waitlist Only" ? "rgba(0,112,214,0.9)" : l.availabilityStatus === "Booked" ? "rgba(196,50,50,0.9)" : "rgba(45,43,255,0.9)", color: l.availabilityStatus === "Almost Booked" ? "#1e2a32" : "#fff", padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700 }}>{l.availabilityStatus === "Almost Booked" ? "Almost Booked" : l.availabilityStatus === "Waitlist Only" ? "Waitlist" : l.availabilityStatus === "Booked" ? "Booked" : "Available"}</span>
                    </div>
                  </div>
                  <div className="listing-body">
                    <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 20, color: "var(--ink)", marginBottom: 4 }}>{l.title}</h3>
                    <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 12 }}>{l.location}</p>
                    <p style={{ fontSize: 12, color: "rgba(30,42,50,0.5)", marginBottom: 14 }}>
                      {[
                        l.maxGuests ? `${l.maxGuests} guest${l.maxGuests !== 1 ? "s" : ""}` : null,
                        l.bedrooms ? `${l.bedrooms} bedroom${l.bedrooms !== 1 ? "s" : ""}` : null,
                        l.beds ? `${l.beds} bed${l.beds !== 1 ? "s" : ""}` : null,
                        l.baths ? `${l.baths} bath${l.baths !== 1 ? "s" : ""}` : null,
                      ].filter(Boolean).join(" · ")}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(30,42,50,0.06)", paddingTop: 14 }}>
                      <div>
                        <span style={{ fontSize: 12, color: "var(--ink-faint)", marginRight: 5 }}>From</span>
                        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 24, color: "var(--ink)" }}>${l.price.toLocaleString()}</span>
                      </div>
                      <span style={{ background: "rgba(45,43,255,0.1)", color: "var(--accent)", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>View Suite →</span>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
        {listingsLoaded && displayedListings.length === 0 && featuredListings.length === 0 && (
          <div style={{ textAlign: "center", padding: "36px 20px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 18 }}>
            <p style={{ color: "var(--ink-soft)", lineHeight: 1.7 }}>Current suite availability is being updated. Tell us what you need and the team will help.</p>
          </div>
        )}
        {hasMore && (
          <FadeIn delay={0.3}>
            <div style={{ textAlign: "center", marginTop: 36 }}>
              <Link href="/listings" style={{ display: "inline-block", background: "rgba(45,43,255,0.1)", color: "var(--accent)", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none", border: "1px solid rgba(45,43,255,0.2)" }}>View All Suites →</Link>
            </div>
          </FadeIn>
        )}
        <FadeIn delay={0.3}>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <a href="#contact" style={{ color: "var(--accent)", fontSize: 14, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid rgba(45,43,255,0.3)", paddingBottom: 2 }}>Don&apos;t see what you need? Tell us your requirements →</a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── HOSPITAL SCROLL ─── */
function HospitalBanner() {
  return (
    <div style={{ background: "var(--night)", padding: "32px 0", overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ display: "flex", gap: 48, animation: "scroll 25s linear infinite", whiteSpace: "nowrap" }}>
        {[...HOSPITALS, ...HOSPITALS].map((h, i) => <span key={i} style={{ fontSize: 14, color: "rgba(255,255,255,0.68)", fontWeight: 600 }}>{h}</span>)}
      </div>
    </div>
  );
}

/* ─── CARESTAY STANDARD ─── */
function Standard() {
  return (
    <>
      <section id="about" className="pad" style={{ background: "var(--surface-blue)" }}>
        <div className="wrap">
          <FadeIn>
            <div className="sh-center" style={{ marginBottom: 40 }}>
              <div className="sh-label">The CareStay Standard</div>
              <h2 className="sh-title">Every Suite, Thoughtfully Equipped.</h2>
              <p className="sh-sub">Comfort comes down to the details. CareStay suites pair the everyday essentials with practical touches designed for demanding schedules.</p>
            </div>
          </FadeIn>
          <div className="standard-grid">
            {CARESTAY_STANDARD.map((item, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="standard-card">
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>{item.name}</h3>
                  <p style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      <div className="tub-banner">
        <p className="tub-text"><span>Clear suite details.</span> Exact amenities are shown on each listing before you inquire.</p>
      </div>
    </>
  );
}

/* ─── HEALTHCARE ─── */
function Healthcare() {
  const points: { icon: ReactNode; title: string; desc: string }[] = [
    { icon: <ShieldCheck size={28} strokeWidth={1.5} style={{ color: "var(--accent)" }} />, title: "Verified & Scam-Free", desc: "Every property personally inspected. No fake listings." },
    { icon: <MapPin size={28} strokeWidth={1.5} style={{ color: "var(--accent)" }} />, title: "Well Located", desc: "Convenient options near major hospitals and Toronto neighbourhoods." },
    { icon: <ClipboardList size={28} strokeWidth={1.5} style={{ color: "var(--accent)" }} />, title: "Move-In Ready", desc: "Fully furnished with everything from day one." },
    { icon: <CalendarDays size={28} strokeWidth={1.5} style={{ color: "var(--accent)" }} />, title: "Flexible Terms", desc: "Stay arrangements built around your assignment." },
  ];
  return (
    <section id="healthcare" className="pad" style={{ background: "var(--paper-alt)" }}>
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
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>{p.title}</h3>
                  <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.5 }}>{p.desc}</p>
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
    { n: "01", t: "Tell Us Your Needs", d: "Share your dates, destination, budget, and preferences." },
    { n: "02", t: "Browse & Tour Virtually", d: "Browse verified suites and take virtual video tours from anywhere." },
    { n: "03", t: "Book & Move In", d: "Sign digitally. Fully furnished suite waiting for you." },
  ];
  return (
    <section id="how-it-works" className="pad" style={{ background: "var(--surface)" }}>
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
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 800, fontSize: 48, color: "rgba(45,43,255,0.08)", position: "absolute", top: 14, right: 18 }}>{s.n}</div>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: "linear-gradient(135deg,rgba(45,43,255,0.1),rgba(94,129,148,0.1))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 16, color: "var(--accent)", fontWeight: 800 }}>{s.n}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 22, color: "var(--ink)", marginBottom: 8 }}>{s.t}</h3>
                <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6 }}>{s.d}</p>
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
    <section id="contact" className="pad" style={{ background: "var(--surface-blue)" }}>
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
            <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 20, padding: "28px 22px", boxShadow: "var(--shadow)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div><label className="form-label">Name (optional)</label><input type="text" placeholder="Jane Smith" className="form-input" value={name} onChange={e => setName(e.target.value)} /></div>
                <div><label className="form-label">Email *</label><input type="email" placeholder="jane@hospital.ca" className="form-input" value={email} onChange={e => setEmail(e.target.value)} /></div>
                <div>
                  <label className="form-label">Hospital / Facility</label>
                  <select className="form-input" value={hospital} onChange={e => setHospital(e.target.value)} style={{ appearance: "none", WebkitAppearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='rgba(30,42,50,0.4)' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 32, cursor: "pointer" }}>
                    <option value="">Select hospital...</option>
                    {HOSPITAL_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={handleSubmit} style={{ width: "100%", background: "var(--accent)", color: "#fff", padding: 16, borderRadius: 10, fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer", fontFamily: "inherit", marginTop: 16 }}>Join the Waitlist</button>
              <p style={{ fontSize: 11, color: "rgba(30,42,50,0.25)", textAlign: "center", marginTop: 12 }}>No spam, ever. Just new suite alerts.</p>
            </div>
          </FadeIn>
        ) : (
          <FadeIn>
            <div style={{ textAlign: "center", padding: 60, background: "rgba(45,43,255,0.04)", border: "1px solid rgba(45,43,255,0.15)", borderRadius: 20 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 28, color: "var(--ink)", marginBottom: 8 }}>You&apos;re on the list!</h3>
              <p style={{ fontSize: 15, color: "rgba(30,42,50,0.5)" }}>We&apos;ll notify you when new suites drop.</p>
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
    <footer style={{ background: "var(--night)", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "48px 24px 32px" }}>
      <div className="wrap">
        <div className="footer-grid">
          <div style={{ maxWidth: 280 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,var(--accent),var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#fff" }}>CS</div>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>CareStay Suites</span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", lineHeight: 1.6 }}>Professionally managed furnished stays for professionals and organizations across the Greater Toronto Area.</p>
          </div>
          <div className="footer-links">
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.82)", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Quick Links</div>
              {[{ label: "Listings", href: "/listings" }, { label: "Healthcare", href: "/healthcare" }, { label: "Corporate", href: "/corporate" }, { label: "About", href: "/about" }, { label: "Contact", href: "#contact" }].map(l => <a key={l.label} href={l.href} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.58)", textDecoration: "none", marginBottom: 8 }}>{l.label}</a>)}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.82)", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Contact</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", marginBottom: 8 }}>info@carestaysuites.com</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", marginBottom: 8 }}>{address || "35 Mariner Terrace, Toronto, ON M5V 3V9"}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)" }}>Toronto, Ontario</p>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.42)" }}>© 2026 CareStay Suites. All rights reserved.</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.42)" }}>Operated by BookedHosts</span>
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
      <Stats />
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
