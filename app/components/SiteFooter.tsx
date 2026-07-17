"use client";

import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer style={{ background: "var(--surface)", borderTop: "1px solid var(--line)", padding: "72px 0 36px" }}>
      <style>{`
        .foot-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:48px}
        @media(max-width:760px){.foot-grid{grid-template-columns:1fr;gap:36px}}
      `}</style>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "#fff" }}>CS</div>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 19, color: "var(--ink)" }}>
                CareStay <span style={{ fontWeight: 400, color: "var(--ink-soft)" }}>Suites</span>
              </span>
            </div>
            <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.7, maxWidth: 340 }}>
              Furnished stays for professionals in Toronto. Corporate housing, relocations, insurance placements, and
              project teams — every stay professionally managed, on a signed agreement.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-faint)", marginBottom: 14, letterSpacing: "0.08em", textTransform: "uppercase" }}>Explore</div>
            {[
              { label: "Suites", href: "/listings" },
              { label: "For Companies", href: "/corporate" },
              { label: "About", href: "/about" },
              { label: "Contact & Booking", href: "/contact" },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ display: "block", color: "var(--ink-soft)", textDecoration: "none", fontSize: 14, padding: "5px 0" }}>
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-faint)", marginBottom: 14, letterSpacing: "0.08em", textTransform: "uppercase" }}>Contact</div>
            <a href="mailto:info@carestaysuites.com" style={{ display: "block", color: "var(--ink-soft)", textDecoration: "none", fontSize: 14, padding: "5px 0" }}>
              info@carestaysuites.com
            </a>
            <p style={{ color: "var(--ink-soft)", fontSize: 14, padding: "5px 0", lineHeight: 1.6 }}>
              35 Mariner Terrace
              <br />
              Toronto, ON M5V 3V9
            </p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--line)", marginTop: 48, paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 13, color: "var(--ink-faint)" }}>
            © {new Date().getFullYear()} CareStay Suites. All rights reserved.
          </span>
          <span style={{ fontSize: 13, color: "var(--ink-faint)" }}>Part of the BookedHosts family of brands.</span>
        </div>
      </div>
    </footer>
  );
}
