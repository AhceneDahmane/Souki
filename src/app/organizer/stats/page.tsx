import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import BarChart from "@/components/BarChart";
import DonutChart from "@/components/DonutChart";

export const dynamic = "force-dynamic";

export default async function OrganizerStatsPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "organizer") redirect("/login");

  const souks = await prisma.souk.findMany({
    where: { organizerId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { vehicles: true, registrations: true } },
      registrations: { select: { status: true } },
    },
  });

  const totalSouks = souks.length;
  const totalVehicles = souks.reduce((s, sk) => s + sk._count.vehicles, 0);
  const totalRegistrations = souks.reduce((s, sk) => s + sk._count.registrations, 0);
  const totalRevenue = souks.reduce(
    (s, sk) => s + sk.registrations.filter((r) => r.status === "accepted" || r.status === "present").length * sk.spotPrice,
    0,
  );

  const statusBreakdown = ["active", "pending", "completed", "cancelled"].map((st) => ({
    label: st === "active" ? "Actif" : st === "pending" ? "À venir" : st === "completed" ? "Terminé" : "Annulé",
    value: souks.filter((s) => s.status === st).length,
    color: st === "active" ? "#22c55e" : st === "pending" ? "#eab308" : st === "completed" ? "#3b82f6" : "#ef4444",
  }));

  const regStatusBreakdown = ["pending", "accepted", "present", "rejected"].map((st) => ({
    label: st === "pending" ? "En attente" : st === "accepted" ? "Accepté" : st === "present" ? "Présent" : "Refusé",
    value: souks.reduce((s, sk) => s + sk.registrations.filter((r) => r.status === st).length, 0),
    color: st === "pending" ? "#eab308" : st === "accepted" ? "#22c55e" : st === "present" ? "#3b82f6" : "#ef4444",
  }));

  const vehiclesPerSouk = souks.map((sk) => ({
    label: sk.title.length > 20 ? sk.title.slice(0, 20) + "..." : sk.title,
    value: sk._count.vehicles,
  }));

  const registrationsPerSouk = souks.map((sk) => ({
    label: sk.title.length > 20 ? sk.title.slice(0, 20) + "..." : sk.title,
    value: sk._count.registrations,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/organizer/dashboard"
          className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-3"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Retour au tableau de bord
        </Link>
        <h1 className="text-2xl font-bold text-white">Statistiques</h1>
        <p className="text-sm text-zinc-500 mt-1">Aperçu global de votre activité</p>
      </div>

      {/* Cartes stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Souks organisés", value: totalSouks, icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z", color: "from-amber-500/20 to-amber-600/10" },
          { label: "Véhicules inscrits", value: totalVehicles, icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "from-blue-500/20 to-blue-600/10" },
          { label: "Inscriptions vendeurs", value: totalRegistrations, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "from-green-500/20 to-green-600/10" },
          { label: "Revenu total", value: `${totalRevenue.toLocaleString("fr-FR")} DZD`, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1", color: "from-purple-500/20 to-purple-600/10" },
        ].map((card) => (
          <div key={card.label} className="relative p-5 bg-[#18181b] rounded-xl border border-[#27272a] overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 rounded-full bg-gradient-to-br ${card.color} blur-2xl`} />
            <div className="relative z-10">
              <div className="w-9 h-9 rounded-lg bg-[#0a0a0b] border border-[#27272a] flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} /></svg>
              </div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-xs text-zinc-500 mt-1">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="p-5 bg-[#18181b] rounded-xl border border-[#27272a]">
          <DonutChart
            title="Statut des souks"
            data={statusBreakdown}
          />
        </div>
        <div className="p-5 bg-[#18181b] rounded-xl border border-[#27272a]">
          <DonutChart
            title="Statut des inscriptions"
            data={regStatusBreakdown}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 bg-[#18181b] rounded-xl border border-[#27272a]">
          <BarChart
            title="Véhicules par souk"
            data={vehiclesPerSouk}
          />
        </div>
        <div className="p-5 bg-[#18181b] rounded-xl border border-[#27272a]">
          <BarChart
            title="Inscriptions par souk"
            data={registrationsPerSouk}
          />
        </div>
      </div>

      {totalSouks === 0 && (
        <div className="text-center py-16 bg-[#18181b] rounded-xl border border-[#27272a] mt-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#0a0a0b] border border-[#27272a] flex items-center justify-center">
            <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <p className="text-sm text-zinc-500">Créez votre premier souk pour voir les statistiques</p>
          <Link
            href="/organizer/souks/new"
            className="inline-block mt-3 text-sm text-amber-400 hover:text-amber-300 transition-colors"
          >
            Créer un souk →
          </Link>
        </div>
      )}
    </div>
  );
}
