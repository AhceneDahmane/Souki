import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#27272a] bg-[#0a0a0b]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <span className="text-xs font-bold text-black">S</span>
            </div>
            <span className="text-lg font-semibold text-white">Souki</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/souks"
              className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-all duration-200"
            >
              Souks
            </Link>
            <Link
              href="/organizer/dashboard"
              className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-all duration-200"
            >
              Organisateur
            </Link>
            <Link
              href="/seller/dashboard"
              className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-all duration-200"
            >
              Vendeur
            </Link>
            <Link
              href="/api-docs"
              className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-all duration-200"
            >
              API
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
