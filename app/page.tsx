"use client";
import { useState, useEffect, useRef, ReactNode } from "react";

const LISTINGS = [
  { id: 1, title: "The Pinnacle Suite", location: "Downtown Toronto", beds: 1, baths: 1, price: 3200, sqft: 620, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", tag: "Near UHN", available: true },
  { id: 2, title: "Lakeview Residence", location: "Harbourfront", beds: 2, baths: 1, price: 4100, sqft: 850, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80", tag: "Near St. Michael's", available: true },
  { id: 3, title: "Midtown Medical Suite", location: "Yonge & Eglinton", beds: 1, baths: 1, price: 2900, sqft: 550, img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80", tag: "Near Sunnybrook", available: false },
  { id: 4, title: "King West Luxury", location: "King West Village", beds: 2, baths: 2, price: 4300, sqft: 920, img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80", tag: "Near Toronto General", available: true },
  { id: 5, title: "Scarborough Heights", location: "Scarborough", beds: 2, baths: 1, price: 2800, sqft: 780, img: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80", tag: "Near Scarborough Health", available: true },
  { id: 6, title: "North York Terrace", location: "North York", beds: 1, baths: 1, price: 2700, sqft: 520, img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80", tag: "Near North York General", available: true },
];

const HOSPITALS = [
  "Toronto General Hospital", "SickKids", "Mount Sinai", "Sunnybrook",
  "St. Michael's", "Princess Margaret", "Humber River", "Scarborough Health Network",
  "North York General", "Credit Valley Hospital", "Trillium Health"
];

const STATS = [
  { num: "60+", label: "Properties Managed" },
  { num: "150+", label: "Healthcare Professionals Housed" },
  { num: "30+", label: "Hospital Partnerships" },
  { num: "4.9", label: "Average Rating" },
];

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

function FadeIn({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(30px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>{children}</div>
  );
}

function Nav({ scrolled }: { scrolled: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(10,12,15,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      transition: "all 0.4s ease",
      padding: "0 40px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #0fa, #0af)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#0a0c0f" }}>CS</div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 20, color: "#fff", letterSpacing: "-0.02em" }}>CareStay <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.6)" }}>Suites</span></span>
        </div>
        <div className="nav-links" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Listings", "Healthcare", "About", "Contact"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 500, letterSpacing: "0.02em", transition: "color 0.2s" }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = "#0fa"}
              onMouseLeave={e => (e.target as HTMLElement).style.color = "rgba(255,255,255,0.7)"}
            >{item}</a>
          ))}
          <a href="#contact" style={{
            background: "linear-gradient(135deg, #0fa, #0af)",
            color: "#0a0c0f", padding: "10px 24px", borderRadius: 8,
            fontWeight: 700, fontSize: 13, letterSpacing: "0.03em", transition: "transform 0.2s, box-shadow 0.2s",
          }}
            onMouseEnter={e => { (e.target as HTMLElement).style.transform = "translateY(-2px)"; (e.target as HTMLElement).style.boxShadow = "0 8px 30px rgba(0,255,170,0.25)"; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.transform = "translateY(0)"; (e.target as HTMLElement).style.boxShadow = "none"; }}
          >Inquire Now</a>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{
          display: "none", background: "none", border: "none", cursor: "pointer", padding: 8,
          flexDirection: "column", gap: 5,
        }}>
          <span style={{ display: "block", width: 24, height: 2, background: "#fff", borderRadius: 2, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 2, background: "#fff", borderRadius: 2, transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 2, background: "#fff", borderRadius: 2, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>
      </div>
      {menuOpen && (
        <div className="mobile-menu" style={{
          display: "none", flexDirection: "column", gap: 16, padding: "20px 0",
          borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,12,15,0.98)",
        }}>
          {["Listings", "Healthcare", "About", "Contact"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, fontWeight: 500 }}>{item}</a>
          ))}
          <a href="#contact" onClick={() => setMenuOpen(false)} style={{
            background: "linear-gradient(135deg, #0fa, #0af)", color: "#0a0c0f",
            padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 14, textAlign: "center",
          }}>Inquire Now</a>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
      background: "linear-gradient(165deg, #0a0c0f 0%, #0d1117 40%, #0a1628 100%)",
    }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      <div style={{ position: "absolute", top: "10%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,255,170,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,170,255,0.05) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="hero-grid" style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 40px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", position: "relative", zIndex: 1 }}>
        <div>
          <FadeIn>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,255,170,0.08)", border: "1px solid rgba(0,255,170,0.2)", borderRadius: 100, padding: "6px 16px", marginBottom: 24 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0fa", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#0fa", letterSpacing: "0.06em", textTransform: "uppercase" }}>Now Accepting Applications</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
              fontSize: 56, lineHeight: 1.1, color: "#fff",
              letterSpacing: "-0.03em", marginBottom: 20,
            }}>
              Premium Furnished Housing for{" "}
              <span style={{ background: "linear-gradient(135deg, #0fa, #0af)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Healthcare Professionals
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "rgba(255,255,255,0.55)", maxWidth: 480, marginBottom: 36 }}>
              Move-in ready suites across the GTA. Verified properties. No scams, no deposits lost, no bait-and-switch. Trusted by nurses, physicians, and medical staff at Toronto&apos;s top hospitals.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div style={{ display: "flex", gap: 14 }}>
              <a href="#listings" style={{
                background: "linear-gradient(135deg, #0fa, #0af)", color: "#0a0c0f",
                padding: "14px 32px", borderRadius: 10, fontWeight: 700, fontSize: 15,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { (e.target as HTMLElement).style.transform = "translateY(-2px)"; (e.target as HTMLElement).style.boxShadow = "0 12px 40px rgba(0,255,170,0.3)"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.transform = "translateY(0)"; (e.target as HTMLElement).style.boxShadow = "none"; }}
              >Browse Suites</a>
              <a href="#healthcare" style={{
                background: "rgba(255,255,255,0.06)", color: "#fff",
                padding: "14px 32px", borderRadius: 10, fontWeight: 600, fontSize: 15,
                border: "1px solid rgba(255,255,255,0.1)", transition: "all 0.2s",
              }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
              >I&apos;m a Healthcare Professional</a>
            </div>
          </FadeIn>
        </div>
        <FadeIn delay={0.2} className="hero-image">
          <div style={{ position: "relative" }}>
            <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80" alt="Luxury furnished suite" style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }} />
            </div>
            <div style={{
              position: "absolute", bottom: -20, left: -20,
              background: "rgba(10,12,15,0.9)", backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14,
              padding: "16px 20px", display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg, #0fa, #0af)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏥</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Hospital Proximity</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>All suites within 20 min of major hospitals</div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function StatsSection() {
  const [ref, inView] = useInView();
  return (
    <section ref={ref} style={{ background: "#0d1117", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="stats-grid" style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 40px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40 }}>
        {STATS.map((s, i) => (
          <div key={i} style={{ textAlign: "center", opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: `all 0.6s ease ${i * 0.1}s` }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 40, background: "linear-gradient(135deg, #0fa, #0af)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.num}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 500, letterSpacing: "0.04em", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ListingCard({ listing, delay }: { listing: typeof LISTINGS[0]; delay: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={delay}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
        background: "#12151a", borderRadius: 16, overflow: "hidden",
        border: `1px solid ${hovered ? "rgba(0,255,170,0.15)" : "rgba(255,255,255,0.06)"}`,
        transition: "transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.2)",
        cursor: "pointer",
      }}>
        <div style={{ position: "relative", overflow: "hidden" }}>
          <img src={listing.img} alt={listing.title} style={{
            width: "100%", height: 220, objectFit: "cover", display: "block",
            transition: "transform 0.5s ease", transform: hovered ? "scale(1.05)" : "scale(1)",
          }} />
          <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 8 }}>
            <span style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)", color: "#0fa", padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{listing.tag}</span>
            {listing.available ? (
              <span style={{ background: "rgba(0,255,170,0.15)", color: "#0fa", padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>Available</span>
            ) : (
              <span style={{ background: "rgba(255,77,77,0.15)", color: "#f66", padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>Waitlist</span>
            )}
          </div>
        </div>
        <div style={{ padding: "18px 20px" }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 20, color: "#fff", marginBottom: 4 }}>{listing.title}</h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 14 }}>{listing.location}</p>
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{listing.beds} Bed</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{listing.baths} Bath</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{listing.sqft} sqft</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14 }}>
            <div>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 24, color: "#fff" }}>${listing.price.toLocaleString()}</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginLeft: 4 }}>/month</span>
            </div>
            <span style={{
              background: hovered ? "linear-gradient(135deg, #0fa, #0af)" : "rgba(255,255,255,0.06)",
              color: hovered ? "#0a0c0f" : "rgba(255,255,255,0.6)",
              padding: "8px 18px", borderRadius: 8, fontSize: 12, fontWeight: 700, transition: "all 0.3s ease",
            }}>View Suite →</span>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

function ListingsSection() {
  return (
    <section id="listings" style={{ background: "#0a0c0f", padding: "80px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0fa", letterSpacing: "0.1em", textTransform: "uppercase" }}>Featured Suites</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 40, color: "#fff", marginTop: 10 }}>Curated Properties Near You</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", maxWidth: 500, margin: "12px auto 0" }}>Every suite is verified, professionally furnished, and located within 20 minutes of major GTA hospitals.</p>
          </div>
        </FadeIn>
        <div className="listings-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {LISTINGS.map((l, i) => <ListingCard key={l.id} listing={l} delay={i * 0.08} />)}
        </div>
        <FadeIn delay={0.3}>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <a href="#contact" style={{ color: "#0fa", fontSize: 14, fontWeight: 600, borderBottom: "1px solid rgba(0,255,170,0.3)", paddingBottom: 2 }}>
              Don&apos;t see what you need? Tell us your requirements →
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function HealthcareSection() {
  const painPoints = [
    { icon: "🛡️", title: "Verified & Scam-Free", desc: "Every property is personally inspected. No fake listings, no surprise deposits, no bait-and-switch." },
    { icon: "📍", title: "Hospital-Adjacent", desc: "All suites within 20 minutes of your assignment hospital. We know where you need to be." },
    { icon: "📋", title: "Move-In Ready", desc: "Fully furnished. WiFi, linens, kitchen essentials — packed and ready from day one." },
    { icon: "📅", title: "Flexible 30-90 Day Terms", desc: "Month-to-month available. Extend or shorten your stay. No 12-month lease lock-in." },
  ];
  return (
    <section id="healthcare" style={{ background: "#0d1117", padding: "80px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="healthcare-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <FadeIn>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0fa", letterSpacing: "0.1em", textTransform: "uppercase" }}>For Healthcare Professionals</span>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 38, color: "#fff", marginTop: 10, lineHeight: 1.15 }}>
                Housing That Understands<br />Your Assignment
              </h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", marginTop: 16, lineHeight: 1.7, maxWidth: 460 }}>
                We know the frustration — fake listings, unresponsive hosts, deposits that vanish. CareStay Suites exists because healthcare professionals deserve better. Every property is verified by our team. Every stay is protected.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                <a href="#contact" style={{
                  background: "linear-gradient(135deg, #0fa, #0af)", color: "#0a0c0f",
                  padding: "12px 28px", borderRadius: 10, fontWeight: 700, fontSize: 14,
                }}>Join the Waitlist</a>
              </div>
            </div>
          </FadeIn>
          <div className="healthcare-pain-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {painPoints.map((p, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 14, padding: 20, transition: "border-color 0.3s, background 0.3s",
                }}
                  onMouseEnter={e => { (e.currentTarget).style.borderColor = "rgba(0,255,170,0.2)"; (e.currentTarget).style.background = "rgba(0,255,170,0.03)"; }}
                  onMouseLeave={e => { (e.currentTarget).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget).style.background = "rgba(255,255,255,0.03)"; }}
                >
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

function CareStayStandard() {
  const items = [
    { icon: "🕶️", title: "Blue Light Blocking Glasses", desc: "3 pairs included — protect your eyes after long shifts under hospital fluorescents." },
    { icon: "👕", title: "Spare Scrubs", desc: "Fresh S/M/L sets available in every suite for those unexpected double shifts." },
    { icon: "💆", title: "Massage Gun", desc: "Recover from 12-hour shifts with a professional-grade percussion massager." },
    { icon: "🛏️", title: "Heated Mattress Pad", desc: "Slip into warmth after a cold night shift — adjustable heat for perfect sleep." },
    { icon: "🌙", title: "Blackout Curtains + White Noise", desc: "Day-sleep essentials for night shift workers. Total darkness, zero disruptions." },
  ];
  return (
    <section style={{ background: "#0a0c0f", padding: "80px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0fa", letterSpacing: "0.1em", textTransform: "uppercase" }}>Every Suite Includes</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 40, color: "#fff", marginTop: 10 }}>The CareStay Standard</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", maxWidth: 520, margin: "12px auto 0" }}>We don&apos;t just furnish apartments — we equip them for healthcare professionals who work hard and need real recovery.</p>
          </div>
        </FadeIn>
        <div className="standard-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {items.map((item, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14, padding: 24, transition: "border-color 0.3s, background 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,255,170,0.2)"; e.currentTarget.style.background = "rgba(0,255,170,0.03)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function HospitalBanner() {
  return (
    <section style={{ background: "#0a0c0f", padding: "40px 0", overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ display: "flex", gap: 50, animation: "scroll 30s linear infinite", whiteSpace: "nowrap" }}>
        {[...HOSPITALS, ...HOSPITALS].map((h, i) => (
          <span key={i} style={{ fontSize: 14, color: "rgba(255,255,255,0.2)", fontWeight: 500 }}>{h}</span>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: "01", title: "Tell Us Your Needs", desc: "Assignment dates, hospital location, budget, preferences. 2-minute form." },
    { num: "02", title: "We Match You", desc: "Our team finds verified suites near your hospital. You review options within 24 hours." },
    { num: "03", title: "Book & Move In", desc: "Sign digitally. Move into a fully furnished, professionally cleaned suite. Done." },
  ];
  return (
    <section style={{ background: "#0a0c0f", padding: "80px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0fa", letterSpacing: "0.1em", textTransform: "uppercase" }}>How It Works</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 38, color: "#fff", marginTop: 10 }}>Move In, Not Stressed Out</h2>
          </div>
        </FadeIn>
        <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 30 }}>
          {steps.map((s, i) => (
            <FadeIn key={i} delay={i * 0.12}>
              <div style={{ position: "relative", padding: 30, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 800, fontSize: 52, color: "rgba(0,255,170,0.08)", position: "absolute", top: 16, right: 20 }}>{s.num}</div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, rgba(0,255,170,0.1), rgba(0,170,255,0.1))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 18, color: "#0fa", fontWeight: 800 }}>{s.num}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 22, color: "#fff", marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section id="contact" style={{ background: "#0d1117", padding: "80px 40px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0fa", letterSpacing: "0.1em", textTransform: "uppercase" }}>Get Started</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 38, color: "#fff", marginTop: 10 }}>Find Your Suite</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", marginTop: 10 }}>Tell us about your assignment and we&apos;ll match you within 24 hours.</p>
          </div>
        </FadeIn>
        {!submitted ? (
          <FadeIn delay={0.15}>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 36 }}>
              <div className="contact-fields" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                {[
                  { label: "Full Name", ph: "Jane Smith", type: "text" },
                  { label: "Email", ph: "jane@hospital.ca", type: "email" },
                  { label: "Phone", ph: "(647) 000-0000", type: "tel" },
                  { label: "Hospital / Facility", ph: "Toronto General", type: "text" },
                ].map((f, i) => (
                  <div key={i}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 6, letterSpacing: "0.04em" }}>{f.label}</label>
                    <input type={f.type} placeholder={f.ph} style={{
                      width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none",
                      transition: "border-color 0.2s",
                    }}
                      onFocus={e => e.target.style.borderColor = "rgba(0,255,170,0.4)"}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 6, letterSpacing: "0.04em" }}>Move-in Date & Duration</label>
                <input type="text" placeholder="e.g., April 15 — 3 months" style={{
                  width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none",
                }}
                  onFocus={e => e.target.style.borderColor = "rgba(0,255,170,0.4)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>
              <button onClick={() => setSubmitted(true)} style={{
                width: "100%", background: "linear-gradient(135deg, #0fa, #0af)", color: "#0a0c0f",
                padding: "14px", borderRadius: 10, fontWeight: 800, fontSize: 15, border: "none",
                cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", letterSpacing: "0.02em",
              }}
                onMouseEnter={e => { (e.target as HTMLElement).style.transform = "translateY(-2px)"; (e.target as HTMLElement).style.boxShadow = "0 12px 40px rgba(0,255,170,0.3)"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.transform = "translateY(0)"; (e.target as HTMLElement).style.boxShadow = "none"; }}
              >Submit Inquiry</button>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 12 }}>We respond within 24 hours. No spam, ever.</p>
            </div>
          </FadeIn>
        ) : (
          <FadeIn>
            <div style={{ textAlign: "center", padding: 60, background: "rgba(0,255,170,0.04)", border: "1px solid rgba(0,255,170,0.15)", borderRadius: 20 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 28, color: "#fff", marginBottom: 8 }}>Application Received</h3>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)" }}>Our team will match you with available suites within 24 hours.</p>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#0a0c0f", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "48px 40px 32px" }}>
      <div className="footer-content" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #0fa, #0af)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#0a0c0f" }}>CS</div>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>CareStay Suites</span>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", maxWidth: 280, lineHeight: 1.5 }}>Premium furnished housing for healthcare professionals across the Greater Toronto Area.</p>
        </div>
        <div className="footer-links" style={{ display: "flex", gap: 60 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Quick Links</div>
            {["Listings", "Healthcare", "About", "Contact"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 8, transition: "color 0.2s" }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = "#0fa"} onMouseLeave={e => (e.target as HTMLElement).style.color = "rgba(255,255,255,0.35)"}
              >{l}</a>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Contact</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>info@carestaysuites.com</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>(647) 499-3889</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Toronto, Ontario</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom" style={{ maxWidth: 1200, margin: "32px auto 0", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>© 2026 CareStay Suites. All rights reserved.</span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Operated by BookedHosts</span>
      </div>
    </footer>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <main>
      <style>{`
        @media (max-width: 768px) {
          .hamburger { display: flex !important; }
          .nav-links { display: none !important; }
          .mobile-menu { display: flex !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-image { display: none !important; }
          .hero-grid h1 { font-size: 32px !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .listings-grid { grid-template-columns: 1fr !important; }
          .standard-grid { grid-template-columns: 1fr !important; }
          .healthcare-grid { grid-template-columns: 1fr !important; }
          .healthcare-pain-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .contact-fields { grid-template-columns: 1fr !important; }
          .footer-content { flex-direction: column !important; gap: 32px !important; }
          .footer-links { flex-direction: column !important; gap: 32px !important; }
          .footer-bottom { flex-direction: column !important; gap: 8px !important; text-align: center !important; }
          section { padding: 60px 20px !important; }
          nav { padding: 0 20px !important; }
          footer { padding: 48px 20px 32px !important; }
        }
      `}</style>
      <Nav scrolled={scrolled} />
      <Hero />
      <StatsSection />
      <ListingsSection />
      <CareStayStandard />
      <HospitalBanner />
      <HealthcareSection />
      <HowItWorks />
      <ContactForm />
      <Footer />
    </main>
  );
}
