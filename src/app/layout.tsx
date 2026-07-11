import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/auth-context";
import { SettingsProvider } from "@/lib/settings-context";
import AuthGate from "@/components/AuthGate";
import OnboardingModal from "@/components/OnboardingModal";
import PwaRegister from "@/components/PwaRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#f59e0b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Souki — Plateforme de Souk Automobile en Algérie",
    template: "%s | Souki",
  },
  description: "Plateforme SaaS de mise en relation pour souks automobiles en Algérie. Organisez, vendez et enchérissez sur vos véhicules d'occasion en temps réel.",
  keywords: ["souk", "automobile", "Algérie", "voiture occasion", "enchère", "véhicule", "souk auto"],
  authors: [{ name: "Souki" }],
  appleWebApp: {
    capable: true,
    title: "Souki",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Souki — Plateforme de Souk Automobile",
    description: "Organisez, vendez et enchérissez sur vos véhicules d'occasion lors des souks automobiles en Algérie.",
    url: "https://souki.dz",
    siteName: "Souki",
    locale: "fr_DZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Souki — Plateforme de Souk Automobile",
    description: "Organisez, vendez et enchérissez sur vos véhicules d'occasion lors des souks automobiles en Algérie.",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col">
        <div className="orb-dark fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-amber-500/20 blur-[120px] animate-[float_8s_ease-in-out_infinite]" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-amber-600/15 blur-[120px] animate-[float-delayed_10s_ease-in-out_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-yellow-500/10 blur-[150px] animate-[pulse-glow_6s_ease-in-out_infinite]" />
        </div>
        <div className="orb-light fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-400/15 blur-[150px] animate-[float_8s_ease-in-out_infinite]" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-amber-300/10 blur-[120px] animate-[float-delayed_10s_ease-in-out_infinite]" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-blue-400/10 blur-[100px] animate-[pulse-glow_6s_ease-in-out_infinite]" />
        </div>
        <AuthProvider>
          <SettingsProvider>
            <AuthGate>
              <PwaRegister />
              <OnboardingModal />
              <Navbar />
              <main className="flex-1 relative">{children}</main>
              <Footer />
            </AuthGate>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
