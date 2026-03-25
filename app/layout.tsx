import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
export const metadata: Metadata = {
  title: "CareStay Suites | Premium Furnished Housing for Healthcare Professionals | GTA",
  description: "Move-in ready furnished apartments for travel nurses, medical staff, and corporate stays, primarily across the Greater Toronto Area. Verified properties. Month-to-month. No scams.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* Loading Splash Screen */}
        <div id="splash" style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#0a0c0f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "opacity 0.4s ease" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg,#0fa,#0af)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24, color: "#0a0c0f", fontFamily: "system-ui,sans-serif", animation: "splashPulse 2s ease-in-out infinite" }}>CS</div>
          <div style={{ marginTop: 16, fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 700, fontSize: 22, color: "#fff", opacity: 0.9 }}>CareStay <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.5)" }}>Suites</span></div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `@keyframes splashPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.85;transform:scale(1.04)}}` }} />
        <script dangerouslySetInnerHTML={{ __html: `window.addEventListener('load',function(){var s=document.getElementById('splash');if(s){s.style.opacity='0';setTimeout(function(){s.style.display='none'},400)}})` }} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
