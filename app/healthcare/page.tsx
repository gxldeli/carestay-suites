"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function Nav({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(255,253,249,0.97)" : "rgba(255,253,249,0.93)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--line)", boxShadow: scrolled ? "0 10px 30px rgba(23,38,48,0.06)" : "none", transition: "all 0.4s" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 72 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg,var(--accent),var(--accent2))", boxShadow: "0 8px 18px rgba(45,43,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#fff" }}>CS</div>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 20, color: "var(--ink)" }}>CareStay <span style={{ fontWeight: 400, color: "var(--ink-soft)" }}>Suites</span></span>
        </Link>
        <div className="nav-links">
          {[{ label: "Listings", href: "/listings" }, { label: "Healthcare", href: "/healthcare" }, { label: "Corporate", href: "/corporate" }, { label: "About", href: "/about" }, { label: "Contact", href: "/#contact" }].map(i => <a key={i.label} href={i.href} className="nav-link">{i.label}</a>)}
          <a href="/#contact" className="nav-cta">Inquire Now</a>
        </div>
        <button className="nav-mobile" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)} style={{ background: "none", border: "none", fontSize: 28, color: "var(--ink)", cursor: "pointer" }}>{open ? "\u2715" : "\u2630"}</button>
      </div>
      {open && (
        <div style={{ background: "rgba(255,253,249,0.98)", padding: "16px 24px 24px", borderTop: "1px solid var(--line)", boxShadow: "0 18px 30px rgba(23,38,48,0.08)" }}>
          {[{ label: "Listings", href: "/listings" }, { label: "Healthcare", href: "/healthcare" }, { label: "Corporate", href: "/corporate" }, { label: "About", href: "/about" }, { label: "Contact", href: "/#contact" }].map(i => <a key={i.label} href={i.href} onClick={() => setOpen(false)} style={{ display: "block", color: "rgba(30,42,50,0.8)", textDecoration: "none", fontSize: 17, padding: "14px 0", borderBottom: "1px solid rgba(30,42,50,0.06)" }}>{i.label}</a>)}
          <a href="/#contact" onClick={() => setOpen(false)} style={{ display: "block", background: "var(--accent)", color: "#fff", textAlign: "center", padding: 16, borderRadius: 999, fontWeight: 700, fontSize: 16, marginTop: 16, textDecoration: "none", boxShadow: "0 10px 24px rgba(45,43,255,0.2)" }}>Inquire Now</a>
        </div>
      )}
    </nav>
  );
}

const PAIN_POINTS = [
  { icon: "🚫", title: "Fake Listings", desc: "Photos stolen from other sites. You show up and the place doesn't exist." },
  { icon: "💸", title: "Deposit Scams", desc: "Wire money upfront, landlord disappears. Thousands gone." },
  { icon: "👻", title: "No-Show Landlords", desc: "Confirmed move-in, nobody answers. You're stranded in a new city." },
  { icon: "📋", title: "Lease Traps", desc: "Hidden fees, early termination penalties, and impossible break clauses." },
  { icon: "🧺", title: "No Laundry", desc: "After a 12-hour shift, the last thing you need is a laundromat run." },
  { icon: "🍳", title: "No Kitchen", desc: "Meal prepping is survival — you need a real, fully-equipped kitchen." },
];

const CARESTAY_STANDARD = [
  { icon: "🏠", name: "Fully Furnished", desc: "Comfortable living spaces ready for your assignment." },
  { icon: "🔑", name: "Easy Check-In", desc: "A straightforward arrival after a demanding day." },
  { icon: "📶", name: "Connected", desc: "Reliable Wi-Fi for work, calls, and downtime." },
  { icon: "🌙", name: "Rest-Friendly", desc: "Comfortable spaces designed for recovery and routine." },
  { icon: "💬", name: "Responsive Support", desc: "A local team available to help throughout the stay." },
];

const HOSPITALS = [
  "Toronto General Hospital", "SickKids", "Mount Sinai Hospital", "Sunnybrook Health Sciences",
  "St. Michael's Hospital", "Princess Margaret Cancer Centre", "Humber River Hospital",
  "Scarborough Health Network", "North York General", "Credit Valley Hospital",
  "Trillium Health Partners", "Mackenzie Health", "Joseph Brant Hospital",
  "Brampton Civic Hospital", "Toronto Western Hospital",
];

const STEPS = [
  { num: "01", title: "Tell Us Your Assignment", desc: "Share your hospital, preferred arrival date, and stay needs. We'll match you with nearby suites." },
  { num: "02", title: "Tour & Approve", desc: "Virtual or in-person walkthrough. See exactly what you're getting — no surprises." },
  { num: "03", title: "Move In & Focus", desc: "Arrive, get connected, and settle into your furnished suite." },
];

export default function HealthcarePage() {
  const [scrolled, setScrolled] = useState(false);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [hospital, setHospital] = useState("");
  const [moveIn, setMoveIn] = useState("");

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const handleSubmit = async () => {
    if (!email) { setSubmitError("Please add your email address."); return; }
    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, phone, hospital, moveIn, source: "healthcare" }) });
      if (!response.ok) throw new Error("Inquiry could not be sent");
      setDone(true);
    } catch {
      setSubmitError("We couldn’t send that inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
        .nav-link{color:rgba(30,42,50,0.7);text-decoration:none;font-size:14px;font-weight:500}
        .nav-link:hover{color:var(--accent)}
        .nav-cta{background:var(--accent);color:#fff;padding:10px 22px;border-radius:999px;font-weight:700;font-size:13px;text-decoration:none;box-shadow:0 8px 20px rgba(45,43,255,0.18)}
        .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .form-input{width:100%;background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:13px 16px;color:var(--ink);font-size:14px;outline:none;font-family:inherit;transition:border-color .2s,box-shadow .2s}
        .form-input:focus{border-color:rgba(45,43,255,0.4)}
        .form-label{display:block;font-size:11px;font-weight:600;color:rgba(30,42,50,0.5);margin-bottom:6px;letter-spacing:0.04em;text-transform:uppercase}
        @media(max-width:768px){
          .nav-links{display:none!important}
          .nav-mobile{display:block!important}
          .pain-grid{grid-template-columns:1fr!important}
          .standard-grid{grid-template-columns:1fr 1fr!important}
          .hospital-grid{grid-template-columns:1fr 1fr!important}
          .steps-grid{grid-template-columns:1fr!important}
          .form-grid{grid-template-columns:1fr}
          .footer-cols{grid-template-columns:1fr!important}
          .hero-h1{font-size:36px!important}
        }
        @media(max-width:480px){
          .standard-grid{grid-template-columns:1fr!important}
        }
      ` }} />

      <Nav scrolled={scrolled} />

      <main style={{ paddingTop: 72 }}>
        {/* Hero */}
        <section style={{ padding: "80px 24px 60px", background: "linear-gradient(155deg,#f7f3ed 0%,#fffdf9 48%,#e8eff3 100%)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "10%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(45,43,255,0.06) 0%,transparent 70%)", filter: "blur(60px)" }} />
          <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(45,43,255,0.08)", border: "1px solid rgba(45,43,255,0.2)", borderRadius: 100, padding: "8px 18px", marginBottom: 28 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.06em", textTransform: "uppercase" }}>For Healthcare Professionals</span>
            </div>
            <h1 className="hero-h1" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 56, fontWeight: 700, lineHeight: 1.04, color: "var(--ink)", letterSpacing: "-0.03em", maxWidth: 700, marginBottom: 24 }}>
              Housing Built for Healthcare Professionals
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: "rgba(30,42,50,0.55)", maxWidth: 600, marginBottom: 32 }}>
              Fully furnished suites near major hospitals and medical hubs, with clear details and responsive local support.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#inquiry" style={{ padding: "16px 32px", borderRadius: 999, fontWeight: 700, fontSize: 15, textDecoration: "none", background: "var(--accent)", color: "#fff", boxShadow: "0 12px 28px rgba(45,43,255,0.22)" }}>Find Your Suite</a>
              <Link href="/#listings" style={{ padding: "16px 32px", borderRadius: 999, fontWeight: 700, fontSize: 15, textDecoration: "none", background: "var(--surface)", color: "var(--ink)", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}>Browse Listings</Link>
            </div>
          </div>
        </section>

        {/* Pain Points */}
        <section style={{ padding: "80px 24px", background: "var(--paper)" }}>
          <div className="wrap">
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#f66", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>The Problem</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700, color: "var(--ink)", lineHeight: 1.15 }}>Finding housing shouldn&apos;t be this hard</h2>
              <p style={{ fontSize: 15, color: "var(--ink-soft)", marginTop: 12, maxWidth: 520, margin: "12px auto 0" }}>Healthcare workers on assignment face the same housing challenges over and over.</p>
            </div>
            <div className="pain-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {PAIN_POINTS.map(p => (
                <div key={p.title} style={{ background: "var(--surface)", border: "1px solid rgba(164,81,63,0.14)", borderRadius: 18, padding: 24, boxShadow: "var(--shadow-sm)" }}>
                  <span style={{ fontSize: 28, display: "block", marginBottom: 12 }}>{p.icon}</span>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.6 }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CareStay Standard */}
        <section style={{ padding: "80px 24px", background: "var(--surface-blue)" }}>
          <div className="wrap">
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>The CareStay Standard</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700, color: "var(--ink)", lineHeight: 1.15 }}>Thoughtful Comforts for Demanding Schedules</h2>
              <p style={{ fontSize: 15, color: "var(--ink-soft)", marginTop: 12, maxWidth: 520, margin: "12px auto 0" }}>A consistent hospitality standard, with exact amenities shown on each suite listing.</p>
            </div>
            <div className="standard-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14 }}>
              {CARESTAY_STANDARD.map(item => (
                <div key={item.name} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 18, padding: "26px 16px", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hospitality detail band */}
        <div style={{ background: "var(--night)", borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "22px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.76)" }}><span style={{ color: "#d9c3ad", fontWeight: 700 }}>Every property is different.</span> Review the listing or ask our team about the amenities that matter to you.</p>
        </div>

        {/* Hospital Proximity */}
        <section style={{ padding: "80px 24px", background: "var(--paper)" }}>
          <div className="wrap">
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Near Your Hospital</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700, color: "var(--ink)", lineHeight: 1.15 }}>Suites Near Major Hospitals</h2>
              <p style={{ fontSize: 15, color: "var(--ink-soft)", marginTop: 12, maxWidth: 520, margin: "12px auto 0" }}>Ask about current options near these facilities and surrounding neighbourhoods.</p>
            </div>
            <div className="hospital-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
              {HOSPITALS.map(h => (
                <div key={h} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, padding: "15px 18px", fontSize: 14, color: "var(--ink-soft)", display: "flex", alignItems: "center", gap: 10, boxShadow: "var(--shadow-sm)" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
                  {h}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section style={{ padding: "80px 24px", background: "var(--paper-alt)" }}>
          <div className="wrap">
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>How It Works</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700, color: "var(--ink)", lineHeight: 1.15 }}>Three Steps to Your New Home</h2>
            </div>
            <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
              {STEPS.map(s => (
                <div key={s.num} style={{ position: "relative", padding: 30, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 18, boxShadow: "var(--shadow-sm)" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, fontWeight: 700, background: "linear-gradient(135deg,var(--accent),var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 16 }}>{s.num}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>{s.title}</div>
                  <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Inquiry Form */}
        <section id="inquiry" style={{ padding: "80px 24px", background: "var(--surface-blue)" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Get Started</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 38, fontWeight: 700, color: "var(--ink)", lineHeight: 1.15 }}>Find Your Suite</h2>
              <p style={{ fontSize: 15, color: "rgba(30,42,50,0.5)", marginTop: 12 }}>Tell us about your assignment and we&apos;ll follow up with the next steps.</p>
            </div>
            {!done ? (
              <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 22, padding: "30px 24px", boxShadow: "var(--shadow-md)" }}>
                <div className="form-grid" style={{ marginBottom: 14 }}>
                  <div><label className="form-label">Full Name</label><input type="text" placeholder="Jane Smith" className="form-input" value={name} onChange={e => setName(e.target.value)} /></div>
                  <div><label className="form-label">Email</label><input type="email" placeholder="jane@hospital.ca" className="form-input" value={email} onChange={e => setEmail(e.target.value)} /></div>
                  <div><label className="form-label">Phone</label><input type="tel" placeholder="(647) 000-0000" className="form-input" value={phone} onChange={e => setPhone(e.target.value)} /></div>
                  <div><label className="form-label">Hospital / Facility</label><input type="text" placeholder="Toronto General" className="form-input" value={hospital} onChange={e => setHospital(e.target.value)} /></div>
                </div>
                <div style={{ marginBottom: 14 }}><label className="form-label">Preferred Move-in Date</label><input type="text" placeholder="e.g., April 15" className="form-input" value={moveIn} onChange={e => setMoveIn(e.target.value)} /></div>
                {submitError && <p role="alert" style={{ color: "#a13c34", fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{submitError}</p>}
                <button onClick={handleSubmit} disabled={submitting} style={{ width: "100%", background: "var(--accent)", color: "#fff", padding: 16, borderRadius: 999, fontWeight: 800, fontSize: 16, border: "none", cursor: submitting ? "wait" : "pointer", opacity: submitting ? .7 : 1, fontFamily: "inherit", boxShadow: "0 10px 24px rgba(45,43,255,0.2)" }}>{submitting ? "Sending…" : "Submit Inquiry"}</button>
                <p style={{ fontSize: 11, color: "rgba(30,42,50,0.38)", textAlign: "center", marginTop: 12 }}>We&apos;ll be in touch. No spam, ever.</p>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 60, background: "var(--surface)", border: "1px solid rgba(45,43,255,0.15)", borderRadius: 22, boxShadow: "var(--shadow-md)" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 28, color: "var(--ink)", marginBottom: 8 }}>Application Received</h3>
                <p style={{ fontSize: 15, color: "rgba(30,42,50,0.5)" }}>We&apos;ll follow up with available suites and next steps.</p>
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
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,var(--accent),var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#fff" }}>CS</div>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>CareStay Suites</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", lineHeight: 1.6 }}>Premium furnished housing for healthcare professionals, primarily across the Greater Toronto Area.</p>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.78)", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Quick Links</div>
              {[{ label: "Browse Suites", href: "/listings" }, { label: "Healthcare", href: "/healthcare" }, { label: "Corporate", href: "/corporate" }, { label: "About", href: "/about" }, { label: "Contact", href: "/#contact" }].map(l => (
                <a key={l.label} href={l.href} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.58)", textDecoration: "none", marginBottom: 8 }}>{l.label}</a>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.78)", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Contact</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", marginBottom: 8 }}>info@carestaysuites.com</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", marginBottom: 8 }}>35 Mariner Terrace, Toronto, ON M5V 3V9</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)" }}>Toronto, Ontario</p>
            </div>
          </div>
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.42)" }}>&copy; 2026 CareStay Suites. All rights reserved.</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.42)" }}>Operated by BookedHosts</span>
          </div>
        </div>
      </footer>
    </>
  );
}
