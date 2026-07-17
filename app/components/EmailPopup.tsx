"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "carestay-popup-shown";

export default function EmailPopup() {
  const [settings, setSettings] = useState<{
    emailPopupEnabled?: boolean;
    emailPopupDelay?: number;
    emailPopupScrollTrigger?: number;
    emailPopupHeading?: string;
    emailPopupSubtext?: string;
  } | null>(null);
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY)) return;
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.status === "success") setSettings(d.settings);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!settings || settings.emailPopupEnabled === false) return;
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY)) return;

    const delay = (settings.emailPopupDelay ?? 5) * 1000;
    const scrollPct = settings.emailPopupScrollTrigger ?? 50;
    let triggered = false;

    const trigger = () => {
      if (triggered) return;
      triggered = true;
      setShow(true);
      sessionStorage.setItem(STORAGE_KEY, "1");
      window.removeEventListener("scroll", onScroll);
    };

    const timer = setTimeout(trigger, delay);

    const onScroll = () => {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrolled >= scrollPct) trigger();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [settings]);

  const handleSubmit = async () => {
    if (!email) return;
    await fetch("/api/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, tags: ["carestay-waitlist", "email-popup"] }),
    });
    setSubmitted(true);
    setTimeout(() => setShow(false), 2000);
  };

  const close = () => setShow(false);

  if (!show) return null;

  const heading = settings?.emailPopupHeading || "Be First to Know";
  const subtext = settings?.emailPopupSubtext || "New suites open regularly across Toronto. Join the list and we'll let you know first.";

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#fff",
    border: "1.5px solid var(--line)",
    borderRadius: 12,
    padding: "12px 14px",
    color: "var(--ink)",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
  };

  return (
    <>
      <style>{`
        .popup-overlay{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;background:rgba(28,27,26,0.45);backdrop-filter:blur(6px)}
        .popup-desktop{background:var(--bg);border:1px solid var(--line);border-radius:20px;padding:36px 32px;max-width:460px;width:calc(100% - 48px);position:relative;box-shadow:var(--shadow-lift)}
        .popup-mobile-bar{position:fixed;bottom:0;left:0;right:0;z-index:10000;background:var(--bg);border-top:1px solid var(--line);padding:20px 20px 28px;border-radius:20px 20px 0 0;box-shadow:0 -10px 40px rgba(28,27,26,0.15)}
        @media(max-width:640px){.popup-overlay{display:none!important}.popup-mobile-bar{display:block!important}}
        @media(min-width:641px){.popup-mobile-bar{display:none!important}}
      `}</style>

      {/* Desktop: centered modal */}
      <div className="popup-overlay" onClick={close}>
        <div className="popup-desktop" onClick={(e) => e.stopPropagation()}>
          <button onClick={close} style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", color: "var(--ink-faint)", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>✕</button>
          {!submitted ? (
            <>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>{heading}</h3>
              <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6, marginBottom: 22 }}>{subtext}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input type="text" placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
                <input type="email" placeholder="Email *" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                <button onClick={handleSubmit} className="btn-primary" style={{ width: "100%" }}>
                  Keep me posted
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 10, color: "var(--accent)" }}>✓</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)" }}>You&apos;re on the list!</div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: slide-up bar */}
      <div className="popup-mobile-bar">
        <button onClick={close} style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", color: "var(--ink-faint)", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>✕</button>
        {!submitted ? (
          <>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 10 }}>{heading}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="email" placeholder="Email *" value={email} onChange={(e) => setEmail(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              <button onClick={handleSubmit} className="btn-primary" style={{ padding: "12px 20px", fontSize: 14, whiteSpace: "nowrap" }}>
                Join
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "8px 0", fontSize: 15, fontWeight: 700, color: "var(--accent)" }}>✓ You&apos;re on the list!</div>
        )}
      </div>
    </>
  );
}
