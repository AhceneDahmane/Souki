import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import DonutChart from "@/components/DonutChart";
import BarChart from "@/components/BarChart";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "admin") redirect("/login");

  const [usersCount, organizersCount, sellersCount, visitorsCount, adminsCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "organizer" } }),
    prisma.user.count({ where: { role: "seller" } }),
    prisma.user.count({ where: { role: "visitor" } }),
    prisma.user.count({ where: { role: "admin" } }),
  ]);

  const [souksCount, activeSouks, pendingSouks, completedSouks, cancelledSouks] = await Promise.all([
    prisma.souk.count(),
    prisma.souk.count({ where: { status: "active" } }),
    prisma.souk.count({ where: { status: "pending" } }),
    prisma.souk.count({ where: { status: "completed" } }),
    prisma.souk.count({ where: { status: "cancelled" } }),
  ]);

  const [vehiclesCount, pendingVehicles, soldVehicles] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { status: "pending" } }),
    prisma.vehicle.count({ where: { status: "sold" } }),
  ]);

  const [bidsCount, totalBidAmount] = await Promise.all([
    prisma.bid.count(),
    prisma.bid.aggregate({ _sum: { amount: true } }),
  ]);

  const registrationsCount = await prisma.soukRegistration.count();

  const pendingRegistrations = await prisma.soukRegistration.count({
    where: { status: "pending" },
  });

  const stats = [
    { label: "Utilisateurs", value: usersCount, sub: `${organizersCount} org · ${sellersCount} vend · ${visitorsCount} vis · ${adminsCount} adm` },
    { label: "Souks", value: souksCount, sub: `${activeSouks} actifs · ${pendingSouks} à venir · ${completedSouks} terminés · ${cancelledSouks} annulés` },
    { label: "Véhicules", value: vehiclesCount, sub: `${soldVehicles} vendus · ${pendingVehicles} dispo` },
    { label: "Enchères", value: bidsCount, sub: `${totalBidAmount._sum.amount?.toLocaleString("fr-FR") || 0} DZD total` },
    { label: "Inscriptions", value: registrationsCount, sub: `${pendingRegistrations} en attente` },
  ];

  const recentSouks = await prisma.souk.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { organizer: { select: { name: true } }, _count: { select: { vehicles: true, registrations: true } } },
  });

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const souks = await prisma.souk.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { _count: { select: { vehicles: true, registrations: true } } },
  });

  const userRoleBreakdown = [
    { label: "Visiteurs", value: visitorsCount, color: "#22c55e" },
    { label: "Vendeurs", value: sellersCount, color: "#f59e0b" },
    { label: "Organisateurs", value: organizersCount, color: "#3b82f6" },
    { label: "Admins", value: adminsCount, color: "#a855f7" },
  ];

  const soukStatusBreakdown = [
    { label: "Actif", value: activeSouks, color: "#22c55e" },
    { label: "À venir", value: pendingSouks, color: "#eab308" },
    { label: "Terminé", value: completedSouks, color: "#3b82f6" },
    { label: "Annulé", value: cancelledSouks, color: "#ef4444" },
  ];

  const vehiclesPerSouk = souks.map((sk) => ({
    label: sk.title.length > 18 ? sk.title.slice(0, 18) + "..." : sk.title,
    value: sk._count.vehicles,
  }));

  const registrationsPerSouk = souks.map((sk) => ({
    label: sk.title.length > 18 ? sk.title.slice(0, 18) + "..." : sk.title,
    value: sk._count.registrations,
  }));

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Admin</h1>
        <p className="text-sm text-zinc-500 mt-1">Vue d&apos;ensemble de la plateforme</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#18181b] rounded-xl border border-[#27272a] p-5">
            <p className="text-xs text-zinc-500 mb-1">{s.label}</p>
            <p className="text-3xl font-bold text-white">{s.value}</p>
            <p className="text-[11px] text-zinc-600 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 bg-[#18181b] rounded-xl border border-[#27272a]">
          <DonutChart title="Répartition des utilisateurs" data={userRoleBreakdown} />
        </div>
        <div className="p-5 bg-[#18181b] rounded-xl border border-[#27272a]">
          <DonutChart title="Statut des souks" data={soukStatusBreakdown} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 bg-[#18181b] rounded-xl border border-[#27272a]">
          <BarChart title="Véhicules par souk (top 10)" data={vehiclesPerSouk} />
        </div>
        <div className="p-5 bg-[#18181b] rounded-xl border border-[#27272a]">
          <BarChart title="Inscriptions par souk (top 10)" data={registrationsPerSouk} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#18181b] rounded-xl border border-[#27272a] p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Derniers souks</h2>
          <div className="space-y-2">
            {recentSouks.map((s) => (
              <Link key={s.id} href={`/souks/${s.id}`} className="block p-3 bg-[#0a0a0b] rounded-lg border border-[#27272a] hover:border-amber-500/30 transition-colors">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white hover:text-amber-400 transition-colors">{s.title}</p>
                  <span className="text-[11px] text-zinc-500">{s._count.vehicles} véh · {s._count.registrations} ins</span>
                </div>
                <p className="text-[11px] text-zinc-600 mt-0.5">{s.organizer.name} · {new Date(s.date).toLocaleDateString("fr-FR")}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-[#18181b] rounded-xl border border-[#27272a] p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Derniers inscrits</h2>
          <div className="space-y-2">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-3 bg-[#0a0a0b] rounded-lg border border-[#27272a]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-xs font-bold text-black">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{u.name}</p>
                    <p className="text-[11px] text-zinc-500">{u.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${
                  u.role === "admin" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                  u.role === "organizer" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                  u.role === "seller" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                  "bg-green-500/10 text-green-400 border-green-500/20"
                }`}>
                  {u.role === "admin" ? "Admin" : u.role === "organizer" ? "Organisateur" : u.role === "seller" ? "Vendeur" : "Visiteur"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
