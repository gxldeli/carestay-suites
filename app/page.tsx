"use client";

declare global { interface Window { fbq: (...args: unknown[]) => void; } }

import { useState, useEffect, useRef, ReactNode } from "react";
import Link from "next/link";
import { BriefcaseBusiness, Building2, HeartPulse, ShieldCheck } from "lucide-react";

/* ─── DATA ─── */
const PROFESSIONAL_STAYS = ["Business travel", "Relocations", "Healthcare assignments", "Insurance placements", "Consultants", "Film & project crews"];

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
    .pad{padding:56px 24px}

    /* Hero */
    .hero-pad{padding-top:112px;padding-bottom:56px}
    .hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center}
    .hero-img-wrap{position:relative}
    .hero-h1{font-family:'Cormorant Garamond',serif;font-size:54px;font-weight:700;line-height:1.04;color:var(--ink);letter-spacing:-0.03em}
    .hero-ctas{display:flex;gap:12px;flex-wrap:wrap}
    .hero-ctas a{padding:16px 30px;border-radius:999px;font-weight:700;font-size:15px;text-decoration:none;text-align:center;transition:transform .2s ease,box-shadow .2s ease,background .2s ease}
    .hero-ctas a:hover{transform:translateY(-2px)}
    .cta-primary{background:var(--accent);color:#fff;box-shadow:0 12px 24px rgba(45,43,255,.2)}
    .cta-secondary{background:var(--surface);color:var(--ink);border:1px solid var(--line)}

    /* Stats */
    .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
    .stat-card{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:16px 12px;display:flex;align-items:center;justify-content:center;gap:10px;text-align:left;box-shadow:0 8px 24px rgba(30,42,50,0.05)}
    .stat-icon{font-size:22px;line-height:1;flex:0 0 auto}
    .stat-label{font-size:12px;color:var(--ink-soft);font-weight:700;line-height:1.3}

    /* Listings */
    .listings-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
    .listing-card{background:var(--surface);border-radius:18px;overflow:hidden;border:1px solid var(--line);box-shadow:var(--shadow);transition:transform .2s,box-shadow .2s}
    .listing-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-lift)}
    .listing-media{height:210px;position:relative;overflow:hidden;background:linear-gradient(145deg,#e8eef2 0%,#f7f3ed 52%,#dfe7ed 100%)}
    .listing-media-fallback{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--ink-soft);text-align:center;gap:4px}
    .listing-media-fallback strong{font-family:'Cormorant Garamond',serif;font-size:24px;color:var(--ink)}
    .listing-media-fallback span{font-size:11px;font-weight:700;letter-spacing:.02em}
    .listing-img{position:relative;z-index:1;width:100%;height:210px;object-fit:cover;display:block}
    .listing-body{padding:15px 17px}
    .listing-tags{position:absolute;z-index:2;bottom:10px;left:10px;display:flex;gap:6px}
    .listing-tag{background:rgba(23,38,48,0.82);backdrop-filter:blur(10px);color:#fff;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:700}
    .listing-avail{background:rgba(45,43,255,0.15);color:var(--accent);padding:4px 10px;border-radius:6px;font-size:11px;font-weight:700}
    .listing-wait{background:rgba(23,38,48,0.82);color:#fff;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:700}

    /* Standard */
    .standard-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
    .standard-card{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:20px 14px;text-align:center;box-shadow:var(--shadow)}

    /* Professional paths */
    .health-grid{display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:center}
    .pain-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .pain-card{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:18px}

    /* Steps */
    .steps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
    .step-card{position:relative;padding:24px;background:var(--surface);border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow)}

    /* Form */
    .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .form-input{width:100%;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:13px 16px;color:var(--ink);font-size:14px;outline:none;font-family:inherit}
    .form-input:focus{border-color:rgba(45,43,255,0.4)}
    .form-label{display:block;font-size:11px;font-weight:600;color:rgba(30,42,50,0.5);margin-bottom:6px;letter-spacing:0.02em;text-transform:uppercase}

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
    .sh-label{font-size:12px;font-weight:700;color:var(--accent);letter-spacing:0.04em;text-transform:uppercase}
    .sh-title{font-family:'Cormorant Garamond',serif;font-size:38px;font-weight:700;color:var(--ink);margin-top:7px;letter-spacing:-0.02em;line-height:1.12}
    .sh-sub{font-size:15px;color:var(--ink-soft);margin-top:9px;line-height:1.6;max-width:560px}
    .sh-center{text-align:center}
    .sh-center .sh-sub{margin-left:auto;margin-right:auto}

    /* Tub banner */
    .tub-banner{background:var(--paper-alt);border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:16px 24px;text-align:center}
    .tub-text{font-size:15px;color:rgba(30,42,50,0.6)}
    .tub-text span{color:var(--accent);font-weight:700}

    @media(max-width:1024px){
      .listings-grid{grid-template-columns:repeat(2,1fr)}
      .standard-grid{grid-template-columns:repeat(3,1fr)}
      .hero-h1{font-size:42px}
    }
    @media(max-width:768px){
      .hero-grid{grid-template-columns:1fr;gap:24px}
      .hero-img-wrap{display:none}
      .hero-h1{font-size:36px}
      .hero-ctas a{width:100%;padding:16px 24px;font-size:16px}
      .stats-grid{grid-template-columns:1fr 1fr}
      .listings-grid{grid-template-columns:1fr}
      .standard-grid{grid-template-columns:1fr 1fr}
      .standard-grid>div:last-child:nth-child(odd){grid-column:1/-1;width:calc(50% - 6px);justify-self:center}
      .health-grid{grid-template-columns:1fr}
      .steps-grid{grid-template-columns:1fr}
      .form-grid{grid-template-columns:1fr}
      .footer-grid{flex-direction:column}
      .footer-links{flex-direction:column;gap:28px}
      .nav-links{display:none!important}
      .nav-mobile{display:block!important}
      .pad{padding:34px 18px}
      .hero-pad{padding-top:86px;padding-bottom:34px}
      .sh-title{font-size:28px}
    }
    @media(max-width:480px){
      .hero-h1{font-size:30px}
    }
    @media(max-width:360px){.standard-grid,.pain-grid{grid-template-columns:1fr}.standard-grid>div:last-child:nth-child(odd){grid-column:auto;width:auto}}
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
    <section style={{ display: "flex", alignItems: "center", position: "relative", overflow: "hidden", background: "linear-gradient(155deg,#f7f3ed 0%,#fffdf9 48%,#e8eff3 100%)" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle at 1px 1px,rgba(30,42,50,0.3) 1px,transparent 0)", backgroundSize: "40px 40px" }} />
      <div style={{ position: "absolute", top: "10%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(45,43,255,0.06) 0%,transparent 70%)", filter: "blur(60px)" }} />
      <div className="pad hero-pad" style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
        <div className="hero-grid">
          <div>
            <FadeIn>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(45,43,255,0.08)", border: "1px solid rgba(45,43,255,0.2)", borderRadius: 100, padding: "7px 15px", marginBottom: 20 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.035em", textTransform: "uppercase" }}>Furnished stays across Toronto</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="hero-h1">
                Furnished stays for{" "}
                <span style={{ background: "linear-gradient(135deg,var(--accent),var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>professionals in Toronto.</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p style={{ fontSize: 17, lineHeight: 1.6, color: "rgba(30,42,50,0.58)", maxWidth: 500, margin: "18px 0 28px" }}>
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
              <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 22px 52px rgba(30,42,50,0.18)", border: "1px solid rgba(30,42,50,0.08)" }}>
                <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80" alt="Luxury furnished suite" style={{ width: "100%", height: 400, objectFit: "cover", display: "block" }} />
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
    { icon: "🛎️", label: "Professionally Managed" },
    { icon: "🏡", label: "Fully Equipped Suites" },
    { icon: "📅", label: "Flexible Arrangements" },
    { icon: "💬", label: "Responsive Local Support" },
  ];
  return (
    <section ref={ref} style={{ background: "var(--paper-alt)", borderTop: "1px solid rgba(30,42,50,0.05)", borderBottom: "1px solid rgba(30,42,50,0.05)" }}>
      <div className="pad" style={{ maxWidth: 1200, margin: "0 auto", paddingTop: 24, paddingBottom: 24 }}>
        <div className="stats-grid">
          {trustPoints.map((s, i) => (
            <div key={s.label} className="stat-card" style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(14px)", transition: `all 0.45s ease ${i * 0.06}s` }}>
              <div className="stat-icon" aria-hidden="true">{s.icon}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── LISTINGS ─── */
interface ListingCard { id: number | string; title: string; location: string; beds: number; baths: number; price: number; sqft: number; img: string; tag: string; available: boolean; featured?: boolean; maxGuests?: number; bedrooms?: number; reviewCount?: number; reviewAvg?: number; availabilityStatus?: string }

function ListingPhoto({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(!src);
  if (failed) return <div className="listing-media-fallback"><strong>CareStay Suites</strong><span>Photo unavailable</span></div>;
  return <img src={src} alt={alt} className="listing-img" onError={() => setFailed(true)} />;
}

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
        <FadeIn>
          <div className="sh-center" style={{ marginBottom: 30 }}>
            <div className="sh-label">Explore Our Suites</div>
            <h2 className="sh-title">Hand-picked suites by CareStay</h2>
            <p className="sh-sub">Professionally managed, furnished suites for work assignments, relocations, insurance placements, and extended travel.</p>
          </div>
        </FadeIn>
        {featuredListings.length > 0 && (
          <div className="listings-grid" style={{ marginBottom: 32 }}>
            {featuredListings.map((l, i) => (
                <FadeIn key={`featured-${l.id}`} delay={i * 0.06}>
                  <Link href={`/listings/${l.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div className="listing-card" style={{ border: "1px solid rgba(240,192,64,0.3)", boxShadow: "0 0 20px rgba(240,192,64,0.08)" }}>
                      <div className="listing-media">
                        <ListingPhoto src={l.img} alt={l.title} />
                        <div className="listing-tags">
                          <span style={{ background: "rgba(240,192,64,0.9)", color: "#000", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.025em" }}>★ FEATURED</span>
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
        )}
        <div className="listings-grid">
          {displayedListings.map((l, i) => (
            <FadeIn key={l.id} delay={i * 0.06}>
              <Link href={`/listings/${l.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="listing-card">
                  <div className="listing-media">
                    <ListingPhoto src={l.img} alt={l.title} />
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
            <div style={{ textAlign: "center", marginTop: 28 }}>
              <Link href="/listings" style={{ display: "inline-block", background: "rgba(45,43,255,0.1)", color: "var(--accent)", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none", border: "1px solid rgba(45,43,255,0.2)" }}>View All Suites →</Link>
            </div>
          </FadeIn>
        )}
        <FadeIn delay={0.3}>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <a href="#contact" style={{ color: "var(--accent)", fontSize: 14, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid rgba(45,43,255,0.3)", paddingBottom: 2 }}>Need something different? Tell us →</a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── PROFESSIONAL STAY TYPES ─── */
function ProfessionalBanner() {
  return (
    <div style={{ background: "var(--night)", padding: "22px 0", overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ display: "flex", gap: 40, animation: "scroll 25s linear infinite", whiteSpace: "nowrap" }}>
        {[...PROFESSIONAL_STAYS, ...PROFESSIONAL_STAYS].map((stayType, i) => <span key={i} style={{ fontSize: 14, color: "rgba(255,255,255,0.72)", fontWeight: 600 }}>•&nbsp; {stayType}</span>)}
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
            <div className="sh-center" style={{ marginBottom: 28 }}>
              <div className="sh-label">The CareStay Standard</div>
              <h2 className="sh-title">Every Suite, Thoughtfully Equipped.</h2>
              <p className="sh-sub">Comfort comes down to the details. CareStay suites pair the everyday essentials with practical touches designed for demanding schedules.</p>
            </div>
          </FadeIn>
          <div className="standard-grid">
            {CARESTAY_STANDARD.map((item, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="standard-card">
                  <div style={{ fontSize: 32, marginBottom: 9 }}>{item.icon}</div>
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

/* ─── PROFESSIONAL PATHS ─── */
function ProfessionalPaths() {
  const points: { icon: ReactNode; title: string; desc: string; href?: string; linkLabel?: string }[] = [
    { icon: <BriefcaseBusiness size={28} strokeWidth={1.5} style={{ color: "var(--accent)" }} />, title: "Independent Professionals", desc: "Comfortable, work-ready suites for consultants, contractors, and business travellers." },
    { icon: <Building2 size={28} strokeWidth={1.5} style={{ color: "var(--accent)" }} />, title: "Companies & Teams", desc: "Coordinated stays for relocations, project teams, and employee placements.", href: "/corporate", linkLabel: "Corporate stays" },
    { icon: <HeartPulse size={28} strokeWidth={1.5} style={{ color: "var(--accent)" }} />, title: "Healthcare", desc: "Furnished stays near major medical hubs for healthcare professionals on assignment.", href: "/healthcare", linkLabel: "Healthcare stays" },
    { icon: <ShieldCheck size={28} strokeWidth={1.5} style={{ color: "var(--accent)" }} />, title: "Insurance & Relocation", desc: "A dependable place to land during a move, repair, or temporary displacement." },
  ];
  return (
    <section id="professional-stays" className="pad" style={{ background: "var(--paper-alt)" }}>
      <div className="wrap">
        <div className="health-grid">
          <FadeIn>
            <div>
              <div className="sh-label">Built for Professional Stays</div>
              <h2 className="sh-title">One Place to Start, Whatever Brings You Here</h2>
              <p className="sh-sub" style={{ maxWidth: 460 }}>CareStay helps professionals and organizations find well-managed furnished suites without the uncertainty of a typical listing search.</p>
              <div style={{ marginTop: 22, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a href="/listings" className="cta-primary" style={{ display: "inline-block", padding: "13px 26px", borderRadius: 999, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Browse Suites</a>
                <a href="#contact" className="cta-secondary" style={{ display: "inline-block", padding: "13px 26px", borderRadius: 999, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Tell Us What You Need</a>
              </div>
            </div>
          </FadeIn>
          <div className="pain-grid">
            {points.map((p, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="pain-card" style={{ height: "100%" }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{p.icon}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>{p.title}</h3>
                  <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.5 }}>{p.desc}</p>
                  {p.href && <a href={p.href} style={{ display: "inline-block", color: "var(--accent)", fontSize: 12, fontWeight: 700, textDecoration: "none", marginTop: 10 }}>{p.linkLabel} →</a>}
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
          <div className="sh-center" style={{ marginBottom: 30 }}>
            <div className="sh-label">How It Works</div>
            <h2 className="sh-title">Move In, Not Stressed Out</h2>
          </div>
        </FadeIn>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="step-card">
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 800, fontSize: 48, color: "rgba(45,43,255,0.08)", position: "absolute", top: 14, right: 18 }}>{s.n}</div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,rgba(45,43,255,0.1),rgba(94,129,148,0.1))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, marginBottom: 12, color: "var(--accent)", fontWeight: 800 }}>{s.n}</div>
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
const STAY_TYPE_OPTIONS = ["Business travel", "Relocation", "Healthcare assignment", "Insurance placement", "Consulting or contract work", "Film or project crew", "Other", "Not sure yet"];

function Contact() {
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [stayType, setStayType] = useState("");
  const handleSubmit = async () => {
    if (!email) return;
    await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, message: stayType ? `Stay type: ${stayType}` : "", tags: ["carestay-waitlist", "homepage-signup", "professional-stays"] }) });
    if (typeof window !== "undefined" && window.fbq) { window.fbq("track", "Lead"); }
    setDone(true);
  };
  return (
    <section id="contact" className="pad" style={{ background: "var(--surface-blue)" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <FadeIn>
          <div className="sh-center" style={{ marginBottom: 28 }}>
            <div className="sh-label">Stay Updated</div>
            <h2 className="sh-title">Be the First to Know When New Suites Drop</h2>
            <p className="sh-sub" style={{ marginLeft: "auto", marginRight: "auto" }}>Join professionals and organizations looking for furnished stays in Toronto.</p>
          </div>
        </FadeIn>
        {!done ? (
          <FadeIn delay={0.1}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 20, padding: "24px 22px", boxShadow: "var(--shadow)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div><label className="form-label">Name (optional)</label><input type="text" placeholder="Jane Smith" className="form-input" value={name} onChange={e => setName(e.target.value)} /></div>
                <div><label className="form-label">Email *</label><input type="email" placeholder="name@email.com" className="form-input" value={email} onChange={e => setEmail(e.target.value)} /></div>
                <div>
                  <label className="form-label">What brings you to Toronto?</label>
                  <select className="form-input" value={stayType} onChange={e => setStayType(e.target.value)} style={{ appearance: "none", WebkitAppearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='rgba(30,42,50,0.4)' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 32, cursor: "pointer" }}>
                    <option value="">Select a stay type...</option>
                    {STAY_TYPE_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={handleSubmit} style={{ width: "100%", background: "var(--accent)", color: "#fff", padding: 16, borderRadius: 10, fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer", fontFamily: "inherit", marginTop: 16 }}>Join the Waitlist</button>
              <p style={{ fontSize: 11, color: "rgba(30,42,50,0.25)", textAlign: "center", marginTop: 12 }}>No spam, ever. Just new suite alerts.</p>
            </div>
          </FadeIn>
        ) : (
          <FadeIn>
            <div style={{ textAlign: "center", padding: 48, background: "rgba(45,43,255,0.04)", border: "1px solid rgba(45,43,255,0.15)", borderRadius: 20 }}>
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
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.82)", marginBottom: 12, letterSpacing: "0.035em", textTransform: "uppercase" }}>Quick Links</div>
              {[{ label: "Listings", href: "/listings" }, { label: "Healthcare", href: "/healthcare" }, { label: "Corporate", href: "/corporate" }, { label: "About", href: "/about" }, { label: "Contact", href: "#contact" }].map(l => <a key={l.label} href={l.href} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.58)", textDecoration: "none", marginBottom: 8 }}>{l.label}</a>)}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.82)", marginBottom: 12, letterSpacing: "0.035em", textTransform: "uppercase" }}>Contact</div>
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
      <ProfessionalBanner />
      <Standard />
      <ProfessionalPaths />
      <HowItWorks />
      <Contact />
      <Footer address={siteSettings?.companyAddress} />
    </>
  );
}
