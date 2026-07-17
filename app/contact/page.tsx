"use client";

declare global { interface Window { fbq: (...args: unknown[]) => void; } }

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

const BOOKING_STEPS = [
  {
    num: "1",
    title: "Inquire",
    desc: "Tell us who's staying, your preferred areas, and your timing.",
  },
  {
    num: "2",
    title: "We shortlist & confirm details",
    desc: "You get matched suite options with photos, and we confirm the details together.",
  },
  {
    num: "3",
    title: "Signed agreement + self check-in",
    desc: "Every stay is confirmed on a signed agreement, with keyless self check-in instructions sent before you arrive.",
  },
];

const FAQS = [
  {
    q: "What's included in every stay?",
    a: "Every suite is professionally managed and ready for real life: fully furnished, fast wifi, keyless self check-in, housekeeping options, and 24/7 guest support — all confirmed on a signed agreement.",
  },
  {
    q: "Can I bring a pet? Is parking available?",
    a: "Pets and parking vary by property. Mention what you need in your inquiry and we'll shortlist suites that fit.",
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [area, setArea] = useState("");
  const [moveIn, setMoveIn] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Contact & Booking | CareStay Suites";
  }, []);

  const handleSubmit = async () => {
    if (!name || !email) {
      setError("Please fill in your name and email.");
      return;
    }
    setError("");
    setSending(true);
    try {
      let fullMessage = "";
      if (company) fullMessage += "Company: " + company + " — ";
      if (area) fullMessage += "Area: " + area + " — ";
      if (moveIn) fullMessage += "Move-in: " + moveIn + " — ";
      fullMessage += message;

      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message: fullMessage,
          tags: ["carestay-inquiry", "contact-page"],
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
        .contact-grid{display:grid;grid-template-columns:1.15fr 0.85fr;gap:32px;align-items:start}
        .contact-faq-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        @media(max-width:760px){
          .contact-grid{grid-template-columns:1fr}
          .contact-faq-grid{grid-template-columns:1fr}
        }
      `}</style>

      <SiteNav />

      <main>
        {/* ── Header ── */}
        <section className="section-tight" style={{ paddingBottom: 40 }}>
          <div className="wrap">
            <div className="eyebrow" style={{ marginBottom: 16 }}>Contact &amp; booking</div>
            <h1 className="h-display" style={{ fontSize: "clamp(38px, 5.5vw, 60px)", marginBottom: 20 }}>
              Book a stay.
            </h1>
            <p className="lede" style={{ maxWidth: 620 }}>
              Tell us what you need — we&apos;ll match you with the right suite and confirm
              everything on a signed agreement. Direct booking for individuals, invoicing
              available for companies.
            </p>
          </div>
        </section>

        {/* ── Form + contact info ── */}
        <section className="section-tight" style={{ paddingTop: 24 }}>
          <div className="wrap">
            <div className="contact-grid">
              {/* Left: inquiry form */}
              {!done ? (
                <div className="card" style={{ padding: "36px 32px" }}>
                  <div style={{ display: "grid", gap: 18 }}>
                    <div>
                      <label className="form-label" htmlFor="contact-name">Name *</label>
                      <input id="contact-name" type="text" className="form-input" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="contact-email">Email *</label>
                      <input id="contact-email" type="email" className="form-input" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="contact-phone">Phone</label>
                      <input id="contact-phone" type="tel" className="form-input" placeholder="(647) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="contact-company">Company (optional)</label>
                      <input id="contact-company" type="text" className="form-input" placeholder="Company name, if booking for work" value={company} onChange={(e) => setCompany(e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="contact-area">Preferred area</label>
                      <input id="contact-area" type="text" className="form-input" placeholder="e.g., Downtown, Harbourfront, near your project" value={area} onChange={(e) => setArea(e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="contact-movein">Preferred move-in</label>
                      <input id="contact-movein" type="text" className="form-input" placeholder="e.g., early September" value={moveIn} onChange={(e) => setMoveIn(e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="contact-message">Anything else we should know?</label>
                      <textarea
                        id="contact-message"
                        className="form-input"
                        rows={4}
                        placeholder="Who's staying, what you need nearby, pets, parking — a few lines is plenty."
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
                <div className="card" style={{ padding: "56px 32px", textAlign: "center" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <CheckCircle2 size={26} color="var(--accent)" strokeWidth={2} />
                  </div>
                  <h3 className="h-display" style={{ fontSize: 26, marginBottom: 10 }}>Inquiry sent</h3>
                  <p className="lede" style={{ fontSize: 16 }}>We&apos;ll get back to you within 24 hours.</p>
                </div>
              )}

              {/* Right: contact details + how booking works */}
              <div style={{ display: "grid", gap: 24, alignContent: "start" }}>
                <div className="card" style={{ padding: "30px 28px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Mail size={19} color="var(--accent)" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="form-label" style={{ marginBottom: 2 }}>Email</div>
                      <a href="mailto:info@carestaysuites.com" style={{ fontSize: 15.5, fontWeight: 600, color: "var(--ink)", textDecoration: "none" }}>
                        info@carestaysuites.com
                      </a>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <MapPin size={19} color="var(--accent)" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="form-label" style={{ marginBottom: 2 }}>Address</div>
                      <div style={{ fontSize: 15.5, fontWeight: 600, color: "var(--ink)" }}>
                        35 Mariner Terrace, Toronto ON
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ padding: "30px 28px" }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)", marginBottom: 18 }}>How booking works</div>
                  <div style={{ display: "grid", gap: 18 }}>
                    {BOOKING_STEPS.map((s) => (
                      <div key={s.num} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13.5, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
                          {s.num}
                        </div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 3 }}>{s.title}</div>
                          <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink-soft)" }}>{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: "22px 26px", background: "var(--accent-soft)", borderRadius: "var(--radius)" }}>
                  <Link href="/corporate" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 700, color: "var(--accent)", textDecoration: "none" }}>
                    Companies: ask about invoice billing and multi-suite placements
                    <ArrowRight size={16} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ echo ── */}
        <section className="section-tight" style={{ background: "var(--surface)", borderTop: "1px solid var(--line)" }}>
          <div className="wrap">
            <div className="eyebrow" style={{ marginBottom: 28 }}>Good to know</div>
            <div className="contact-faq-grid">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>{f.q}</div>
                  <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--ink-soft)", maxWidth: 480 }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
