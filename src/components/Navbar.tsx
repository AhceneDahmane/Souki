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

            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-all duration-200"
              >
                Admin
              </Link>
            )}

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
                <Link
                  href="/profile"
                  className="text-sm text-zinc-500 hidden sm:inline hover:text-amber-400 transition-colors"
                >
                  {user.name}
                </Link>
                <Link
                  href="/settings"
                  className="p-1.5 text-zinc-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-all duration-200"
                  title="Paramètres"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </Link>
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
