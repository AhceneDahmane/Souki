"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Logo from "./Logo";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-[#27272a] bg-[#0a0a0b]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <Link href="/">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link href="/souks" className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-all duration-200">Souks</Link>
            <a href="/#comment-ca-marche" className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-all duration-200">Fonctionnement</a>
            <a href="/#offres" className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-all duration-200">Offres</a>
            <a href="/#temoignages" className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-all duration-200">Avis</a>

            {user?.role === "organizer" && (
              <Link
                href="/organizer/dashboard"
                className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-all duration-200"
              >
                Organisateur
              </Link>
            )}

            {user?.role === "visitor" && (
              <Link
                href="/visitor/dashboard"
                className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-all duration-200"
              >
                Dashboard
              </Link>
            )}

            {user?.role === "seller" && (
              <Link
                href="/seller/dashboard"
                className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-all duration-200"
              >
                Vendeur
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-2 ml-2">
                <span className="text-sm text-zinc-500 hidden sm:inline">{user.name}</span>
                <button
                  onClick={async () => {
                    await logout();
                    router.push("/");
                  }}
                  className="px-3 py-1.5 text-sm text-zinc-400 hover:text-red-400 hover:bg-[#27272a] rounded-lg transition-all duration-200"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-2 px-3 py-1.5 text-sm font-medium text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition-all duration-200"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
