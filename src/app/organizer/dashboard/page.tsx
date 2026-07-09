import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OrganizerDashboardPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "organizer") redirect("/login");

  const souks = await prisma.souk.findMany({
    where: { organizerId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { vehicles: true, registrations: true } },
    },
  });

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; class: string }> = {
      active: { label: "Actif", class: "bg-green-500/10 text-green-400 border-green-500/20" },
      pending: { label: "À venir", class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
      completed: { label: "Terminé", class: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
      cancelled: { label: "Annulé", class: "bg-red-500/10 text-red-400 border-red-500/20" },
    };
    return configs[status] || { label: status, class: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
          <p className="text-sm text-zinc-500 mt-1">Gérez vos souks automobiles</p>
        </div>
        <Link
          href="/organizer/souks/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-black text-sm font-medium rounded-lg hover:bg-amber-400 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Créer un souk
        </Link>
      </div>

      {souks.length === 0 ? (
        <div className="text-center py-20 bg-[#18181b] rounded-xl border border-[#27272a]">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#0a0a0b] border border-[#27272a] flex items-center justify-center">
            <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <p className="text-zinc-500 mb-4">Vous n&apos;avez pas encore créé de souk</p>
          <Link
            href="/organizer/souks/new"
            className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
          >
            Créer votre premier souk →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {souks.map((souk) => {
            const sc = getStatusConfig(souk.status);
            return (
              <Link
                key={souk.id}
                href={`/organizer/souks/${souk.id}`}
                className="block p-5 bg-[#18181b] rounded-xl border border-[#27272a] hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-white">{souk.title}</h2>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {souk.location} · {new Date(souk.date).toLocaleDateString("fr-FR")} à {souk.startTime}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div className="text-xs text-zinc-500">
                      <span className="text-zinc-300 font-medium">{souk._count.registrations}</span>/{souk.spots} inscrits
                      <br />
                      <span className="text-zinc-300 font-medium">{souk._count.vehicles}</span> véhicules
                    </div>
                    <span className={`px-2 py-0.5 text-[11px] font-medium rounded-md border ${sc.class}`}>{sc.label}</span>
                    <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
