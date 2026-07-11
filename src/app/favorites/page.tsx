import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "visitor") redirect("/login");

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      vehicle: {
        include: {
          souk: { select: { id: true, title: true, status: true, date: true, location: true } },
        },
      },
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[var(--fg-base)] mb-2">Mes favoris</h1>
      <p className="text-sm text-[var(--fg-muted)] mb-8">{favorites.length} véhicule{favorites.length > 1 ? "s" : ""} sauvegardé{favorites.length > 1 ? "s" : ""}</p>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
          <svg className="w-12 h-12 text-zinc-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="text-sm text-zinc-600">Aucun favori pour le moment</p>
          <Link href="/souks" className="inline-block mt-3 text-sm text-amber-400 hover:text-amber-300 transition-colors">
            Explorer les souks →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {favorites.map((fav) => {
            const v = fav.vehicle;
            const images: string[] = v.images ? JSON.parse(v.images) : [];
            return (
              <div key={fav.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 flex items-center gap-4 hover:border-zinc-700 transition-all">
                {images[0] ? (
                  <img src={images[0]} alt={v.title} className="w-16 h-12 rounded-lg object-cover border border-[var(--border-color)] shrink-0" />
                ) : (
                  <div className="w-16 h-12 rounded-lg bg-[var(--bg-card-alt)] border border-[var(--border-color)] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <Link href={`/vehicles/${v.id}`} className="text-sm font-medium text-[var(--fg-base)] hover:text-amber-400 transition-colors">
                    {v.title}
                  </Link>
                  <p className="text-xs text-[var(--fg-muted)] mt-0.5">{v.brand} · {v.model}{v.year ? ` · ${v.year}` : ""}</p>
                  {v.souk && (
                    <p className="text-xs text-zinc-600 mt-0.5">
                      {v.souk.title} · {v.souk.location}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-medium text-amber-400">
                    {v.price ? `${v.price.toLocaleString("fr-FR")} DZD` : "Négociable"}
                  </span>
                  <FavoriteButton vehicleId={v.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
