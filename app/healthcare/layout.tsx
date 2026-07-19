import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Furnished Stays for Healthcare Professionals | CareStay Suites",
  description: "Professionally managed furnished suites for nurses, physicians, medical staff, and healthcare assignments across the Greater Toronto Area.",
  alternates: { canonical: "/healthcare" },
};

export default function HealthcareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
