import type { Metadata } from "next";

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  return {
    title: "Furnished Suite Details | CareStay Suites",
    description: "Explore suite photos, amenities, location details, and availability from CareStay Suites.",
    alternates: { canonical: `/listings/${params.id}` },
  };
}

export default function ListingDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
