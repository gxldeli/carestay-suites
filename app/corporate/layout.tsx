import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corporate Housing Toronto | CareStay Suites",
  description: "Furnished corporate housing in Toronto for relocations, consultants, project teams, and insurance placements.",
  alternates: { canonical: "/corporate" },
};

export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
