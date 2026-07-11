import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

const roleLabels: Record<string, string> = {
  admin: "Admin",
  organizer: "Organisateur",
  seller: "Vendeur",
  visitor: "Visiteur",
};

const roleColors: Record<string, string> = {
  admin: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  organizer: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  seller: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  visitor: "bg-green-500/10 text-green-400 border-green-500/20",
};

export default async function AdminUsersPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "admin") redirect("/login");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { souks: true, vehicles: true, bids: true, registrations: true } },
    },
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Utilisateurs</h1>
        <p className="text-sm text-zinc-500 mt-1">{users.length} inscrits</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#27272a]">
              <th className="text-left py-3 px-3 text-zinc-500 font-medium">Nom</th>
              <th className="text-left py-3 px-3 text-zinc-500 font-medium">Email</th>
              <th className="text-left py-3 px-3 text-zinc-500 font-medium">Rôle</th>
              <th className="text-center py-3 px-3 text-zinc-500 font-medium">Souks</th>
              <th className="text-center py-3 px-3 text-zinc-500 font-medium">Véhicules</th>
              <th className="text-center py-3 px-3 text-zinc-500 font-medium">Enchères</th>
              <th className="text-center py-3 px-3 text-zinc-500 font-medium">Inscriptions</th>
              <th className="text-right py-3 px-3 text-zinc-500 font-medium">Inscrit le</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[#27272a] hover:bg-[#18181b]/50 transition-colors">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-xs font-bold text-black shrink-0">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white font-medium">{u.name}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-zinc-400">{u.email}</td>
                <td className="py-3 px-3">
                  <span className={`inline-block px-2 py-0.5 text-[11px] font-medium rounded-full border ${roleColors[u.role] || roleColors.visitor}`}>
                    {roleLabels[u.role] || u.role}
                  </span>
                </td>
                <td className="py-3 px-3 text-center text-zinc-400">{u._count.souks}</td>
                <td className="py-3 px-3 text-center text-zinc-400">{u._count.vehicles}</td>
                <td className="py-3 px-3 text-center text-zinc-400">{u._count.bids}</td>
                <td className="py-3 px-3 text-center text-zinc-400">{u._count.registrations}</td>
                <td className="py-3 px-3 text-right text-zinc-500">{new Date(u.createdAt).toLocaleDateString("fr-FR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
