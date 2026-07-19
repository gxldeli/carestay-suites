import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CareStay Admin",
  robots: { index: false, follow: false },
  alternates: { canonical: "/admin" },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
