"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "carestay-banner-dismissed";

export default function AnnouncementBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");
  const [buttonText, setButtonText] = useState("Join");
  const [linkUrl, setLinkUrl] = useState("/#contact");

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      setVisible(false);
      return;
    }
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY)) {
      setVisible(false);
      return;
    }
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.status === "success" && d.settings?.bannerEnabled !== false) {
          const legacyText = "🏥 New suites dropping soon — join the waitlist";
          const usesLegacyMessage = !d.settings.bannerText || d.settings.bannerText === legacyText;
          setText(usesLegacyMessage ? "Furnished stays across the GTA" : d.settings.bannerText);
          setButtonText(usesLegacyMessage && (!d.settings.bannerButtonText || d.settings.bannerButtonText === "Join") ? "Inquire" : d.settings.bannerButtonText || "Learn More");
          const configuredLink = d.settings.bannerLinkUrl || "/#contact";
          setLinkUrl(configuredLink.startsWith("#") ? `/${configuredLink}` : configuredLink);
          setVisible(true);
        } else {
          setVisible(false);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  useEffect(() => {
    if (visible && !pathname.startsWith("/admin")) document.body.classList.add("has-banner");
    else document.body.classList.remove("has-banner");
    return () => document.body.classList.remove("has-banner");
  }, [pathname, visible]);

  if (!visible || pathname.startsWith("/admin")) return null;

  return (
    <>
    <style dangerouslySetInnerHTML={{ __html: ".has-banner{padding-top:40px}.has-banner nav{top:40px!important}" }} />
    <div
      id="announcement-banner"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: "var(--night)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: "0 48px 0 16px",
      }}
    >
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.86)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {text}
      </span>
      <a
        href={linkUrl}
        onClick={dismiss}
        style={{
          flexShrink: 0,
          padding: "4px 14px",
          background: "linear-gradient(135deg,var(--accent),var(--accent2))",
          color: "#fff",
          borderRadius: 999,
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
          color: "rgba(255,255,255,0.55)",
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
