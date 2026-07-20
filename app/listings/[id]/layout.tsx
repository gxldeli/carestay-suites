import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Furnished Suite Details | CareStay Suites",
    description: "Explore suite photos, amenities, location details, and availability from CareStay Suites.",
    alternates: { canonical: `/listings/${id}` },
  };
}

export default function ListingDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
