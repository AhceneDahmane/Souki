import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import StepsSection from "@/components/StepsSection";

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
        <p className="text-sm text-zinc-500 mt-1">Gérez vos souks automobiles</p>
      </div>

      <StepsSection
        title="Étapes à suivre"
        steps={[
          { label: "Créer votre compte organisateur", done: true, icon: "" },
          { label: "Créer un souk", done: souks.length > 0, href: "/organizer/souks/new", icon: "M12 4v16m8-8H4" },
          { label: "Ajouter les détails et services", done: souks.some((s) => s.services), icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
          { label: "Gérer les inscriptions des vendeurs", done: souks.some((s) => s._count.registrations > 0), icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
          { label: "Scanner les QR codes à l'entrée", done: false, icon: "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" },
        ]}
      />

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-base font-semibold text-white">Mes souks</h2>
        <div className="flex items-center gap-2">
          <Link
            href="/organizer/stats"
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#27272a] text-zinc-400 text-sm font-medium rounded-lg hover:bg-[#27272a] transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            Statistiques
          </Link>
          <Link
            href="/organizer/souks/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-black text-sm font-medium rounded-lg hover:bg-amber-400 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Créer un souk
          </Link>
        </div>
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
