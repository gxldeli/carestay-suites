import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About CareStay Suites | Furnished Stays in Toronto",
  description: "Learn about CareStay Suites and our hands-on approach to professionally managed furnished stays across the Greater Toronto Area.",
  alternates: { canonical: "/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
