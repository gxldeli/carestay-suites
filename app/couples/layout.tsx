import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Getaways for Two in Toronto | CareStay Suites",
  description: "Private Toronto suites for anniversaries, birthdays and proposals. Tell us the occasion and we set the room before you arrive: food on the table, bubbly on ice, the lights low.",
  alternates: { canonical: "/couples" },
};

export default function CouplesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
