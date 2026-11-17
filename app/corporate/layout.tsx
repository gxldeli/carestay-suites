import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Travel Suites in Toronto | CareStay Suites",
  description: "Same suite every week, your things waiting between trips. Private Toronto suites with a real kitchen, a real desk and itemized invoices, for business travellers and the companies that send them.",
  alternates: { canonical: "/corporate" },
};

export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
