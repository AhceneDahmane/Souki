import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

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
                  <p className="text-xs text-zinc-500">{bid.vehicle.souk.title}</p>
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
