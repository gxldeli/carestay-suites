"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, KeyRound, Sparkles } from "lucide-react";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Verified & scam-free",
    desc: "Real photos, real availability, real agreements. What you see is what you get — no bait-and-switch, no lost deposits.",
  },
  {
    icon: KeyRound,
    title: "Operated, not listed",
    desc: "We manage the buildings we host in. One team handles everything from your first inquiry to checkout — no middlemen, no third-party hosts.",
  },
  {
    icon: Sparkles,
    title: "Guest-first details",
    desc: "Fast wifi, real workspaces, keyless self check-in, and housekeeping options — the details that make a suite feel like yours.",
  },
];

export default function AboutPage() {
  useEffect(() => {
    document.title = "About | CareStay Suites";
  }, []);

  return (
    <>
      <style>{`
        .about-story{display:grid;grid-template-columns:1.05fr 1fr;gap:64px;align-items:center}
        .about-values{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
        .about-cta-btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
        @media(max-width:760px){
          .about-story{grid-template-columns:1fr;gap:40px}
          .about-values{grid-template-columns:1fr}
        }
      `}</style>

      <SiteNav />

      <main>
        {/* Hero */}
        <section className="section-tight">
          <div className="wrap">
            <div className="eyebrow" style={{ marginBottom: 18 }}>About CareStay</div>
            <h1 className="h-display" style={{ fontSize: "clamp(38px, 6vw, 60px)", maxWidth: 720, marginBottom: 22 }}>
              A guest brand built by operators.
            </h1>
            <p className="lede" style={{ maxWidth: 620 }}>
              CareStay Suites is the guest-facing brand of the BookedHosts operation — the team that manages the
              properties, owner relationships, and day-to-day hospitality across Toronto.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="section" style={{ paddingTop: 32 }}>
          <div className="wrap">
            <div className="about-story">
              <div>
                <div className="eyebrow" style={{ marginBottom: 16 }}>Our story</div>
                <h2 className="h-display" style={{ fontSize: "clamp(28px, 4vw, 38px)", marginBottom: 20 }}>
                  The &ldquo;Care&rdquo; in our name is earned.
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--ink-soft)", marginBottom: 18 }}>
                  We started by housing professionals with demanding schedules — people who needed a reliable place to
                  land, without fake listings or bait-and-switch surprises. That heritage still shapes how we run stays
                  for insurance placements and displaced families today: patiently, personally, and on clear terms.
                </p>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--ink-soft)", marginBottom: 18 }}>
                  Today we host corporate relocations, consultants on contract, film and project crews, and companies
                  placing their people across the Greater Toronto Area — with flexible terms, from project stays to
                  extended placements.
                </p>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--ink-soft)" }}>
                  Every suite is professionally managed by our own team, and every stay is on a signed agreement.
                </p>
              </div>
              <div className="photo-slot" style={{ aspectRatio: "4/3" }}>[SUITE_PHOTO]</div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section" style={{ background: "var(--surface)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
          <div className="wrap">
            <div className="eyebrow" style={{ marginBottom: 16 }}>How we operate</div>
            <h2 className="h-display" style={{ fontSize: "clamp(28px, 4vw, 38px)", marginBottom: 40, maxWidth: 560 }}>
              What you can hold us to.
            </h2>
            <div className="about-values">
              {VALUES.map((v) => (
                <div key={v.title} className="card" style={{ padding: 32 }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 12,
                      background: "var(--accent-soft)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                    }}
                  >
                    <v.icon size={22} color="var(--accent)" strokeWidth={2} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", marginBottom: 10 }}>{v.title}</h3>
                  <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--ink-soft)" }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BookedHosts band */}
        <section className="section-tight">
          <div className="wrap">
            <div
              style={{
                background: "var(--surface-warm)",
                borderRadius: "var(--radius)",
                padding: "40px 36px",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 20,
              }}
            >
              <div style={{ maxWidth: 640 }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 24, color: "var(--ink)", marginBottom: 10 }}>
                  Looking for our owner-facing side?
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--ink-soft)" }}>
                  BookedHosts manages properties on behalf of owners across Toronto — and CareStay Suites is the guest
                  brand where corporate clients and their people stay.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section" style={{ paddingTop: 48 }}>
          <div className="wrap" style={{ textAlign: "center" }}>
            <h2 className="h-display" style={{ fontSize: "clamp(28px, 4vw, 40px)", marginBottom: 14 }}>
              Ready when you are.
            </h2>
            <p className="lede" style={{ maxWidth: 480, margin: "0 auto 32px" }}>
              Browse our suites, or talk to us about placing your team.
            </p>
            <div className="about-cta-btns">
              <Link href="/listings" className="btn-primary">Find your suite</Link>
              <Link href="/corporate" className="btn-ghost">For companies</Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
