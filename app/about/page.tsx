"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function Nav({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(10,12,15,0.95)" : "rgba(10,12,15,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", transition: "all 0.4s" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 72 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#0fa,#0af)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#0a0c0f" }}>CS</div>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 20, color: "#fff" }}>CareStay <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.6)" }}>Suites</span></span>
        </Link>
        <div className="nav-links">
          {[{ label: "Listings", href: "/listings" }, { label: "Healthcare", href: "/healthcare" }, { label: "Corporate", href: "/corporate" }, { label: "About", href: "/about" }, { label: "Contact", href: "/#contact" }].map(i => <a key={i.label} href={i.href} className="nav-link">{i.label}</a>)}
          <a href="/#contact" className="nav-cta">Inquire Now</a>
        </div>
        <button className="nav-mobile" onClick={() => setOpen(!open)} style={{ background: "none", border: "none", fontSize: 28, color: "#fff", cursor: "pointer" }}>{open ? "\u2715" : "\u2630"}</button>
      </div>
      {open && (
        <div style={{ background: "rgba(10,12,15,0.98)", padding: "16px 24px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {[{ label: "Listings", href: "/listings" }, { label: "Healthcare", href: "/healthcare" }, { label: "Corporate", href: "/corporate" }, { label: "About", href: "/about" }, { label: "Contact", href: "/#contact" }].map(i => <a key={i.label} href={i.href} onClick={() => setOpen(false)} style={{ display: "block", color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 17, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{i.label}</a>)}
          <a href="/#contact" onClick={() => setOpen(false)} style={{ display: "block", background: "linear-gradient(135deg,#0fa,#0af)", color: "#0a0c0f", textAlign: "center", padding: 16, borderRadius: 10, fontWeight: 700, fontSize: 16, marginTop: 16, textDecoration: "none" }}>Inquire Now</a>
        </div>
      )}
    </nav>
  );
}

const STATS = [
  { num: "90+", label: "Properties Managed" },
  { num: "6+", label: "Years Experience" },
  { num: "24/7", label: "Support Available" },
  { num: "4.9", label: "Average Rating" },
];

export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
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
        @media(max-width:768px){
          .nav-links{display:none!important}
          .nav-mobile{display:block!important}
          .about-grid{grid-template-columns:1fr!important}
          .stats-row{grid-template-columns:repeat(2,1fr)!important}
          .footer-cols{grid-template-columns:1fr!important}
        }
      `}</style>

      <Nav scrolled={scrolled} />

      <main style={{ paddingTop: 72 }}>
        {/* Hero */}
        <section style={{ padding: "80px 24px 60px", background: "linear-gradient(165deg,#0a0c0f 0%,#0d1117 40%,#0a1628 100%)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "10%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,255,170,0.06) 0%,transparent 70%)", filter: "blur(60px)" }} />
          <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,255,170,0.08)", border: "1px solid rgba(0,255,170,0.2)", borderRadius: 100, padding: "8px 18px", marginBottom: 28 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#0fa", letterSpacing: "0.06em", textTransform: "uppercase" }}>About CareStay Suites</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 52, fontWeight: 700, lineHeight: 1.08, color: "#fff", letterSpacing: "-0.03em", maxWidth: 700, marginBottom: 24 }}>Our Story</h1>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: "rgba(255,255,255,0.55)", maxWidth: 600 }}>
              From property management to purpose-built housing for the people who keep our hospitals running.
            </p>
          </div>
        </section>

        {/* Story */}
        <section style={{ padding: "80px 24px" }}>
          <div className="wrap">
            <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#0fa", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Who We Are</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 20, lineHeight: 1.2 }}>6+ Years Managing Properties Across the Greater Toronto Area</h2>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.6)", marginBottom: 20 }}>
                  BookedHosts has been managing properties primarily across the Greater Toronto Area for over 6 years. We started as a property management company, handling short-term and mid-term rentals across Ontario.
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.6)", marginBottom: 20 }}>
                  Over time, we noticed something: healthcare professionals were our best tenants — respectful, responsible, and desperate for reliable housing near their hospitals. But they kept getting burned by fake listings, lost deposits, and bait-and-switch scams.
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.6)" }}>
                  So we evolved. CareStay Suites was built specifically for nurses, physicians, and medical staff on assignment. We physically manage 90+ properties — we&apos;re not a booking platform, we&apos;re hands-on. Every property is personally inspected, professionally cleaned, and restocked by our team.
                </p>
              </div>
              <div style={{ background: "#12151a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 32 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#0fa", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>What Makes Us Different</div>
                {[
                  { icon: "🏠", title: "We Own the Process", desc: "We manage every property ourselves. No middlemen, no third-party hosts." },
                  { icon: "🔍", title: "Every Property Inspected", desc: "Our team personally visits and verifies every suite before listing." },
                  { icon: "🧹", title: "Professionally Maintained", desc: "In-house cleaning, restocking, and maintenance between every stay." },
                  { icon: "🛡️", title: "Zero Scam Guarantee", desc: "Real photos, real prices, real availability. What you see is what you get." },
                ].map((item) => (
                  <div key={item.title} style={{ display: "flex", gap: 14, marginBottom: 20 }}>
                    <span style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section style={{ padding: "60px 24px 80px", background: "#0d1117" }}>
          <div className="wrap" style={{ textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0fa", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Our Mission</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 20 }}>
              Housing that understands your assignment.
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: "rgba(255,255,255,0.5)" }}>
              Built by people who actually care how you live while you&apos;re saving lives.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section style={{ padding: "60px 24px" }}>
          <div className="wrap">
            <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
              {STATS.map((s) => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "28px 16px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700, background: "linear-gradient(135deg,#0fa,#0af)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.num}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Placeholder */}
        <section style={{ padding: "60px 24px 80px" }}>
          <div className="wrap" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0fa", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Our Team</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 12 }}>The People Behind CareStay</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", maxWidth: 500, margin: "0 auto 40px" }}>Our team of property managers, cleaners, and support staff work around the clock to keep your stay seamless.</p>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 16, padding: "48px 24px", maxWidth: 600, margin: "0 auto" }}>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }}>Team profiles coming soon</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "60px 24px", background: "#0d1117" }}>
          <div className="wrap" style={{ textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Ready to Find Your Suite?</h2>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/#listings" style={{ padding: "16px 32px", background: "linear-gradient(135deg,#0fa,#0af)", color: "#0a0c0f", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>Browse Suites</Link>
              <Link href="/#contact" style={{ padding: "16px 32px", background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>Contact Us</Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: "#0a0c0f", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "48px 24px 32px" }}>
        <div className="wrap">
          <div className="footer-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
            <div style={{ maxWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#0fa,#0af)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#0a0c0f" }}>CS</div>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>CareStay Suites</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>Premium furnished housing for healthcare professionals, primarily across the Greater Toronto Area.</p>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Quick Links</div>
              {[{ label: "Browse Suites", href: "/#listings" }, { label: "Healthcare", href: "/healthcare" }, { label: "How It Works", href: "/#about" }, { label: "Contact", href: "/#contact" }].map(l => (
                <a key={l.label} href={l.href} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none", marginBottom: 8 }}>{l.label}</a>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Contact</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>info@carestaysuites.com</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Toronto, Ontario</p>
            </div>
          </div>
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>&copy; 2026 CareStay Suites. All rights reserved.</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Operated by BookedHosts</span>
          </div>
        </div>
      </footer>
    </>
  );
}
