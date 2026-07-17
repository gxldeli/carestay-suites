import { redirect } from "next/navigation";

// Legacy healthcare-only landing page — parked as part of the corporate-housing
// repositioning (July 2026). The insurance-housing audience lives on the homepage;
// old links and indexed URLs land on the new corporate-first home.
export default function HealthcarePage() {
  redirect("/");
}
