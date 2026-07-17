"use client";

declare global { interface Window { fbq: (...args: unknown[]) => void; } }

import { useState, useEffect, useRef, ReactNode } from "react";
import Link from "next/link";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import {
  ShieldCheck,
  KeyRound,
  Wifi,
  Sparkles,
  Headphones,
  Building2,
  Briefcase,
  Umbrella,
  Clapperboard,
  ChevronDown,
} from "lucide-react";

/* ─── Types ─── */
interface Listing {
  id: number | string;
  title: string;
  location: string;
  img: string;
  price: number;
  beds: number;
  baths: number;
  maxGuests: number;
  bedrooms: number;
  reviewCount: number;
  reviewAvg: number;
  availabilityStatus: string;
}

interface SiteSettings {
  statProperties?: string;
  statHealthcarePros?: string;
  statHospitalPartnerships?: string;
  statAverageRating?: string;
}

const AVAILABILITY_STYLES: Record<string, { color: string; bg: string }> = {
  Available: { color: "#0E7C4A", bg: "#E7F5EE" },
  "Almost Booked": { color: "#B45309", bg: "#FDF0E0" },
  "Waitlist Only": { color: "#1D4ED8", bg: "#E8EEFC" },
  Booked: { color: "#B91C1C", bg: "#FBE9E9" },
};

function availabilityStyle(status: string) {
  return AVAILABILITY_STYLES[status] || { color: "#0E7C4A", bg: "#E7F5EE" };
}

/* ─── Hooks ─── */
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

function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s` }}>
      {children}
    </div>
  );
}

/* ─── Responsive rules ─── */
function PageStyles() {
  return <style>{`
    .home-hero-grid{display:grid;grid-template-columns:1.05fr 0.95fr;gap:56px;align-items:center}
    .home-trust-row{display:flex;flex-wrap:wrap;gap:20px 36px;justify-content:space-between;align-items:center}
    .home-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
    .home-who-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
    .home-suites-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
    .home-form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    @media(max-width:1020px){
      .home-who-grid{grid-template-columns:repeat(2,1fr)}
      .home-suites-grid{grid-template-columns:repeat(2,1fr)}
    }
    @media(max-width:760px){
      .home-hero-grid{grid-template-columns:1fr;gap:36px}
      .home-trust-row{justify-content:flex-start}
      .home-stats-grid{grid-template-columns:repeat(2,1fr)}
      .home-who-grid{grid-template-columns:1fr}
      .home-suites-grid{grid-template-columns:1fr}
      .home-form-row{grid-template-columns:1fr}
    }
  `}</style>;
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section className="section" style={{ paddingTop: 72 }}>
      <div className="wrap">
        <div className="home-hero-grid">
          <div>
            <FadeIn>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Corporate housing in Toronto</div>
            </FadeIn>
            <FadeIn delay={0.08}>
              <h1 className="h-display" style={{ fontSize: "clamp(40px, 6vw, 64px)" }}>
                Furnished stays for professionals in Toronto.
              </h1>
            </FadeIn>
            <FadeIn delay={0.16}>
              <p className="lede" style={{ margin: "24px 0 36px", maxWidth: 480 }}>
                Fully equipped suites, flexible terms, keyless self check-in — and every stay on a signed agreement.
              </p>
            </FadeIn>
            <FadeIn delay={0.24}>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link href="/listings" className="btn-primary">Find your suite</Link>
                <Link href="/corporate" className="btn-ghost">For companies</Link>
              </div>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <div style={{ position: "relative" }}>
              <div className="photo-slot" style={{ aspectRatio: "4/5" }}>[SUITE_PHOTO]</div>
              <div style={{ position: "absolute", bottom: 18, left: 18, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 999, padding: "10px 18px", fontSize: 13, fontWeight: 600, color: "var(--ink-soft)", boxShadow: "var(--shadow)" }}>
                Professionally managed · Toronto
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── Trust band ─── */
const TRUST_ITEMS: { icon: ReactNode; label: string }[] = [
  { icon: <ShieldCheck size={20} strokeWidth={1.75} />, label: "Professionally managed" },
  { icon: <KeyRound size={20} strokeWidth={1.75} />, label: "Keyless self check-in" },
  { icon: <Wifi size={20} strokeWidth={1.75} />, label: "Fast wifi" },
  { icon: <Sparkles size={20} strokeWidth={1.75} />, label: "Housekeeping options" },
  { icon: <Headphones size={20} strokeWidth={1.75} />, label: "24/7 guest support" },
];

function TrustBand() {
  return (
    <section style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", background: "var(--surface)" }}>
      <div className="wrap" style={{ padding: "28px 24px" }}>
        <div className="home-trust-row">
          {TRUST_ITEMS.map((t) => (
            <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "var(--accent)", display: "inline-flex" }}>{t.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-soft)" }}>{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Stats strip ─── */
function StatsStrip({ settings }: { settings: SiteSettings | null }) {
  const stats = [
    { n: settings?.statProperties || "60+", l: "Properties managed" },
    { n: settings?.statHealthcarePros || "150+", l: "Professionals housed" },
    { n: settings?.statHospitalPartnerships || "30+", l: "Corporate & insurance partners" },
    { n: settings?.statAverageRating || "4.9", l: "Average guest rating" },
  ];
  return (
    <section className="section-tight">
      <div className="wrap">
        <div className="home-stats-grid">
          {stats.map((s, i) => (
            <FadeIn key={s.l} delay={i * 0.08}>
              <div style={{ textAlign: "center" }}>
                <div className="h-display" style={{ fontSize: 44, color: "var(--accent)" }}>{s.n}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-faint)", marginTop: 6 }}>{s.l}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Who stays with us ─── */
const AUDIENCES: { icon: ReactNode; title: string; desc: string }[] = [
  {
    icon: <Building2 size={24} strokeWidth={1.75} />,
    title: "Relocations & new hires",
    desc: "Moving someone to Toronto? We set your new hires and transferring employees up in a fully equipped suite, so arrival is about the job — not the logistics.",
  },
  {
    icon: <Briefcase size={24} strokeWidth={1.75} />,
    title: "Consultants on contract",
    desc: "A dedicated workspace, fast wifi, and a real kitchen — everything you need to settle in and do the work. Stays that fit your assignment, however it evolves.",
  },
  {
    icon: <Umbrella size={24} strokeWidth={1.75} />,
    title: "Insurance & displaced homeowners",
    desc: "The care in our name started here. When a claim displaces a household, we move fast to place them somewhere that feels like home, working directly with adjusters throughout.",
  },
  {
    icon: <Clapperboard size={24} strokeWidth={1.75} />,
    title: "Film & project crews",
    desc: "Multi-suite placements for productions and project teams, coordinated through a single point of contact. Terms that flex when the schedule does.",
  },
];

function WhoStays() {
  return (
    <section className="section" style={{ background: "var(--surface)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <div className="wrap">
        <FadeIn>
          <div style={{ marginBottom: 48, maxWidth: 560 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Who stays with us</div>
            <h2 className="h-display" style={{ fontSize: "clamp(30px, 4vw, 42px)" }}>Built for the way professionals actually move.</h2>
          </div>
        </FadeIn>
        <div className="home-who-grid">
          {AUDIENCES.map((a, i) => (
            <FadeIn key={a.title} delay={i * 0.08}>
              <div className="card" style={{ padding: 28, height: "100%" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  {a.icon}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 20, marginBottom: 10, color: "var(--ink)" }}>{a.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--ink-soft)" }}>{a.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Suites ─── */
function SuitesSection() {
  const [listings, setListings] = useState<Listing[]>([]);
  useEffect(() => {
    fetch("/api/listings")
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "success" && data.listings) {
          setListings(
            data.listings.map((l: { id: number | string; title: string; location: string; img: string; price: number; beds: number; baths: number; maxGuests?: number; bedrooms?: number; reviewCount?: number; reviewAvg?: number; availabilityStatus?: string }) => ({
              id: l.id,
              title: l.title,
              location: l.location,
              img: l.img,
              price: l.price,
              beds: l.beds,
              baths: l.baths,
              maxGuests: l.maxGuests || 0,
              bedrooms: l.bedrooms || 0,
              reviewCount: l.reviewCount || 0,
              reviewAvg: l.reviewAvg || 0,
              availabilityStatus: l.availabilityStatus || "Available",
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const shown = listings.slice(0, 6);

  return (
    <section className="section">
      <div className="wrap">
        <FadeIn>
          <div style={{ marginBottom: 48, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
            <div style={{ maxWidth: 560 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>The suites</div>
              <h2 className="h-display" style={{ fontSize: "clamp(30px, 4vw, 42px)" }}>Move-in ready, down to the coffee cups.</h2>
            </div>
            <Link href="/listings" className="btn-ghost">View all suites</Link>
          </div>
        </FadeIn>
        <div className="home-suites-grid">
          {shown.length > 0
            ? shown.map((l, i) => {
                const badge = availabilityStyle(l.availabilityStatus);
                const specs = [
                  l.maxGuests ? `${l.maxGuests} guest${l.maxGuests !== 1 ? "s" : ""}` : null,
                  l.bedrooms ? `${l.bedrooms} bedroom${l.bedrooms !== 1 ? "s" : ""}` : null,
                  l.beds ? `${l.beds} bed${l.beds !== 1 ? "s" : ""}` : null,
                  l.baths ? `${l.baths} bath${l.baths !== 1 ? "s" : ""}` : null,
                ].filter(Boolean).join(" · ");
                return (
                  <FadeIn key={l.id} delay={i * 0.06}>
                    <Link href={`/listings/${l.id}`} style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}>
                      <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                        <div style={{ position: "relative" }}>
                          <img src={l.img} alt={l.title} style={{ width: "100%", height: 230, objectFit: "cover", display: "block" }} />
                          <span style={{ position: "absolute", top: 14, left: 14, background: badge.bg, color: badge.color, padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                            {l.availabilityStatus}
                          </span>
                        </div>
                        <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
                          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 21, color: "var(--ink)", marginBottom: 4 }}>{l.title}</h3>
                          <p style={{ fontSize: 14, color: "var(--ink-faint)", marginBottom: 8 }}>{l.location}</p>
                          {specs && <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 8 }}>{specs}</p>}
                          {l.reviewCount > 0 && (
                            <p style={{ fontSize: 13, color: "#B98900", fontWeight: 600, marginBottom: 8 }}>
                              ★ {l.reviewAvg.toFixed(1)} · {l.reviewCount} review{l.reviewCount !== 1 ? "s" : ""}
                            </p>
                          )}
                          <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 20, color: "var(--ink)" }}>
                              From ${l.price.toLocaleString()}
                            </span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>View suite →</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </FadeIn>
                );
              })
            : [0, 1, 2].map((i) => (
                <FadeIn key={i} delay={i * 0.06}>
                  <div className="card">
                    <div className="photo-slot" style={{ aspectRatio: "4/3", borderRadius: 0 }}>[SUITE_PHOTO]</div>
                    <div style={{ padding: "20px 22px 22px" }}>
                      <div style={{ height: 14, width: "60%", background: "var(--surface-warm)", borderRadius: 6, marginBottom: 10 }} />
                      <div style={{ height: 12, width: "40%", background: "var(--surface-warm)", borderRadius: 6 }} />
                    </div>
                  </div>
                </FadeIn>
              ))}
        </div>
      </div>
    </section>
  );
}

/* ─── For companies ─── */
function CompaniesBand() {
  const points = [
    "Direct booking or invoice",
    "Multi-suite placements",
    "One point of contact",
    "Stays that flex with project timelines",
  ];
  return (
    <section className="section" style={{ background: "var(--accent-soft)" }}>
      <div className="wrap" style={{ textAlign: "center" }}>
        <FadeIn>
          <div className="eyebrow" style={{ marginBottom: 14 }}>For companies</div>
          <h2 className="h-display" style={{ fontSize: "clamp(30px, 4vw, 44px)", maxWidth: 620, margin: "0 auto" }}>
            Housing your team can move into tomorrow.
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, margin: "28px auto 36px", maxWidth: 720 }}>
            {points.map((p) => (
              <span key={p} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 999, padding: "9px 18px", fontSize: 14, fontWeight: 600, color: "var(--ink-soft)" }}>
                {p}
              </span>
            ))}
          </div>
          <Link href="/corporate" className="btn-primary">Talk to us</Link>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
const FAQS = [
  {
    q: "What's included in every suite?",
    a: "Full furniture, a full kitchen, linens and towels, fast wifi, a smart TV, a dedicated workspace, and keyless entry — with utilities included. You arrive with a suitcase; everything else is handled.",
  },
  {
    q: "How does booking work?",
    a: "Send an inquiry and we'll confirm the details with you directly. Every stay is on a signed agreement, and you'll receive self check-in instructions before arrival. Companies can also book by invoice.",
  },
  {
    q: "Pets and parking?",
    a: "It varies by property. Tell us what you need and we'll match you with a suite that works.",
  },
];

function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Good to know</div>
            <h2 className="h-display" style={{ fontSize: "clamp(30px, 4vw, 40px)" }}>Questions, answered.</h2>
          </div>
        </FadeIn>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQS.map((f, i) => {
            const open = openIdx === i;
            return (
              <FadeIn key={f.q} delay={i * 0.06}>
                <div className="card" style={{ boxShadow: open ? "var(--shadow)" : "none" }}>
                  <button
                    onClick={() => setOpenIdx(open ? null : i)}
                    aria-expanded={open}
                    style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, background: "none", border: "none", cursor: "pointer", padding: "20px 24px", textAlign: "left", fontFamily: "var(--font-body)" }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>{f.q}</span>
                    <ChevronDown size={18} strokeWidth={2} style={{ color: "var(--ink-faint)", flexShrink: 0, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                  </button>
                  {open && (
                    <p style={{ padding: "0 24px 22px", fontSize: 15, lineHeight: 1.7, color: "var(--ink-soft)" }}>{f.a}</p>
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Contact / inquiry ─── */
function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) { setError("Please enter your email so we can reach you."); return; }
    setError("");
    setSending(true);
    try {
      const fullMessage = company ? `Company: ${company} — ${message}` : message;
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message: fullMessage, tags: ["carestay-inquiry", "homepage"] }),
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
    <section id="contact" className="section" style={{ background: "var(--surface)", borderTop: "1px solid var(--line)" }}>
      <div className="wrap" style={{ maxWidth: 680 }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Get in touch</div>
            <h2 className="h-display" style={{ fontSize: "clamp(30px, 4vw, 40px)" }}>Tell us what you need.</h2>
            <p className="lede" style={{ marginTop: 14 }}>We&apos;ll come back with options that fit — usually within 24 hours.</p>
          </div>
        </FadeIn>
        {!done ? (
          <FadeIn delay={0.1}>
            <div className="card" style={{ padding: 32 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="home-form-row">
                  <div>
                    <label className="form-label" htmlFor="inq-name">Name</label>
                    <input id="inq-name" type="text" className="form-input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="inq-email">Email *</label>
                    <input id="inq-email" type="email" className="form-input" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <div className="home-form-row">
                  <div>
                    <label className="form-label" htmlFor="inq-phone">Phone</label>
                    <input id="inq-phone" type="tel" className="form-input" placeholder="(416) 555-0100" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="inq-company">Company (optional)</label>
                    <input id="inq-company" type="text" className="form-input" placeholder="Company name" value={company} onChange={(e) => setCompany(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="form-label" htmlFor="inq-message">Message</label>
                  <textarea id="inq-message" className="form-input" rows={4} style={{ resize: "vertical" }} placeholder="Who's staying, where you need to be, and anything else we should know." value={message} onChange={(e) => setMessage(e.target.value)} />
                </div>
                {error && <p style={{ fontSize: 14, color: "#B91C1C" }}>{error}</p>}
                <button onClick={handleSubmit} disabled={sending} className="btn-primary" style={{ width: "100%", opacity: sending ? 0.7 : 1 }}>
                  {sending ? "Sending..." : "Send inquiry"}
                </button>
              </div>
            </div>
          </FadeIn>
        ) : (
          <FadeIn>
            <div className="card" style={{ padding: 48, textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#E7F5EE", color: "#0E7C4A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 18px" }}>✓</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 26, color: "var(--ink)", marginBottom: 8 }}>Inquiry received.</h3>
              <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.6 }}>Thanks — a member of our team will be in touch within 24 hours.</p>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

/* ─── Page ─── */
export default function Home() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    document.title = "CareStay Suites — Furnished Stays for Professionals in Toronto";
  }, []);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => { if (d.status === "success") setSettings(d.settings); })
      .catch(() => {});
  }, []);

  return (
    <>
      <PageStyles />
      <SiteNav />
      <Hero />
      <TrustBand />
      <StatsStrip settings={settings} />
      <WhoStays />
      <SuitesSection />
      <CompaniesBand />
      <FaqSection />
      <ContactSection />
      <SiteFooter />
    </>
  );
}
