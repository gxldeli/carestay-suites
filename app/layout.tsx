import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import AnnouncementBanner from "@/app/components/AnnouncementBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareStay Suites | Corporate Housing & Furnished Extended Stays in Toronto",
  description:
    "Corporate housing Toronto — fully furnished suites for relocations, consultants, insurance placements, and project teams. Furnished monthly rentals and extended stay Toronto, professionally managed with self check-in.",
  keywords: [
    "corporate housing Toronto",
    "furnished monthly rentals Toronto",
    "extended stay Toronto",
    "furnished apartments Toronto",
    "insurance housing Toronto",
  ],
};

const lodgingSchema = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "CareStay Suites",
  url: "https://www.carestaysuites.com",
  description:
    "Furnished suites for professionals in Toronto — corporate housing, relocations, insurance placements, and project stays. Professionally managed, keyless entry, every stay on a signed agreement.",
  email: "info@carestaysuites.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "35 Mariner Terrace",
    addressLocality: "Toronto",
    addressRegion: "ON",
    postalCode: "M5V 3V9",
    addressCountry: "CA",
  },
  areaServed: "Greater Toronto Area",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingSchema) }} />
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
