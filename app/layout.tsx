import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareStay Suites — Premium Furnished Housing for Healthcare Professionals",
  description: "Move-in ready furnished suites across the GTA for travel nurses, physicians, and medical staff. Verified properties near Toronto's top hospitals. No scams, no hidden fees.",
  keywords: "healthcare housing Toronto, travel nurse housing GTA, furnished rentals Toronto, medical professional housing, corporate housing Toronto",
  openGraph: {
    title: "CareStay Suites — Healthcare Housing in Toronto",
    description: "Premium furnished suites for healthcare professionals across the Greater Toronto Area.",
    type: "website",
    url: "https://carestaysuites.com",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
