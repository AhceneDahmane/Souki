import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'équipe Souki pour toute question ou suggestion.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
