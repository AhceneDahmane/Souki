import { prisma } from "@/lib/prisma";
import SoukFilter from "@/components/SoukFilter";

export const dynamic = "force-dynamic";

export default async function SouksPage() {
  const souks = await prisma.souk.findMany({
    orderBy: { date: "desc" },
    include: {
      organizer: { select: { name: true } },
      _count: { select: { vehicles: true, registrations: true } },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Souks disponibles</h1>
        <p className="text-sm text-zinc-500 mt-1">Découvrez les souks automobiles à venir</p>
      </div>

      <SoukFilter souks={souks} />
    </div>
  );
}
