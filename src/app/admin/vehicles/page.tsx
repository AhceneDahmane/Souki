import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statusConfig: Record<string, { label: string; class: string }> = {
  pending: { label: "Disponible", class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  assigned: { label: "Attribué", class: "bg-green-500/10 text-green-400 border-green-500/20" },
  sold: { label: "Vendu", class: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
};

export default async function AdminVehiclesPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "admin") redirect("/login");

  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      seller: { select: { name: true } },
      souk: { select: { id: true, title: true } },
    },
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Véhicules</h1>
        <p className="text-sm text-zinc-500 mt-1">{vehicles.length} véhicule{vehicles.length > 1 ? "s" : ""}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#27272a]">
              <th className="text-left py-3 px-3 text-zinc-500 font-medium">Titre</th>
              <th className="text-left py-3 px-3 text-zinc-500 font-medium">Vendeur</th>
              <th className="text-left py-3 px-3 text-zinc-500 font-medium">Souk</th>
              <th className="text-left py-3 px-3 text-zinc-500 font-medium">Statut</th>
              <th className="text-right py-3 px-3 text-zinc-500 font-medium">Prix</th>
              <th className="text-right py-3 px-3 text-zinc-500 font-medium">Ajouté le</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => {
              const sc = statusConfig[v.status] || { label: v.status, class: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" };
              return (
                <tr key={v.id} className="border-b border-[#27272a] hover:bg-[#18181b]/50 transition-colors">
                  <td className="py-3 px-3">
                    <Link href={`/vehicles/${v.id}`} className="text-white font-medium hover:text-amber-400 transition-colors">{v.title}</Link>
                  </td>
                  <td className="py-3 px-3 text-zinc-400">{v.seller.name}</td>
                  <td className="py-3 px-3 text-zinc-400">
                    {v.souk ? (
                      <Link href={`/souks/${v.souk.id}`} className="hover:text-amber-400 transition-colors">{v.souk.title}</Link>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-0.5 text-[11px] font-medium rounded-full border ${sc.class}`}>{sc.label}</span>
                  </td>
                  <td className="py-3 px-3 text-right text-amber-400 font-medium">
                    {v.price ? `${v.price.toLocaleString("fr-FR")} DZD` : "Négociable"}
                  </td>
                  <td className="py-3 px-3 text-right text-zinc-500">{new Date(v.createdAt).toLocaleDateString("fr-FR")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
