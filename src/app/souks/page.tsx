import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import SoukFilter from "@/components/SoukFilter";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Souks disponibles",
  description: "Découvrez tous les souks automobiles en Algérie. Consultez les dates, lieux et véhicules disponibles.",
};

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Souks disponibles</h1>
          <p className="text-sm text-zinc-500 mt-1">Découvrez les souks automobiles à venir</p>
        </div>
        <Link
          href="/souks/map"
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-400 border border-[#27272a] rounded-lg hover:bg-[#27272a] hover:text-white transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          Carte
        </Link>
      </div>

      <SoukFilter souks={souks} />
    </div>
  );
}
