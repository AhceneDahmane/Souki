import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import StepsSection from "@/components/StepsSection";
import VehicleListClient from "@/components/VehicleListClient";
import QRCodeZoom from "@/components/QRCodeZoom";

export const dynamic = "force-dynamic";

export default async function SellerDashboardPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "seller") redirect("/login");

  const souks = await prisma.souk.findMany({
    where: { status: { in: ["pending", "active"] } },
    orderBy: { date: "asc" },
    include: {
      _count: { select: { vehicles: true } },
    },
  });

  const registrations = await prisma.soukRegistration.findMany({
    where: { sellerId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      souk: { select: { title: true, location: true, date: true, startTime: true } },
    },
  });

  const vehicles = await prisma.vehicle.findMany({
    where: { sellerId: user.id },
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Tableau de bord vendeur</h1>
            <p className="text-sm text-zinc-500 mt-1">Gérez vos véhicules et inscriptions</p>
          </div>
          <Link
            href="/seller/stats"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#27272a] text-zinc-400 text-sm font-medium rounded-lg hover:bg-[#27272a] transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            Statistiques
          </Link>
        </div>
      </div>

      <StepsSection
        title="Étapes à suivre"
        steps={[
          { label: "Créer votre compte vendeur", done: true, icon: "" },
          { label: "Choisir un souk et inscrire un véhicule", done: vehicles.length > 0, href: "/seller/vehicles/new", icon: "M12 4v16m8-8H4" },
          { label: "Ajouter une photo à votre véhicule", done: vehicles.some((v) => v.images), icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
          { label: "Imprimer le QR code du véhicule", done: false, icon: "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" },
          { label: "Se présenter au souk le jour J", done: registrations.some((r) => r.status === "accepted" || r.status === "present"), icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" },
        ]}
      />

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
                <Link href="/seller/register"
                  className="text-xs px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-all">
                  S'inscrire
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
        <VehicleListClient initial={vehicles} />
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
                  {reg.qrCode && <QRCodeZoom src={reg.qrCode} />}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
