import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Souki — Plateforme de Souk Automobile",
    short_name: "Souki",
    description: "Plateforme SaaS de mise en relation pour souks automobiles en Algérie.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0b",
    theme_color: "#f59e0b",
    icons: [
      { src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { src: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
      { src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml", purpose: "maskable" },
    ],
    categories: ["automotive", "business", "marketplace"],
    lang: "fr-DZ",
    orientation: "portrait",
  };
}
