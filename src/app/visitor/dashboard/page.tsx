import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import StepsSection from "@/components/StepsSection";

export const dynamic = "force-dynamic";

export default async function VisitorDashboardPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "visitor") redirect("/login");

  const souks = await prisma.souk.findMany({
    where: { status: { in: ["pending", "active"] } },
    orderBy: { date: "asc" },
    take: 6,
    include: {
      _count: { select: { vehicles: true } },
    },
  });

  const bids = await prisma.bid.findMany({
    where: { visitorId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      vehicle: {
        select: { title: true, price: true, souk: { select: { title: true } } },
      },
    },
  });

  const getBidStatus = (s: string) => {
    const m: Record<string, string> = {
      active: "Actif",
      outbid: "Surenchéri",
      won: "Gagné",
      lost: "Perdu",
    };
    return m[s] || s;
  };
  const getBidClass = (s: string) => {
    const m: Record<string, string> = {
      active: "bg-green-500/10 text-green-400",
      outbid: "bg-yellow-500/10 text-yellow-400",
      won: "bg-blue-500/10 text-blue-400",
      lost: "bg-red-500/10 text-red-400",
    };
    return m[s] || "bg-zinc-500/10 text-zinc-400";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Tableau de bord visiteur</h1>
        <p className="text-sm text-zinc-500 mt-1">Parcourez les souks et suivez vos enchères</p>
      </div>

      <StepsSection
        title="Étapes à suivre"
        steps={[
          { label: "Créer votre compte visiteur", done: true, icon: "" },
          { label: "Parcourir les souks disponibles", done: souks.length > 0, href: "/souks", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
          { label: "Explorer les véhicules et enchérir", done: bids.length > 0, href: "/souks", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "Scanner les QR codes sur place", done: false, icon: "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" },
        ]}
      />

      {/* Souks à venir */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Souks à venir</h2>
          <Link
            href="/souks"
            className="text-xs px-3 py-1.5 border border-[#27272a] text-zinc-400 rounded-lg hover:bg-[#27272a] transition-all"
          >
            Voir tout
          </Link>
        </div>
        {souks.length === 0 ? (
          <div className="text-center py-12 bg-[#18181b] rounded-xl border border-[#27272a]">
            <p className="text-sm text-zinc-600">Aucun souk à venir</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {souks.map((souk) => (
              <Link
                key={souk.id}
                href={`/souks/${souk.id}`}
                className="bg-[#18181b] rounded-xl border border-[#27272a] p-5 hover:border-amber-500/30 transition-all duration-300"
              >
                <h3 className="font-semibold text-white">{souk.title}</h3>
                <p className="text-xs text-zinc-500 mt-1.5">{souk.location}</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {new Date(souk.date).toLocaleDateString("fr-FR")} à {souk.startTime}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">{souk._count.vehicles} véhicules</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Mes enchères */}
      <section>
        <h2 className="text-base font-semibold text-white mb-4">Mes enchères</h2>
        {bids.length === 0 ? (
          <div className="text-center py-12 bg-[#18181b] rounded-xl border border-[#27272a]">
            <p className="text-sm text-zinc-600">Aucune enchère pour le moment</p>
            <Link
              href="/souks"
              className="inline-block mt-3 text-sm text-amber-400 hover:text-amber-300 transition-colors"
            >
              Parcourir les souks →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {bids.map((bid) => (
              <div
                key={bid.id}
                className="bg-[#18181b] rounded-xl border border-[#27272a] p-4 flex items-center justify-between hover:border-zinc-700 transition-all"
              >
                <div>
                  <p className="text-sm font-medium text-white">{bid.vehicle.title}</p>
                  <p className="text-xs text-zinc-500">{bid.vehicle.souk?.title || "Non assigné"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-amber-400">
                    {bid.amount.toLocaleString("fr-FR")} DZD
                  </span>
                  <span className={`px-2 py-0.5 text-[11px] font-medium rounded-md ${getBidClass(bid.status)}`}>
                    {getBidStatus(bid.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
