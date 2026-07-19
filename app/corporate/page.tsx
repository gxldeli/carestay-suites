"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function Nav({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(255,253,249,0.96)" : "rgba(255,253,249,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--line)", boxShadow: scrolled ? "0 12px 32px rgba(30,42,50,0.08)" : "none", transition: "all 0.35s ease" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 72 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,var(--accent),var(--accent2))", boxShadow: "0 8px 18px rgba(45,43,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#fff" }}>CS</div>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 20, color: "var(--ink)" }}>CareStay <span style={{ fontWeight: 400, color: "rgba(30,42,50,0.6)" }}>Suites</span></span>
        </Link>
        <div className="nav-links">
          {[{ label: "Listings", href: "/listings" }, { label: "Healthcare", href: "/healthcare" }, { label: "Corporate", href: "/corporate" }, { label: "About", href: "/about" }, { label: "Contact", href: "/#contact" }].map(i => <a key={i.label} href={i.href} className="nav-link">{i.label}</a>)}
          <a href="/#contact" className="nav-cta">Inquire Now</a>
        </div>
        <button className="nav-mobile" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)} style={{ background: "none", border: "none", fontSize: 28, color: "var(--ink)", cursor: "pointer" }}>{open ? "\u2715" : "\u2630"}</button>
      </div>
      {open && (
        <div style={{ background: "rgba(255,253,249,0.98)", padding: "16px 24px 24px", borderTop: "1px solid rgba(30,42,50,0.06)" }}>
          {[{ label: "Listings", href: "/listings" }, { label: "Healthcare", href: "/healthcare" }, { label: "Corporate", href: "/corporate" }, { label: "About", href: "/about" }, { label: "Contact", href: "/#contact" }].map(i => <a key={i.label} href={i.href} onClick={() => setOpen(false)} style={{ display: "block", color: "rgba(30,42,50,0.8)", textDecoration: "none", fontSize: 17, padding: "14px 0", borderBottom: "1px solid rgba(30,42,50,0.06)" }}>{i.label}</a>)}
          <a href="/#contact" onClick={() => setOpen(false)} style={{ display: "block", background: "var(--accent)", color: "#fff", textAlign: "center", padding: 16, borderRadius: 999, fontWeight: 700, fontSize: 16, marginTop: 16, textDecoration: "none", boxShadow: "0 12px 24px rgba(45,43,255,0.2)" }}>Inquire Now</a>
        </div>
      )}
    </nav>
  );
}

const WHO_ITS_FOR = [
  { icon: "🏢", title: "Relocating Employees", desc: "Staff relocating who need furnished housing while they settle in." },
  { icon: "👥", title: "Project Teams", desc: "Teams on-site for project stays who need comfortable, central accommodation." },
  { icon: "💼", title: "Executives", desc: "C-suite and senior staff who expect a premium standard of living." },
  { icon: "🏠", title: "Insurance Displacement", desc: "Families and individuals displaced by home damage who need comfortable furnished housing." },
];

const WHATS_INCLUDED = [
  { icon: "📶", title: "High-Speed WiFi", desc: "Reliable internet for remote work and video conferencing." },
  { icon: "🖥️", title: "Dedicated Workspace", desc: "Desk, monitor-friendly setup, and ergonomic chair." },
  { icon: "🍳", title: "Full Kitchen", desc: "Stainless steel appliances, cookware, and everything you need." },
  { icon: "🚗", title: "Parking Included", desc: "Free parking at most locations. Underground where available." },
  { icon: "📅", title: "Flexible Terms", desc: "Stay arrangements designed around each assignment and placement." },
  { icon: "🧾", title: "Invoicing Available", desc: "Corporate invoicing, direct billing, and expense-friendly receipts." },
];

const LOCATIONS = [
  "Downtown Toronto", "Midtown Toronto", "North York", "Scarborough",
  "Etobicoke", "Mississauga", "Brampton", "Vaughan",
  "Markham", "Oakville", "Burlington", "Liberty Village",
];

const STEPS = [
  { num: "01", title: "Contact Our Corporate Team", desc: "Share your company's needs — number of units, preferred locations, timing, and budget." },
  { num: "02", title: "Get a Custom Proposal", desc: "We'll prepare a tailored housing package with corporate rates and invoicing options." },
  { num: "03", title: "Move Your Team In", desc: "Keys, Wi-Fi credentials, and a welcome package. Your people are settled from arrival." },
];

export default function CorporatePage() {
  const [scrolled, setScrolled] = useState(false);
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [moveIn, setMoveIn] = useState("");

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const handleSubmit = async () => {
    await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, phone, company, moveIn, source: "corporate" }) });
    setDone(true);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'DM Sans',system-ui,sans-serif;color:var(--ink);background:var(--paper);-webkit-font-smoothing:antialiased}
        .wrap{max-width:1200px;margin:0 auto;width:100%;padding:0 24px}
        .nav-links{display:flex;align-items:center;gap:28px}
        .nav-mobile{display:none}
        .nav-link{color:rgba(30,42,50,0.7);text-decoration:none;font-size:14px;font-weight:500;transition:color .2s ease}
        .nav-link:hover{color:var(--accent)}
        .nav-cta{background:var(--accent);color:#fff;padding:11px 22px;border-radius:999px;font-weight:700;font-size:13px;text-decoration:none;box-shadow:0 10px 22px rgba(45,43,255,0.2);transition:transform .2s ease,box-shadow .2s ease}
        .nav-cta:hover{transform:translateY(-1px);box-shadow:0 14px 26px rgba(45,43,255,0.25)}
        .hero-primary,.hero-secondary{transition:transform .2s ease,box-shadow .2s ease,background .2s ease}
        .hero-primary:hover{transform:translateY(-2px);box-shadow:0 16px 30px rgba(45,43,255,0.24)!important}
        .hero-secondary:hover{transform:translateY(-2px);background:var(--surface)!important;box-shadow:var(--shadow-soft)}
        .hospitality-card{transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease}
        .hospitality-card:hover{transform:translateY(-3px);box-shadow:var(--shadow-soft);border-color:rgba(94,129,148,0.25)!important}
        .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .form-input{width:100%;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:14px 16px;color:var(--ink);font-size:14px;outline:none;font-family:inherit;transition:border-color .2s ease,box-shadow .2s ease}
        .form-input:focus{border-color:rgba(45,43,255,0.45);box-shadow:0 0 0 4px rgba(45,43,255,0.08)}
        .form-label{display:block;font-size:11px;font-weight:600;color:rgba(30,42,50,0.5);margin-bottom:6px;letter-spacing:0.04em;text-transform:uppercase}
        .footer-link{transition:color .2s ease}
        .footer-link:hover{color:#fff!important}
        @media(max-width:768px){
          .nav-links{display:none!important}
          .nav-mobile{display:block!important}
          .who-grid{grid-template-columns:1fr!important}
          .included-grid{grid-template-columns:1fr 1fr!important}
          .location-grid{grid-template-columns:1fr 1fr!important}
          .steps-grid{grid-template-columns:1fr!important}
          .form-grid{grid-template-columns:1fr}
          .footer-cols{grid-template-columns:1fr!important}
          .hero-h1{font-size:36px!important}
        }
        @media(max-width:480px){
          .included-grid{grid-template-columns:1fr!important}
        }
      ` }} />

      <Nav scrolled={scrolled} />

      <main style={{ paddingTop: 72 }}>
        {/* Hero */}
        <section style={{ padding: "96px 24px 78px", background: "linear-gradient(145deg,var(--paper) 0%,var(--surface) 48%,var(--surface-blue) 100%)", position: "relative", overflow: "hidden", borderBottom: "1px solid var(--line)" }}>
          <div style={{ position: "absolute", top: "-28%", right: "-5%", width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle,rgba(94,129,148,0.16) 0%,rgba(94,129,148,0.04) 45%,transparent 72%)", filter: "blur(16px)" }} />
          <div style={{ position: "absolute", bottom: "-45%", left: "-10%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,rgba(196,151,88,0.12) 0%,transparent 68%)" }} />
          <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,253,249,0.74)", border: "1px solid rgba(94,129,148,0.25)", borderRadius: 100, padding: "8px 18px", marginBottom: 28, boxShadow: "0 8px 24px rgba(30,42,50,0.06)" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent2)" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent2)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Corporate &amp; Relocation</span>
            </div>
            <h1 className="hero-h1" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 58, fontWeight: 700, lineHeight: 1.03, color: "var(--ink)", letterSpacing: "-0.035em", maxWidth: 780, marginBottom: 24 }}>
              Corporate Housing &amp; Employee Relocation
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: "rgba(30,42,50,0.55)", maxWidth: 600, marginBottom: 32 }}>
              Fully furnished suites for relocating employees, project teams, and executives. Flexible terms, corporate billing, premium standard.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a className="hero-primary" href="#inquiry" style={{ padding: "16px 32px", borderRadius: 999, fontWeight: 700, fontSize: 15, textDecoration: "none", background: "var(--accent)", color: "#fff", boxShadow: "0 12px 26px rgba(45,43,255,0.2)" }}>Get a Proposal</a>
              <Link className="hero-secondary" href="/#listings" style={{ padding: "16px 32px", borderRadius: 999, fontWeight: 700, fontSize: 15, textDecoration: "none", background: "rgba(255,253,249,0.68)", color: "var(--ink)", border: "1px solid rgba(30,42,50,0.14)" }}>Browse Listings</Link>
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section style={{ padding: "88px 24px", background: "var(--paper)" }}>
          <div className="wrap">
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent2)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Who It&apos;s For</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700, color: "var(--ink)", lineHeight: 1.15 }}>Housing Solutions for Every Business Need</h2>
            </div>
            <div className="who-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
              {WHO_ITS_FOR.map(w => (
                <div className="hospitality-card" key={w.title} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 18, padding: 28, display: "flex", gap: 18, alignItems: "flex-start", boxShadow: "0 12px 32px rgba(30,42,50,0.055)" }}>
                  <span style={{ width: 52, height: 52, borderRadius: 16, background: "var(--surface-blue)", display: "grid", placeItems: "center", fontSize: 27, flexShrink: 0 }}>{w.icon}</span>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>{w.title}</div>
                    <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65 }}>{w.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section style={{ padding: "88px 24px", background: "var(--surface-blue)", borderTop: "1px solid rgba(94,129,148,0.12)", borderBottom: "1px solid rgba(94,129,148,0.12)" }}>
          <div className="wrap">
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>What&apos;s Included</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700, color: "var(--ink)", lineHeight: 1.15 }}>Everything Your Team Needs</h2>
              <p style={{ fontSize: 15, color: "var(--ink-soft)", marginTop: 12, maxWidth: 520, margin: "12px auto 0" }}>Move-in ready suites with all the essentials for productive, comfortable stays.</p>
            </div>
            <div className="included-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {WHATS_INCLUDED.map(item => (
                <div className="hospitality-card" key={item.title} style={{ background: "var(--surface)", border: "1px solid rgba(94,129,148,0.18)", borderRadius: 16, padding: 24, boxShadow: "0 12px 30px rgba(32,55,67,0.06)" }}>
                  <span style={{ fontSize: 28, display: "block", marginBottom: 12 }}>{item.icon}</span>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.65 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Locations */}
        <section style={{ padding: "88px 24px", background: "var(--surface)" }}>
          <div className="wrap">
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent2)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Locations</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700, color: "var(--ink)", lineHeight: 1.15 }}>Furnished Stays Across the GTA</h2>
              <p style={{ fontSize: 15, color: "var(--ink-soft)", marginTop: 12, maxWidth: 560, margin: "12px auto 0" }}>A growing portfolio in well-connected locations across the Greater Toronto Area and select Ontario communities.</p>
            </div>
            <div className="location-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
              {LOCATIONS.map(loc => (
                <div key={loc} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12, padding: "15px 18px", fontSize: 14, color: "var(--ink-soft)", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 22px rgba(30,42,50,0.04)" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent2)", flexShrink: 0 }} />
                  {loc}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section style={{ padding: "88px 24px", background: "var(--paper-alt)", borderTop: "1px solid rgba(196,151,88,0.12)", borderBottom: "1px solid rgba(196,151,88,0.12)" }}>
          <div className="wrap">
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>How It Works</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700, color: "var(--ink)", lineHeight: 1.15 }}>Simple Corporate Booking</h2>
            </div>
            <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
              {STEPS.map(s => (
                <div className="hospitality-card" key={s.num} style={{ position: "relative", padding: 30, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 18, boxShadow: "0 12px 32px rgba(30,42,50,0.055)" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, fontWeight: 700, background: "linear-gradient(135deg,var(--accent),var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 16 }}>{s.num}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>{s.title}</div>
                  <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Inquiry Form */}
        <section id="inquiry" style={{ padding: "92px 24px", background: "linear-gradient(145deg,var(--surface-blue) 0%,var(--paper) 74%)" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent2)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Get Started</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 38, fontWeight: 700, color: "var(--ink)", lineHeight: 1.15 }}>Request a Corporate Proposal</h2>
              <p style={{ fontSize: 15, color: "var(--ink-soft)", marginTop: 12 }}>Tell us what your team needs and our corporate team will follow up with a tailored proposal.</p>
            </div>
            {!done ? (
              <div style={{ background: "var(--surface)", border: "1px solid rgba(94,129,148,0.18)", borderRadius: 22, padding: "30px 24px", boxShadow: "0 24px 60px rgba(30,42,50,0.1)" }}>
                <div className="form-grid" style={{ marginBottom: 14 }}>
                  <div><label className="form-label">Full Name</label><input type="text" placeholder="John Smith" className="form-input" value={name} onChange={e => setName(e.target.value)} /></div>
                  <div><label className="form-label">Email</label><input type="email" placeholder="john@company.com" className="form-input" value={email} onChange={e => setEmail(e.target.value)} /></div>
                  <div><label className="form-label">Phone</label><input type="tel" placeholder="(647) 000-0000" className="form-input" value={phone} onChange={e => setPhone(e.target.value)} /></div>
                  <div><label className="form-label">Company Name</label><input type="text" placeholder="Acme Corp" className="form-input" value={company} onChange={e => setCompany(e.target.value)} /></div>
                </div>
                <div style={{ marginBottom: 14 }}><label className="form-label">Arrival Details &amp; # of Units</label><input type="text" placeholder="e.g., preferred arrival date, locations, and 3 units" className="form-input" value={moveIn} onChange={e => setMoveIn(e.target.value)} /></div>
                <button onClick={handleSubmit} style={{ width: "100%", background: "var(--accent)", color: "#fff", padding: 16, borderRadius: 999, fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 12px 26px rgba(45,43,255,0.2)" }}>Submit Corporate Inquiry</button>
                <p style={{ fontSize: 11, color: "var(--ink-faint)", textAlign: "center", marginTop: 12 }}>Direct billing available.</p>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 60, background: "var(--surface)", border: "1px solid rgba(94,129,148,0.2)", borderRadius: 22, boxShadow: "0 24px 60px rgba(30,42,50,0.1)" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 28, color: "var(--ink)", marginBottom: 8 }}>Inquiry Received</h3>
                <p style={{ fontSize: 15, color: "var(--ink-soft)" }}>Our corporate team will review your details and follow up with a custom proposal.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: "var(--night)", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "52px 24px 32px" }}>
        <div className="wrap">
          <div className="footer-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
            <div style={{ maxWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,var(--accent),var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#fff" }}>CS</div>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>CareStay Suites</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.62)", lineHeight: 1.65 }}>Premium furnished housing for healthcare professionals and corporate teams, primarily across the Greater Toronto Area.</p>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.82)", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Quick Links</div>
              {[{ label: "Browse Suites", href: "/listings" }, { label: "Healthcare", href: "/healthcare" }, { label: "Corporate", href: "/corporate" }, { label: "About", href: "/about" }, { label: "Contact", href: "/#contact" }].map(l => (
                <a className="footer-link" key={l.label} href={l.href} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.62)", textDecoration: "none", marginBottom: 8 }}>{l.label}</a>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.82)", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Contact</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.62)", marginBottom: 8 }}>info@carestaysuites.com</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.62)", marginBottom: 8 }}>35 Mariner Terrace, Toronto, ON M5V 3V9</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.62)" }}>Toronto, Ontario</p>
            </div>
          </div>
          <div style={{ marginTop: 36, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.42)" }}>&copy; 2026 CareStay Suites. All rights reserved.</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.42)" }}>Operated by BookedHosts</span>
          </div>
        </div>
      </footer>
    </>
  );
}
