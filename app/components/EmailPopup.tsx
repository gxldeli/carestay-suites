"use client";

import { useState, useEffect } from "react";

const HOSPITALS = [
  "Toronto General / UHN",
  "Sunnybrook",
  "SickKids",
  "Mount Sinai",
  "St. Michael's",
  "Humber River",
  "Scarborough Health",
  "North York General",
  "Credit Valley",
  "Trillium Health",
  "Other",
  "Not Sure Yet",
];

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
  const [hospital, setHospital] = useState("");

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
      body: JSON.stringify({ name, email, hospital, tags: ["carestay-waitlist", "email-popup"] }),
    });
    setSubmitted(true);
    setTimeout(() => setShow(false), 2000);
  };

  const close = () => setShow(false);

  if (!show) return null;

  const heading = settings?.emailPopupHeading || "Be First to Know";
  const subtext = settings?.emailPopupSubtext || "New suites drop regularly. Join healthcare professionals across Canada already on our list.";

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: "12px 14px",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: "none" as const,
    WebkitAppearance: "none" as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='rgba(255,255,255,0.4)' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    paddingRight: 32,
    cursor: "pointer",
  };

  return (
    <>
      <style>{`
        .popup-overlay{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.7);backdrop-filter:blur(6px)}
        .popup-desktop{background:#12151a;border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:36px 32px;max-width:460px;width:calc(100% - 48px);position:relative}
        .popup-mobile-bar{position:fixed;bottom:0;left:0;right:0;z-index:10000;background:#12151a;border-top:1px solid rgba(255,255,255,0.08);padding:20px 20px 28px;border-radius:20px 20px 0 0}
        @media(max-width:640px){.popup-overlay{display:none!important}.popup-mobile-bar{display:block!important}}
        @media(min-width:641px){.popup-mobile-bar{display:none!important}}
      `}</style>

      {/* Desktop: centered modal */}
      <div className="popup-overlay" onClick={close}>
        <div className="popup-desktop" onClick={(e) => e.stopPropagation()}>
          <button onClick={close} style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>✕</button>
          {!submitted ? (
            <>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{heading}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: 22 }}>{subtext}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input type="text" placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
                <input type="email" placeholder="Email *" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                <select value={hospital} onChange={(e) => setHospital(e.target.value)} style={selectStyle}>
                  <option value="">Hospital / Facility</option>
                  {HOSPITALS.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <button onClick={handleSubmit} style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,#0fa,#0af)", color: "#0a0c0f", borderRadius: 10, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                  Join the Waitlist
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>✓</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>You&apos;re on the list!</div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: slide-up bar */}
      <div className="popup-mobile-bar">
        <button onClick={close} style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>✕</button>
        {!submitted ? (
          <>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{heading}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="email" placeholder="Email *" value={email} onChange={(e) => setEmail(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              <button onClick={handleSubmit} style={{ padding: "12px 20px", background: "linear-gradient(135deg,#0fa,#0af)", color: "#0a0c0f", borderRadius: 10, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                Join
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "8px 0", fontSize: 15, fontWeight: 700, color: "#0fa" }}>✓ You&apos;re on the list!</div>
        )}
      </div>
    </>
  );
}
