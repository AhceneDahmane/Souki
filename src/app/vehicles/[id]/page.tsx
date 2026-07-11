import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import VehicleDetailClient from "./VehicleDetailClient";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      seller: { select: { name: true, phone: true } },
      souk: { select: { id: true, title: true, status: true } },
      bids: {
        include: { visitor: { select: { name: true } } },
        orderBy: { amount: "desc" },
      },
    },
  });

  if (!vehicle) notFound();

  const images: string[] = vehicle.images ? JSON.parse(vehicle.images) : [];
  const highestBid = vehicle.bids[0]?.amount ?? null;
  const isActive = vehicle.souk?.status === "active";

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-600 mb-6">
          <Link href="/" className="hover:text-amber-400 transition-colors">Accueil</Link>
          <span>/</span>
          {vehicle.souk ? (
            <>
              <Link href="/souks" className="hover:text-amber-400 transition-colors">Souks</Link>
              <span>/</span>
              <Link href={`/souks/${vehicle.souk.id}`} className="hover:text-amber-400 transition-colors">{vehicle.souk.title}</Link>
              <span>/</span>
            </>
          ) : (
            <>
              <span>Véhicules</span>
              <span>/</span>
            </>
          )}
          <span className="text-zinc-400">{vehicle.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left - Gallery + Info */}
          <div className="lg:col-span-3 space-y-6">
            {/* Gallery */}
            <div className="bg-[#18181b] rounded-xl border border-[#27272a] p-4">
              {images.length > 0 ? (
                <div className="space-y-3">
                  <div className="aspect-video rounded-lg overflow-hidden bg-[#0a0a0b] border border-[#27272a]">
                    <img src={images[0]} alt={vehicle.title} className="w-full h-full object-contain" />
                  </div>
                  {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {images.map((url, i) => (
                        <img key={i} src={url} alt={`${vehicle.title} ${i + 1}`} className="w-20 h-16 rounded-lg object-cover border border-[#27272a] shrink-0 cursor-pointer hover:border-amber-500/50 transition-colors" />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video rounded-lg bg-[#0a0a0b] border border-[#27272a] flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-10 h-10 text-zinc-700 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <p className="text-xs text-zinc-600">Aucune image</p>
                  </div>
                </div>
              )}
            </div>

            {/* Vehicle Details */}
            <div className="bg-[#18181b] rounded-xl border border-[#27272a] p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white">{vehicle.title}</h1>
                  <p className="text-sm text-zinc-500 mt-1">
                    {vehicle.brand} · {vehicle.model}
                    {vehicle.year ? ` · ${vehicle.year}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-amber-400">
                    {vehicle.price
                      ? `${vehicle.price.toLocaleString("fr-FR")} DZD`
                      : "Négociable"}
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    {vehicle.priceType === "fixed" ? "Prix fixe" : "Prix négociable"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Marque", value: vehicle.brand },
                  { label: "Modèle", value: vehicle.model },
                  { label: "Année", value: vehicle.year?.toString() || "—" },
                  { label: "Kilométrage", value: vehicle.mileage ? `${vehicle.mileage.toLocaleString("fr-FR")} km` : "—" },
                  { label: "Carburant", value: vehicle.fuelType || "—" },
                  { label: "Statut", value: vehicle.status === "pending" ? "Disponible" : vehicle.status === "sold" ? "Vendu" : "Attribué" },
                  {
                    label: "Prix",
                    value: vehicle.price
                      ? `${vehicle.price.toLocaleString("fr-FR")} DZD`
                      : "Négociable",
                  },
                  {
                    label: "Enchère max",
                    value: highestBid ? `${highestBid.toLocaleString("fr-FR")} DZD` : "Aucune",
                  },
                ].map((item) => (
                  <div key={item.label} className="p-3 bg-[#0a0a0b] rounded-lg border border-[#27272a]">
                    <p className="text-[11px] text-zinc-500 mb-0.5">{item.label}</p>
                    <p className="text-sm font-medium text-white">{item.value}</p>
                  </div>
                ))}
              </div>

              {vehicle.description && (
                <div className="mt-4 p-4 bg-[#0a0a0b] rounded-lg border border-[#27272a]">
                  <p className="text-[11px] text-zinc-500 mb-1">Description</p>
                  <p className="text-sm text-zinc-300 leading-relaxed">{vehicle.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right - Seller + Bid */}
          <div className="lg:col-span-2 space-y-6">
            {/* Seller Card */}
            <div className="bg-[#18181b] rounded-xl border border-[#27272a] p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Vendeur</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-sm font-bold text-black">
                  {vehicle.seller.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{vehicle.seller.name}</p>
                  {vehicle.seller.phone && (
                    <p className="text-xs text-zinc-500">{vehicle.seller.phone}</p>
                  )}
                </div>
              </div>
              {vehicle.seller.phone && (
                <a
                  href={`tel:${vehicle.seller.phone}`}
                  className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  Contacter
                </a>
              )}
            </div>

            {/* Souk Card */}
            {vehicle.souk && (
              <div className="bg-[#18181b] rounded-xl border border-[#27272a] p-6">
                <h3 className="text-sm font-semibold text-white mb-3">Souk</h3>
                <Link href={`/souks/${vehicle.souk.id}`} className="block p-3 bg-[#0a0a0b] rounded-lg border border-[#27272a] hover:border-amber-500/30 transition-colors">
                  <p className="text-sm font-medium text-white hover:text-amber-400 transition-colors">{vehicle.souk.title}</p>
                  <p className={`text-xs mt-1 ${vehicle.souk.status === "active" ? "text-green-400" : "text-zinc-500"}`}>
                    {vehicle.souk.status === "active" ? "Actif" : vehicle.souk.status === "pending" ? "À venir" : vehicle.souk.status === "completed" ? "Terminé" : "Annulé"}
                  </p>
                </Link>
              </div>
            )}

            {/* Place Bid + History */}
            {isActive && (
              <VehicleDetailClient
                vehicleId={vehicle.id}
                highestBid={highestBid}
                bidsCount={vehicle.bids.length}
                initialBids={vehicle.bids.map((b) => ({
                  id: b.id,
                  amount: b.amount,
                  visitorName: b.visitor.name,
                  createdAt: b.createdAt.toISOString(),
                }))}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
