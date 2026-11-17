"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Icon, SkylineScene } from "./illustrations";
import { SUITES, type Suite } from "./suites";
import "./landing.css";

export const NAV_LINKS = [
  { label: "Suites", href: "/listings" },
  { label: "Business", href: "/corporate" },
  { label: "Couples", href: "/couples" },
  { label: "Healthcare", href: "/healthcare" },
  { label: "About", href: "/about" },
];

export function LandingNav({ cta }: { cta: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`lp-nav${scrolled ? " is-scrolled" : ""}`}>
      <div className="lp-wrap lp-nav-row">
        <Link href="/" className="lp-logo" aria-label="CareStay Suites home">
          <span className="lp-logo-mark">CS</span>
          <span className="lp-logo-word">CareStay <em>Suites</em></span>
        </Link>
        <div className="lp-nav-links">
          {NAV_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          <a href="#inquiry" className="lp-btn lp-btn--sm">{cta}</a>
        </div>
        <button className="lp-nav-toggle" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
      </div>
      {open && (
        <div className="lp-nav-drawer">
          {NAV_LINKS.map((l) => <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>)}
          <a href="#inquiry" className="lp-btn" onClick={() => setOpen(false)}>{cta}</a>
        </div>
      )}
    </nav>
  );
}

export function StickyCta({ label, note }: { label: string; note: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const form = document.getElementById("inquiry");
      const pastHero = window.scrollY > 520;
      const atForm = form ? form.getBoundingClientRect().top < window.innerHeight * 0.9 : false;
      setShow(pastHero && !atForm);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={`lp-sticky${show ? " is-on" : ""}`} aria-hidden={!show}>
      <span>{note}</span>
      <a href="#inquiry" className="lp-btn lp-btn--sm" tabIndex={show ? 0 : -1}>{label}</a>
    </div>
  );
}

export function SectionHead({ eyebrow, title, sub, center = false }: { eyebrow: string; title: ReactNode; sub?: ReactNode; center?: boolean }) {
  return (
    <div className={`lp-head${center ? " lp-head--center" : ""}`}>
      <div className="lp-eyebrow">{eyebrow}</div>
      <h2 className="lp-h2">{title}</h2>
      {sub && <p className="lp-sub">{sub}</p>}
    </div>
  );
}

function SuiteCard({ suite, mode, onAsk }: { suite: Suite; mode: "business" | "couples"; onAsk: (name: string) => void }) {
  const [active, setActive] = useState(0);
  const features = mode === "business" ? suite.business : suite.couples;
  const tagline = mode === "business" ? suite.businessTagline : suite.couplesTagline;
  return (
    <article className="lp-suite">
      <div className="lp-suite-media">
        <img src={suite.photos[active].src} alt={suite.photos[active].alt} loading="lazy" />
        <span className="lp-suite-area"><Icon name="pin" size={16} /> {suite.area}</span>
      </div>
      <div className="lp-suite-thumbs" role="tablist" aria-label={`${suite.name} photos`}>
        {suite.photos.map((p, i) => (
          <button key={p.src} role="tab" aria-selected={i === active} aria-label={p.alt} className={i === active ? "is-on" : ""} onClick={() => setActive(i)}>
            <img src={p.src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
      <div className="lp-suite-body">
        <div className="lp-suite-top">
          <h3>{suite.name}</h3>
          <span className="lp-suite-meta">1 bedroom · sleeps {suite.sleeps}</span>
        </div>
        <p className="lp-suite-tag">{tagline}</p>
        <ul className="lp-suite-features">
          {features.map((f) => <li key={f}><Icon name="check" size={18} />{f}</li>)}
        </ul>
        <div className="lp-suite-actions">
          <Link href={`/listings/${suite.id}`} className="lp-btn lp-btn--ghost lp-btn--sm">See dates + photos</Link>
          <button className="lp-btn lp-btn--sm" onClick={() => onAsk(suite.name)}>{mode === "business" ? "Ask for my weekly rate" : "Plan our stay here"}</button>
        </div>
      </div>
    </article>
  );
}

export function SuitesSection({ mode, eyebrow, title, sub, onAsk }: { mode: "business" | "couples"; eyebrow: string; title: ReactNode; sub: ReactNode; onAsk: (name: string) => void }) {
  return (
    <section className="lp-section lp-section--alt" id="suites">
      <div className="lp-wrap">
        <SectionHead eyebrow={eyebrow} title={title} sub={sub} center />
        <div className="lp-suites">
          {SUITES.map((s) => <SuiteCard key={s.id} suite={s} mode={mode} onAsk={onAsk} />)}
          <article className="lp-suite lp-suite--soon">
            <SkylineScene />
            <div className="lp-suite-body">
              <span className="lp-pill">Coming soon</span>
              <h3>More Toronto suites</h3>
              <p className="lp-suite-tag">New suites are being added in Toronto. Guests on the list get first pick before they go public.</p>
              <button className="lp-btn lp-btn--ghost lp-btn--sm" onClick={() => onAsk("Waitlist: new Toronto suites")}>Get first pick</button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export function Steps({ steps }: { steps: { title: string; body: string; icon: string }[] }) {
  return (
    <ol className="lp-steps">
      {steps.map((s, i) => (
        <li key={s.title}>
          <div className="lp-step-num">{String(i + 1).padStart(2, "0")}</div>
          <Icon name={s.icon} size={40} />
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="lp-faq">
      {items.map((f) => (
        <details key={f.q}>
          <summary>{f.q}<span aria-hidden="true">+</span></summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function LandingFooter({ line }: { line: string }) {
  return (
    <footer className="lp-footer">
      <div className="lp-wrap lp-footer-grid">
        <div>
          <Link href="/" className="lp-logo lp-logo--light"><span className="lp-logo-mark">CS</span><span className="lp-logo-word">CareStay <em>Suites</em></span></Link>
          <p>{line}</p>
        </div>
        <div>
          <h4>Stays</h4>
          {NAV_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
        </div>
        <div>
          <h4>Contact</h4>
          <a href="mailto:info@carestaysuites.com">info@carestaysuites.com</a>
          <p>Toronto, Ontario</p>
        </div>
      </div>
      <div className="lp-wrap lp-footer-base">
        <span>© {new Date().getFullYear()} CareStay Suites</span>
        <span>Operated by BookedHosts</span>
      </div>
    </footer>
  );
}

export type SubmitState = "idle" | "sending" | "done" | "error";

export async function sendInquiry(payload: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    return res.ok;
  } catch {
    return false;
  }
}

export function scrollToForm() {
  document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
