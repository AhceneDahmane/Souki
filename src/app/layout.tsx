import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/auth-context";
import { SettingsProvider } from "@/lib/settings-context";
import AuthGate from "@/components/AuthGate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Souki - Plateforme de Souk Automobile",
  description: "Plateforme de mise en relation pour souks automobiles",
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
