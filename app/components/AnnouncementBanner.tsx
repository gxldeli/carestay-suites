"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "carestay-banner-dismissed";

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");
  const [buttonText, setButtonText] = useState("Join");
  const [linkUrl, setLinkUrl] = useState("/#contact");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY)) return;
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.status === "success" && d.settings?.bannerEnabled !== false) {
          setText(d.settings.bannerText || "🏥 New suites dropping soon — join the waitlist");
          setButtonText(d.settings.bannerButtonText || "Join");
          setLinkUrl(d.settings.bannerLinkUrl || "/#contact");
          setVisible(true);
        }
      })
      .catch(() => {});
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  useEffect(() => {
    if (visible) document.body.classList.add("has-banner");
    else document.body.classList.remove("has-banner");
    return () => document.body.classList.remove("has-banner");
  }, [visible]);

  if (!visible) return null;

  return (
    <>
    <style>{`.has-banner{padding-top:40px}.has-banner nav{top:40px!important}`}</style>
    <div
      id="announcement-banner"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: "#111827",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: "0 48px 0 16px",
      }}
    >
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {text}
      </span>
      <a
        href={linkUrl}
        onClick={dismiss}
        style={{
          flexShrink: 0,
          padding: "4px 14px",
          background: "linear-gradient(135deg,#0fa,#0af)",
          color: "#0a0c0f",
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 700,
          textDecoration: "none",
          lineHeight: "20px",
        }}
      >
        {buttonText}
      </a>
      <button
        onClick={dismiss}
        aria-label="Dismiss banner"
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.35)",
          fontSize: 18,
          cursor: "pointer",
          lineHeight: 1,
          padding: 4,
        }}
      >
        ✕
      </button>
    </div>
    </>
  );
}
