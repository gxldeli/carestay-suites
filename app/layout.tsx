import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import EmailPopup from "@/app/components/EmailPopup";
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
        {children}
        <EmailPopup />
        <Analytics />
      </body>
    </html>
  );
}
