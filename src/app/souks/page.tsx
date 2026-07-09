import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SouksPage() {
  const souks = await prisma.souk.findMany({
    orderBy: { date: "desc" },
    include: {
      organizer: { select: { name: true } },
      _count: { select: { vehicles: true, registrations: true } },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Souks disponibles</h1>
          <p className="text-sm text-zinc-500 mt-1">Découvrez les souks automobiles à venir</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-48 pl-9 pr-3 py-2 text-sm bg-[#18181b] border border-[#27272a] rounded-lg text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {souks.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#18181b] border border-[#27272a] flex items-center justify-center">
            <svg className="w-7 h-7 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <p className="text-zinc-500">Aucun souk disponible pour le moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {souks.map((souk) => {
            const statusConfig = {
              active: { label: "Actif", class: "bg-green-500/10 text-green-400 border-green-500/20" },
              pending: { label: "À venir", class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
              completed: { label: "Terminé", class: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
              cancelled: { label: "Annulé", class: "bg-red-500/10 text-red-400 border-red-500/20" },
            }[souk.status] || { label: souk.status, class: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" };

            return (
              <Link
                key={souk.id}
                href={`/souks/${souk.id}`}
                className="group p-5 bg-[#18181b] rounded-xl border border-[#27272a] hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <span className={`px-2 py-0.5 text-[11px] font-medium rounded-md border ${statusConfig.class}`}>
                    {statusConfig.label}
                  </span>
                </div>

                <h2 className="text-base font-semibold text-white group-hover:text-amber-400 transition-colors mb-2">{souk.title}</h2>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span>{souk.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span>{new Date(souk.date).toLocaleDateString("fr-FR")} à {souk.startTime}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#27272a]">
                  <span className="text-xs text-zinc-600">{souk.organizer.name}</span>
                  <span className="text-xs text-zinc-500">
                    <span className="text-amber-400 font-medium">{souk._count.vehicles}</span> véhicules
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
