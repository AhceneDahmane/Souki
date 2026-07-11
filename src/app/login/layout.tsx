import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte Souki pour accéder à votre tableau de bord.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
