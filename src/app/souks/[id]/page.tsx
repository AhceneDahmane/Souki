import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BidButton from "./BidButton";

export const dynamic = "force-dynamic";

export default async function SoukDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const souk = await prisma.souk.findUnique({
    where: { id },
    include: {
      organizer: { select: { name: true } },
      vehicles: {
        include: {
          seller: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!souk) notFound();

  const statusConfig: Record<string, { label: string; class: string }> = {
    active: { label: "Actif", class: "bg-green-500/10 text-green-400 border-green-500/20" },
    pending: { label: "À venir", class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
    completed: { label: "Terminé", class: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    cancelled: { label: "Annulé", class: "bg-red-500/10 text-red-400 border-red-500/20" },
  };

  const sc = statusConfig[souk.status] || { label: souk.status, class: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-[#18181b] rounded-xl border border-[#27272a] p-6 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white">{souk.title}</h1>
              <span className={`px-2 py-0.5 text-[11px] font-medium rounded-md border ${sc.class}`}>{sc.label}</span>
            </div>
            <p className="text-sm text-zinc-500">Organisé par <span className="text-zinc-300">{souk.organizer.name}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Lieu", value: souk.location, icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
            { label: "Date", value: new Date(souk.date).toLocaleDateString("fr-FR"), icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
            { label: "Horaires", value: `${souk.startTime}${souk.endTime ? ` - ${souk.endTime}` : ""}`, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
            { label: "Prix place", value: `${souk.spotPrice} €`, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
          ].map((item) => (
            <div key={item.label} className="p-3 bg-[#0a0a0b] rounded-lg border border-[#27272a]">
              <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                {item.label}
              </div>
              <p className="text-sm font-medium text-white">{item.value}</p>
            </div>
          ))}
        </div>

        {souk.services && (
          <div className="mt-4 p-3 bg-[#0a0a0b] rounded-lg border border-[#27272a]">
            <p className="text-xs text-zinc-500 mb-1">Services proposés</p>
            <p className="text-sm text-zinc-300">{souk.services}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Véhicules inscrits</h2>
          <p className="text-xs text-zinc-500 mt-0.5">{souk.vehicles.length} véhicule{souk.vehicles.length > 1 ? "s" : ""}</p>
        </div>
      </div>

      {souk.vehicles.length === 0 ? (
        <div className="text-center py-16 bg-[#18181b] rounded-xl border border-[#27272a]">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#0a0a0b] border border-[#27272a] flex items-center justify-center">
            <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <p className="text-sm text-zinc-500">Aucun véhicule inscrit pour le moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {souk.vehicles.map((vehicle) => (
            <div key={vehicle.id} className="group p-5 bg-[#18181b] rounded-xl border border-[#27272a] hover:border-amber-500/20 transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-700/30 to-zinc-800/30 flex items-center justify-center mt-0.5">
                    <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white group-hover:text-amber-400 transition-colors">{vehicle.title}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {vehicle.year ? `${vehicle.year}` : ""}
                      {vehicle.mileage ? ` · ${vehicle.mileage.toLocaleString("fr-FR")} km` : ""}
                      {vehicle.fuelType ? ` · ${vehicle.fuelType}` : ""}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-amber-400 whitespace-nowrap">
                  {vehicle.price
                    ? `${vehicle.price.toLocaleString("fr-FR")} €`
                    : "Négociable"}
                </span>
              </div>

              {vehicle.description && (
                <p className="text-xs text-zinc-400 mb-4 ml-[52px]">{vehicle.description}</p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-[#27272a] ml-[52px]">
                <span className="text-[11px] text-zinc-600">Vendeur : {vehicle.seller.name}</span>
                {souk.status === "active" && (
                  <BidButton vehicleId={vehicle.id} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
