import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import BarChart from "@/components/BarChart";
import DonutChart from "@/components/DonutChart";

export const dynamic = "force-dynamic";

export default async function SellerStatsPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "seller") redirect("/login");

  const vehicles = await prisma.vehicle.findMany({
    where: { sellerId: user.id },
    include: { souk: { select: { title: true } } },
  });

  const registrations = await prisma.soukRegistration.findMany({
    where: { sellerId: user.id },
    include: { souk: { select: { title: true } } },
  });

  const bids = await prisma.bid.findMany({
    where: { visitorId: user.id },
    include: { vehicle: { select: { title: true } } },
  });

  const totalVehicles = vehicles.length;
  const soldVehicles = vehicles.filter((v) => v.status === "sold").length;
  const totalValue = vehicles
    .filter((v) => v.price && v.status === "sold")
    .reduce((s, v) => s + (v.price || 0), 0);
  const activeBids = bids.filter((b) => b.status === "active").length;

  const vehicleStatusBreakdown = [
    { label: "En attente", value: vehicles.filter((v) => v.status === "pending").length, color: "#eab308" },
    { label: "Attribué", value: vehicles.filter((v) => v.status === "assigned").length, color: "#22c55e" },
    { label: "Vendu", value: vehicles.filter((v) => v.status === "sold").length, color: "#3b82f6" },
  ];

  const regStatusBreakdown = [
    { label: "En attente", value: registrations.filter((r) => r.status === "pending").length, color: "#eab308" },
    { label: "Accepté", value: registrations.filter((r) => r.status === "accepted").length, color: "#22c55e" },
    { label: "Présent", value: registrations.filter((r) => r.status === "present").length, color: "#3b82f6" },
    { label: "Refusé", value: registrations.filter((r) => r.status === "rejected").length, color: "#ef4444" },
  ];

  const vehiclesPerSouk = registrations.map((r) => ({
    label: r.souk.title.length > 20 ? r.souk.title.slice(0, 20) + "..." : r.souk.title,
    value: vehicles.filter((v) => v.soukId === r.soukId).length,
  }));

  const bidStatusBreakdown = [
    { label: "Actives", value: bids.filter((b) => b.status === "active").length, color: "#22c55e" },
    { label: "Gagnées", value: bids.filter((b) => b.status === "won").length, color: "#3b82f6" },
    { label: "Perdues", value: bids.filter((b) => b.status === "lost").length, color: "#ef4444" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/seller/dashboard"
          className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-3"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Retour au tableau de bord
        </Link>
        <h1 className="text-2xl font-bold text-white">Statistiques</h1>
        <p className="text-sm text-zinc-500 mt-1">Aperçu de votre activité vendeur</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Véhicules ajoutés", value: totalVehicles, icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "from-amber-500/20 to-amber-600/10" },
          { label: "Véhicules vendus", value: soldVehicles, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "from-green-500/20 to-green-600/10" },
          { label: "Enchères actives", value: activeBids, icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", color: "from-blue-500/20 to-blue-600/10" },
          { label: "Revenu total", value: `${totalValue.toLocaleString("fr-FR")} DZD`, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1", color: "from-purple-500/20 to-purple-600/10" },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="p-5 bg-[#18181b] rounded-xl border border-[#27272a]">
          <DonutChart title="Statut des véhicules" data={vehicleStatusBreakdown} />
        </div>
        <div className="p-5 bg-[#18181b] rounded-xl border border-[#27272a]">
          <DonutChart title="Statut des inscriptions" data={regStatusBreakdown} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {vehiclesPerSouk.length > 0 && (
          <div className="p-5 bg-[#18181b] rounded-xl border border-[#27272a]">
            <BarChart title="Véhicules par souk" data={vehiclesPerSouk} />
          </div>
        )}
        {bids.length > 0 && (
          <div className="p-5 bg-[#18181b] rounded-xl border border-[#27272a]">
            <DonutChart title="Statut des enchères" data={bidStatusBreakdown} />
          </div>
        )}
      </div>

      {totalVehicles === 0 && (
        <div className="text-center py-16 bg-[#18181b] rounded-xl border border-[#27272a] mt-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#0a0a0b] border border-[#27272a] flex items-center justify-center">
            <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <p className="text-sm text-zinc-500">
            {vehicles.length === 0
              ? "Ajoutez votre premier véhicule pour voir les statistiques"
              : "Inscrivez-vous à un souk pour voir plus de statistiques"}
          </p>
          <Link
            href={vehicles.length === 0 ? "/seller/vehicles/new" : "/seller/register"}
            className="inline-block mt-3 text-sm text-amber-400 hover:text-amber-300 transition-colors"
          >
            {vehicles.length === 0 ? "Ajouter un véhicule →" : "S'inscrire à un souk →"}
          </Link>
        </div>
      )}
    </div>
  );
}
