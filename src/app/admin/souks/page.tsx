import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statusConfig: Record<string, { label: string; class: string }> = {
  active: { label: "Actif", class: "bg-green-500/10 text-green-400 border-green-500/20" },
  pending: { label: "À venir", class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  completed: { label: "Terminé", class: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  cancelled: { label: "Annulé", class: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export default async function AdminSouksPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "admin") redirect("/login");

  const souks = await prisma.souk.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      organizer: { select: { name: true } },
      _count: { select: { vehicles: true, registrations: true } },
    },
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Souks</h1>
        <p className="text-sm text-zinc-500 mt-1">{souks.length} souk{souks.length > 1 ? "s" : ""}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#27272a]">
              <th className="text-left py-3 px-3 text-zinc-500 font-medium">Titre</th>
              <th className="text-left py-3 px-3 text-zinc-500 font-medium">Organisateur</th>
              <th className="text-left py-3 px-3 text-zinc-500 font-medium">Statut</th>
              <th className="text-left py-3 px-3 text-zinc-500 font-medium">Lieu</th>
              <th className="text-center py-3 px-3 text-zinc-500 font-medium">Véhicules</th>
              <th className="text-center py-3 px-3 text-zinc-500 font-medium">Inscriptions</th>
              <th className="text-right py-3 px-3 text-zinc-500 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {souks.map((s) => {
              const sc = statusConfig[s.status] || { label: s.status, class: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" };
              return (
                <tr key={s.id} className="border-b border-[#27272a] hover:bg-[#18181b]/50 transition-colors">
                  <td className="py-3 px-3">
                    <Link href={`/souks/${s.id}`} className="text-white font-medium hover:text-amber-400 transition-colors">{s.title}</Link>
                  </td>
                  <td className="py-3 px-3 text-zinc-400">{s.organizer.name}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-0.5 text-[11px] font-medium rounded-full border ${sc.class}`}>{sc.label}</span>
                  </td>
                  <td className="py-3 px-3 text-zinc-400">{s.location}</td>
                  <td className="py-3 px-3 text-center text-zinc-400">{s._count.vehicles}</td>
                  <td className="py-3 px-3 text-center text-zinc-400">{s._count.registrations}</td>
                  <td className="py-3 px-3 text-right text-zinc-500">{new Date(s.date).toLocaleDateString("fr-FR")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
