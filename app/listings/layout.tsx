import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Furnished Rentals in Toronto | CareStay Suites",
  description: "Browse professionally managed furnished suites for business travel, relocations, healthcare assignments, insurance placements, and project stays.",
  alternates: { canonical: "/listings" },
};

export default function ListingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
