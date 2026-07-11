import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carte des souks",
  description: "Visualisez tous les souks automobiles sur une carte interactive de l'Algérie.",
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
