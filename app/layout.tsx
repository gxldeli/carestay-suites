import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import AnnouncementBanner from "@/app/components/AnnouncementBanner";
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
        <Script id="facebook-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1241092834855360');fbq('track','PageView');`}</Script>
        <noscript><img height="1" width="1" style={{ display: "none" }} src="https://www.facebook.com/tr?id=1241092834855360&ev=PageView&noscript=1" alt="" /></noscript>
        <AnnouncementBanner />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
