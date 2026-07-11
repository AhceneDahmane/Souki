import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription",
  description: "Créez votre compte Souki gratuitement. Choisissez votre profil : visiteur, vendeur ou organisateur.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
