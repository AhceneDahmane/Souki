"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import Logo from "./Logo";
import NotificationBell from "./NotificationBell";

const navLinks = [
  { label: "Souks", href: "/souks" },
  { label: "Carte", href: "/souks/map" },
];

const landingLinks = [
  { label: "Fonctionnement", href: "/#comment-ca-marche" },
  { label: "Offres", href: "/#offres" },
  { label: "Avis", href: "/#temoignages" },
];

const roleLinks: Record<string, { label: string; href: string }[]> = {
  admin: [{ label: "Admin", href: "/admin" }],
  organizer: [{ label: "Organisateur", href: "/organizer/dashboard" }],
  visitor: [{ label: "Dashboard", href: "/visitor/dashboard" }],
  seller: [{ label: "Vendeur", href: "/seller/dashboard" }],
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    if (href === "/souks") return pathname === "/souks" || pathname.startsWith("/souks/");
    return pathname === href;
  };

  const roleBasedLinks = user ? roleLinks[user.role] ?? [] : [];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-[#0a0a0b]/90 backdrop-blur-2xl border-b border-[#27272a]/80 shadow-[0_1px_20px_-6px_rgba(0,0,0,0.5)]"
        : "bg-[#0a0a0b]/70 backdrop-blur-md border-b border-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <Link href="/" className="relative z-10">
            <Logo />
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-white bg-white/10"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {!user && landingLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
              >
                {link.label}
              </a>
            ))}

            {roleBasedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-white bg-white/10"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-1 ml-3 pl-3 border-l border-[#27272a]">
                <Link
                  href="/payments"
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-all"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {user.balance?.toLocaleString("fr-FR")} DZD
                </Link>
                <Link
                  href="/profile"
                  className="text-sm text-zinc-400 hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition-all"
                >
                  {user.name}
                </Link>
                <NotificationBell />
                <Link
                  href="/settings"
                  className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  title="Paramètres"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </Link>
                <button
                  onClick={async () => {
                    await logout();
                    router.push("/");
                  }}
                  className="px-2.5 py-1.5 text-sm text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  title="Déconnexion"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-3 pl-3 border-l border-[#27272a]">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 text-sm font-medium text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition-all shadow-[0_0_12px_-4px_rgba(245,158,11,0.3)]"
                >
                  S&apos;inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative z-10 p-1.5 text-zinc-400 hover:text-white transition-colors"
            aria-label="Menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
        mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-72 max-w-[85vw] bg-[#0a0a0b] border-l border-[#27272a] shadow-2xl transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}>
          <div className="flex flex-col h-full pt-20 pb-6 px-4 overflow-y-auto">
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider px-3 mb-2">Navigation</p>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 text-sm rounded-lg transition-all ${
                    isActive(link.href)
                      ? "text-white bg-white/10"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {!user && (
                <>
                  <p className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider px-3 mt-4 mb-2">Découvrir</p>
                  {landingLinks.map((link) => (
                    <a key={link.href} href={link.href}
                      className="block px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                      {link.label}
                    </a>
                  ))}
                </>
              )}

              {user && (
                <>
                  <p className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider px-3 mt-4 mb-2">Mon compte</p>
                  {roleBasedLinks.map((link) => (
                    <Link key={link.href} href={link.href}
                      className={`block px-3 py-2 text-sm rounded-lg transition-all ${
                        isActive(link.href) ? "text-white bg-white/10" : "text-zinc-400 hover:text-white hover:bg-white/5"
                      }`}>
                      {link.label}
                    </Link>
                  ))}
                  {user?.role === "visitor" && (
                    <Link href="/favorites"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      Favoris
                    </Link>
                  )}
                  <Link href="/payments"
                    className="flex items-center justify-between px-3 py-2 text-sm text-amber-400 bg-amber-500/5 rounded-lg hover:bg-amber-500/10 transition-all">
                    <span>Portefeuille</span>
                    <span className="text-xs font-medium">{user.balance?.toLocaleString("fr-FR")} DZD</span>
                  </Link>
                  <Link href="/profile" className="block px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">Profil</Link>
                  <Link href="/settings" className="block px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">Paramètres</Link>
                  <button
                    onClick={async () => { await logout(); router.push("/"); }}
                    className="block w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    Déconnexion
                  </button>
                </>
              )}
            </div>

            {!user && (
              <div className="mt-auto pt-6 border-t border-[#27272a] space-y-2">
                <Link href="/login"
                  className="block w-full text-center px-3 py-2.5 text-sm font-medium text-zinc-300 border border-[#27272a] rounded-lg hover:bg-white/5 transition-all">
                  Connexion
                </Link>
                <Link href="/register"
                  className="block w-full text-center px-3 py-2.5 text-sm font-medium text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition-all">
                  S&apos;inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
