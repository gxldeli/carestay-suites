"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const LINKS = [
  { label: "Suites", href: "/listings" },
  { label: "For Companies", href: "/corporate" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: scrolled ? "rgba(250,248,245,0.92)" : "rgba(250,248,245,0.75)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
        transition: "background 0.25s, border-color 0.25s",
      }}
    >
      <style>{`
        .nav-links-d{display:flex;align-items:center;gap:32px}
        .nav-burger{display:none}
        @media(max-width:820px){.nav-links-d{display:none}.nav-burger{display:block}}
      `}</style>
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 11, textDecoration: "none" }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 15,
              color: "#fff",
              letterSpacing: "0.02em",
            }}
          >
            CS
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 21, color: "var(--ink)" }}>
            CareStay <span style={{ fontWeight: 400, color: "var(--ink-soft)" }}>Suites</span>
          </span>
        </Link>

        <div className="nav-links-d">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} style={{ color: "var(--ink-soft)", textDecoration: "none", fontSize: 15, fontWeight: 600 }}>
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className="btn-primary" style={{ padding: "11px 24px", fontSize: 14 }}>
            Book a stay
          </Link>
        </div>

        <button
          className="nav-burger"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          style={{ background: "none", border: "none", fontSize: 26, color: "var(--ink)", cursor: "pointer", lineHeight: 1 }}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div style={{ background: "var(--bg)", borderTop: "1px solid var(--line)", padding: "8px 24px 24px" }}>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ display: "block", color: "var(--ink)", textDecoration: "none", fontSize: 17, fontWeight: 600, padding: "14px 0", borderBottom: "1px solid var(--line)" }}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)} className="btn-primary" style={{ display: "block", textAlign: "center", marginTop: 18 }}>
            Book a stay
          </Link>
        </div>
      )}
    </nav>
  );
}
