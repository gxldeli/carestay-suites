"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function Nav({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(255,253,249,0.95)" : "rgba(255,253,249,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(30,42,50,0.06)", transition: "all 0.4s" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 72 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,var(--accent),var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#fff" }}>CS</div>
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
          <a href="/#contact" onClick={() => setOpen(false)} style={{ display: "block", background: "var(--accent)", color: "#fff", textAlign: "center", padding: 16, borderRadius: 999, fontWeight: 700, fontSize: 16, marginTop: 16, textDecoration: "none" }}>Inquire Now</a>
        </div>
      )}
    </nav>
  );
}

const STATS = [
  { num: "Local", label: "Operations Team" },
  { num: "Direct", label: "Guest Support" },
  { num: "Clear", label: "Suite Details" },
  { num: "Flexible", label: "Stay Arrangements" },
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
      <style dangerouslySetInnerHTML={{ __html: `
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'DM Sans',system-ui,sans-serif;color:var(--ink);background:var(--paper);-webkit-font-smoothing:antialiased}
        .wrap{max-width:1200px;margin:0 auto;width:100%;padding:0 24px}
        .nav-links{display:flex;align-items:center;gap:28px}
        .nav-mobile{display:none}
        .nav-link{color:var(--ink-soft);text-decoration:none;font-size:14px;font-weight:600}
        .nav-link:hover{color:var(--accent)}
        .nav-cta{background:var(--accent);color:#fff;padding:10px 22px;border-radius:999px;font-weight:700;font-size:13px;text-decoration:none}
        @media(max-width:768px){
          .nav-links{display:none!important}
          .nav-mobile{display:block!important}
          .about-grid{grid-template-columns:1fr!important}
          .stats-row{grid-template-columns:repeat(2,1fr)!important}
          .footer-cols{grid-template-columns:1fr!important}
        }
      ` }} />

      <Nav scrolled={scrolled} />

      <main style={{ paddingTop: 72 }}>
        {/* Hero */}
        <section style={{ padding: "80px 24px 60px", background: "linear-gradient(155deg,#f7f3ed 0%,#fffdf9 48%,#e8eff3 100%)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "10%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(45,43,255,0.06) 0%,transparent 70%)", filter: "blur(60px)" }} />
          <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(45,43,255,0.08)", border: "1px solid rgba(45,43,255,0.2)", borderRadius: 100, padding: "8px 18px", marginBottom: 28 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.06em", textTransform: "uppercase" }}>About CareStay Suites</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 52, fontWeight: 700, lineHeight: 1.08, color: "var(--ink)", letterSpacing: "-0.03em", maxWidth: 700, marginBottom: 24 }}>Our Story</h1>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: "rgba(30,42,50,0.55)", maxWidth: 600 }}>
              A guest-first hospitality brand shaped by years of hands-on property management.
            </p>
          </div>
        </section>

        {/* Story */}
        <section style={{ padding: "80px 24px", background: "var(--surface)" }}>
          <div className="wrap">
            <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Who We Are</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 700, color: "var(--ink)", marginBottom: 20, lineHeight: 1.2 }}>Hands-On Property Management Across the Greater Toronto Area</h2>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(30,42,50,0.6)", marginBottom: 20 }}>
                  CareStay Suites grew from the BookedHosts property-management operation. That experience shaped a practical approach to furnished stays: real homes, clear communication, and responsive local support.
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(30,42,50,0.6)", marginBottom: 20 }}>
                  Healthcare professionals first showed us how difficult it can be to find reliable furnished housing near work. The same need exists for relocating professionals, insurance placements, consultants, and project teams.
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(30,42,50,0.6)" }}>
                  CareStay was built to make that process feel simpler and more dependable. We&apos;re not just a listing directory: the guest experience is supported by a hands-on local operations team.
                </p>
              </div>
              <div style={{ background: "var(--surface-blue)", border: "1px solid var(--line)", borderRadius: 20, padding: 32, boxShadow: "var(--shadow)" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>What Makes Us Different</div>
                {[
                  { icon: "🏠", title: "Hands-On Management", desc: "A local operations team supports the stay from inquiry through departure." },
                  { icon: "🔍", title: "Every Property Inspected", desc: "Our team personally visits and verifies every suite before listing." },
                  { icon: "🧹", title: "Professionally Maintained", desc: "In-house cleaning, restocking, and maintenance between every stay." },
                  { icon: "🛡️", title: "Verified Listings", desc: "Clear photos, property details, and direct support from the CareStay team." },
                ].map((item) => (
                  <div key={item.title} style={{ display: "flex", gap: 14, marginBottom: 20 }}>
                    <span style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section style={{ padding: "60px 24px 80px", background: "var(--night)" }}>
          <div className="wrap" style={{ textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#9bb6c4", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Our Mission</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 20 }}>
              Housing that understands your assignment.
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: "rgba(255,255,255,0.65)" }}>
              Make furnished stays feel considered, dependable, and easy to navigate.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section style={{ padding: "60px 24px" }}>
          <div className="wrap">
            <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
              {STATS.map((s) => (
                <div key={s.label} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 16, padding: "28px 16px", textAlign: "center", boxShadow: "var(--shadow)" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700, background: "linear-gradient(135deg,var(--accent),var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.num}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 4, fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Placeholder */}
        <section style={{ padding: "60px 24px 80px", background: "var(--surface-blue)" }}>
          <div className="wrap" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Our Team</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 700, color: "var(--ink)", marginBottom: 12 }}>The People Behind CareStay</h2>
            <p style={{ fontSize: 15, color: "rgba(30,42,50,0.55)", maxWidth: 560, margin: "0 auto 32px" }}>Property managers, cleaners, maintenance partners, and guest-support staff work together to keep every stay running smoothly.</p>
            <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 16, padding: "32px 24px", maxWidth: 600, margin: "0 auto", boxShadow: "var(--shadow)" }}>
              <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.7 }}>Local property care. Responsive guest support. One team accountable for the details.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "60px 24px", background: "var(--paper-alt)" }}>
          <div className="wrap" style={{ textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "var(--ink)", marginBottom: 16 }}>Ready to Find Your Suite?</h2>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/listings" style={{ padding: "16px 32px", background: "var(--accent)", color: "#fff", borderRadius: 999, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>Browse Suites</Link>
              <Link href="/#contact" style={{ padding: "16px 32px", background: "var(--surface)", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: 999, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>Contact Us</Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: "var(--night)", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "48px 24px 32px" }}>
        <div className="wrap">
          <div className="footer-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
            <div style={{ maxWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,var(--accent),var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#fff" }}>CS</div>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>CareStay Suites</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", lineHeight: 1.6 }}>Professionally managed furnished stays for professionals and organizations across the Greater Toronto Area.</p>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.82)", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Quick Links</div>
              {[{ label: "Browse Suites", href: "/listings" }, { label: "Healthcare", href: "/healthcare" }, { label: "Corporate", href: "/corporate" }, { label: "How It Works", href: "/#how-it-works" }, { label: "Contact", href: "/#contact" }].map(l => (
                <a key={l.label} href={l.href} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.58)", textDecoration: "none", marginBottom: 8 }}>{l.label}</a>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.82)", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Contact</div>
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
