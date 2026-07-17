"use client";

declare global { interface Window { fbq: (...args: unknown[]) => void; } }

import { useState, useEffect } from "react";
import { FileText, Building2, CalendarClock, ShieldCheck, ArrowRight } from "lucide-react";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

const VALUE_CARDS = [
  {
    icon: FileText,
    title: "Invoice billing",
    desc: "Book by invoice with net terms — no personal credit cards, no expense-report gymnastics for your team.",
  },
  {
    icon: Building2,
    title: "Multi-suite placements",
    desc: "Several suites across Toronto under one agreement, with one contact who knows your whole account.",
  },
  {
    icon: CalendarClock,
    title: "Flexible placements",
    desc: "Extend or wind down as projects change. Stays flex with your timelines, not the other way around.",
  },
  {
    icon: ShieldCheck,
    title: "Duty of care",
    desc: "Professionally managed suites with keyless entry, 24/7 guest support, and a signed agreement for every stay.",
  },
];

const AUDIENCES = [
  {
    title: "Relocations & new hires",
    desc: "A settled landing place while your people find their footing in a new city.",
  },
  {
    title: "Consultants on contract",
    desc: "Central, work-ready suites with fast wifi for professionals on client engagements.",
  },
  {
    title: "Insurance placements & displaced homeowners",
    desc: "Fast, caring placements that feel like home for families displaced by loss or damage.",
  },
  {
    title: "Film & project crews",
    desc: "Suites near set and site for productions and project teams, coordinated through one contact.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Tell us the brief",
    desc: "How many people, which areas of the city, and your timing. A few lines is enough to start.",
  },
  {
    num: "02",
    title: "We shortlist suites",
    desc: "You get a set of options with photos within a business day, matched to your brief.",
  },
  {
    num: "03",
    title: "Sign & move in",
    desc: "One agreement, an invoice if you need it, and self check-in details sent straight to your team.",
  },
];

export default function CorporatePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "For Companies | CareStay Suites — Corporate Housing Toronto";
  }, []);

  const handleSubmit = async () => {
    if (!name || !email || !company) {
      setError("Please fill in your name, work email, and company.");
      return;
    }
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message: "Company: " + company + " — " + message,
          tags: ["corporate-inquiry", "for-companies-page"],
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      if (typeof window !== "undefined" && window.fbq) { window.fbq("track", "Lead"); }
      setDone(true);
    } catch {
      setError("Something went wrong — please try again or email us directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <style>{`
        .corp-hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
        .corp-value-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
        .corp-audience-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
        .corp-steps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
        @media(max-width:980px){
          .corp-value-grid{grid-template-columns:1fr 1fr}
        }
        @media(max-width:760px){
          .corp-hero-grid{grid-template-columns:1fr;gap:36px}
          .corp-value-grid{grid-template-columns:1fr}
          .corp-audience-grid{grid-template-columns:1fr}
          .corp-steps-grid{grid-template-columns:1fr}
        }
      `}</style>

      <SiteNav />

      <main>
        {/* ── Hero ── */}
        <section className="section">
          <div className="wrap">
            <div className="corp-hero-grid">
              <div>
                <div className="eyebrow" style={{ marginBottom: 16 }}>For companies &amp; partners</div>
                <h1 className="h-display" style={{ fontSize: "clamp(38px, 5.5vw, 60px)", marginBottom: 20 }}>
                  Team housing, handled.
                </h1>
                <p className="lede" style={{ maxWidth: 480, marginBottom: 32 }}>
                  One contact, invoice billing available, and multi-suite placements across
                  Toronto — with stays that flex with your project timelines.
                </p>
                <a href="#corporate-form" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  Start an inquiry <ArrowRight size={17} strokeWidth={2.5} />
                </a>
              </div>
              <div className="photo-slot" style={{ aspectRatio: "4/3" }}>[SUITE_PHOTO]</div>
            </div>
          </div>
        </section>

        {/* ── Value grid ── */}
        <section className="section-tight" style={{ background: "var(--surface)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
          <div className="wrap">
            <div style={{ marginBottom: 44 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Why companies book with us</div>
              <h2 className="h-display" style={{ fontSize: "clamp(28px, 4vw, 38px)", maxWidth: 560 }}>
                Built for the way businesses actually book.
              </h2>
            </div>
            <div className="corp-value-grid">
              {VALUE_CARDS.map((c) => (
                <div key={c.title} className="card" style={{ padding: 28 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    <c.icon size={22} color="var(--accent)" strokeWidth={2} />
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: "var(--ink)" }}>{c.title}</div>
                  <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--ink-soft)" }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Who we host ── */}
        <section className="section">
          <div className="wrap">
            <div style={{ marginBottom: 44 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Who we host</div>
              <h2 className="h-display" style={{ fontSize: "clamp(28px, 4vw, 38px)", maxWidth: 560 }}>
                Placements for every kind of team.
              </h2>
            </div>
            <div className="corp-audience-grid">
              {AUDIENCES.map((a) => (
                <div key={a.title} style={{ padding: "26px 28px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius)", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)" }}>{a.title}</div>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink-soft)" }}>{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="section-tight" style={{ background: "var(--surface)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
          <div className="wrap">
            <div style={{ marginBottom: 44 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>How it works</div>
              <h2 className="h-display" style={{ fontSize: "clamp(28px, 4vw, 38px)", maxWidth: 560 }}>
                From brief to move-in, without the back-and-forth.
              </h2>
            </div>
            <div className="corp-steps-grid">
              {STEPS.map((s) => (
                <div key={s.num}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 500, color: "var(--accent)", lineHeight: 1, marginBottom: 16 }}>{s.num}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>{s.title}</div>
                  <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--ink-soft)", maxWidth: 320 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Lead form ── */}
        <section id="corporate-form" className="section">
          <div className="wrap" style={{ maxWidth: 688 }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Start an inquiry</div>
              <h2 className="h-display" style={{ fontSize: "clamp(28px, 4vw, 38px)" }}>Tell us what your team needs.</h2>
              <p className="lede" style={{ marginTop: 14 }}>
                Share the brief and we&apos;ll come back with a shortlist of suites.
              </p>
            </div>

            {!done ? (
              <div className="card" style={{ padding: "36px 32px", maxWidth: 640, margin: "0 auto" }}>
                <div style={{ display: "grid", gap: 18 }}>
                  <div>
                    <label className="form-label" htmlFor="corp-name">Name *</label>
                    <input id="corp-name" type="text" className="form-input" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="corp-email">Work email *</label>
                    <input id="corp-email" type="email" className="form-input" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="corp-phone">Phone</label>
                    <input id="corp-phone" type="tel" className="form-input" placeholder="(647) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="corp-company">Company *</label>
                    <input id="corp-company" type="text" className="form-input" placeholder="Company name" value={company} onChange={(e) => setCompany(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="corp-message">What do you need?</label>
                    <textarea
                      id="corp-message"
                      className="form-input"
                      rows={4}
                      placeholder="How many people, preferred areas, timing — a few lines is plenty."
                      style={{ resize: "vertical" }}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  {error && <p style={{ fontSize: 14, color: "#B3261E", margin: 0 }}>{error}</p>}
                  <button className="btn-primary" onClick={handleSubmit} disabled={sending} style={{ width: "100%", opacity: sending ? 0.7 : 1 }}>
                    {sending ? "Sending…" : "Send inquiry"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: "56px 32px", maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <ShieldCheck size={26} color="var(--accent)" strokeWidth={2} />
                </div>
                <h3 className="h-display" style={{ fontSize: 26, marginBottom: 10 }}>Inquiry received</h3>
                <p className="lede" style={{ fontSize: 16 }}>Thanks — we&apos;ll come back to you within one business day.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
