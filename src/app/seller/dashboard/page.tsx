import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function SellerDashboardPage() {
  const souks = await prisma.souk.findMany({
    where: { status: { in: ["pending", "active"] } },
    orderBy: { date: "asc" },
    include: {
      _count: { select: { vehicles: true } },
    },
  });

  const registrations = await prisma.soukRegistration.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      souk: { select: { title: true, location: true, date: true, startTime: true } },
    },
  });

  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      souk: { select: { title: true } },
    },
  });

  const getRegStatus = (s: string) => {
    const m: Record<string, string> = {
      pending: "En attente", accepted: "Accepté", present: "Présent", rejected: "Refusé",
    };
    return m[s] || s;
  };
  const getRegClass = (s: string) => {
    const m: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-400",
      accepted: "bg-green-500/10 text-green-400",
      present: "bg-blue-500/10 text-blue-400",
      rejected: "bg-red-500/10 text-red-400",
    };
    return m[s] || "bg-zinc-500/10 text-zinc-400";
  };
  const getVClass = (s: string) => {
    const m: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-400",
      assigned: "bg-green-500/10 text-green-400",
      sold: "bg-blue-500/10 text-blue-400",
    };
    return m[s] || "bg-zinc-500/10 text-zinc-400";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Tableau de bord vendeur</h1>
        <p className="text-sm text-zinc-500 mt-1">Gérez vos véhicules et inscriptions</p>
      </div>

      {/* Souks disponibles */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-white mb-4">Souks disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {souks.map((souk) => (
            <div key={souk.id} className="bg-[#18181b] rounded-xl border border-[#27272a] p-5 hover:border-amber-500/30 transition-all duration-300">
              <h3 className="font-semibold text-white">{souk.title}</h3>
              <p className="text-xs text-zinc-500 mt-1.5">{souk.location}</p>
              <p className="text-xs text-zinc-500">{souk._count.vehicles} véhicules</p>
              <div className="flex gap-2 mt-4">
                <Link href={`/souks/${souk.id}`}
                  className="text-xs px-3 py-1.5 border border-[#27272a] text-zinc-400 rounded-lg hover:bg-[#27272a] transition-all">
                  Voir
                </Link>
                <Link href={`/seller/vehicles/new?soukId=${souk.id}`}
                  className="text-xs px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-all">
                  Inscrire un véhicule
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Véhicules */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Mes véhicules</h2>
          <Link href="/seller/vehicles/new"
            className="text-xs px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-all">
            + Ajouter
          </Link>
        </div>
        {vehicles.length === 0 ? (
          <div className="text-center py-12 bg-[#18181b] rounded-xl border border-[#27272a]">
            <p className="text-sm text-zinc-600">Aucun véhicule ajouté</p>
          </div>
        ) : (
          <div className="space-y-2">
            {vehicles.map((v) => (
              <div key={v.id} className="bg-[#18181b] rounded-xl border border-[#27272a] p-4 flex items-center justify-between hover:border-zinc-700 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-zinc-700/30 to-zinc-800/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{v.title}</p>
                    <p className="text-xs text-zinc-500">{v.souk.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-amber-400">
                    {v.price ? `${v.price.toLocaleString("fr-FR")} €` : "Négociable"}
                  </span>
                  <span className={`px-2 py-0.5 text-[11px] font-medium rounded-md ${getVClass(v.status)}`}>
                    {v.status === "pending" ? "En attente" : v.status === "assigned" ? "Attribué" : "Vendu"}
                  </span>
                  {v.qrCode && (
                    <Image src={v.qrCode} alt="QR" width={36} height={36} className="rounded" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Inscriptions */}
      <section>
        <h2 className="text-base font-semibold text-white mb-4">Mes inscriptions</h2>
        {registrations.length === 0 ? (
          <div className="text-center py-12 bg-[#18181b] rounded-xl border border-[#27272a]">
            <p className="text-sm text-zinc-600">Aucune inscription</p>
          </div>
        ) : (
          <div className="space-y-2">
            {registrations.map((reg) => (
              <div key={reg.id} className="bg-[#18181b] rounded-xl border border-[#27272a] p-4 flex items-center justify-between hover:border-zinc-700 transition-all">
                <div>
                  <p className="text-sm font-medium text-white">{reg.souk.title}</p>
                  <p className="text-xs text-zinc-500">
                    {reg.souk.location} · {new Date(reg.souk.date).toLocaleDateString("fr-FR")} à {reg.souk.startTime}
                  </p>
                  {reg.spotNumber && <p className="text-xs text-zinc-500 mt-0.5">Emplacement n°{reg.spotNumber}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 text-[11px] font-medium rounded-md ${getRegClass(reg.status)}`}>
                    {getRegStatus(reg.status)}
                  </span>
                  {reg.qrCode && (
                    <Image src={reg.qrCode} alt="QR" width={36} height={36} className="rounded" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
