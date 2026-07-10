"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Souk = {
  id: string;
  title: string;
  location: string;
  date: Date;
  startTime: string;
  status: string;
  organizer: { name: string };
  _count: { vehicles: number; registrations: number };
};

export default function SoukFilter({ souks }: { souks: Souk[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const locations = useMemo(() => [...new Set(souks.map((s) => s.location))], [souks]);
  const [locationFilter, setLocationFilter] = useState("all");

  const filtered = souks.filter((s) => {
    const q = search.toLowerCase();
    if (q && !s.title.toLowerCase().includes(q) && !s.location.toLowerCase().includes(q)) return false;
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (locationFilter !== "all" && s.location !== locationFilter) return false;
    return true;
  });

  const statusConfig: Record<string, { label: string; class: string }> = {
    active: { label: "Actif", class: "bg-green-500/10 text-green-400 border-green-500/20" },
    pending: { label: "À venir", class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
    completed: { label: "Terminé", class: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    cancelled: { label: "Annulé", class: "bg-red-500/10 text-red-400 border-red-500/20" },
  };

  const inputClass = "w-full px-3 py-2 text-sm bg-[#18181b] border border-[#27272a] rounded-lg text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par titre ou lieu..."
            className={`${inputClass} pl-9`}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputClass + " w-auto min-w-[130px]"}>
          <option value="all">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="pending">À venir</option>
          <option value="completed">Terminé</option>
          <option value="cancelled">Annulé</option>
        </select>
        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className={inputClass + " w-auto min-w-[150px]"}>
          <option value="all">Tous les lieux</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#18181b] border border-[#27272a] flex items-center justify-center">
            <svg className="w-7 h-7 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <p className="text-zinc-500">Aucun souk trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((souk) => {
            const cfg = statusConfig[souk.status] || { label: souk.status, class: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" };
            return (
              <Link
                key={souk.id}
                href={`/souks/${souk.id}`}
                className="group p-5 bg-[#18181b] rounded-xl border border-[#27272a] hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <span className={`px-2 py-0.5 text-[11px] font-medium rounded-md border ${cfg.class}`}>{cfg.label}</span>
                </div>
                <h2 className="text-base font-semibold text-white group-hover:text-amber-400 transition-colors mb-2">{souk.title}</h2>
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span>{souk.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span>{new Date(souk.date).toLocaleDateString("fr-FR")} à {souk.startTime}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#27272a]">
                  <span className="text-xs text-zinc-600">{souk.organizer.name}</span>
                  <span className="text-xs text-zinc-500">
                    <span className="text-amber-400 font-medium">{souk._count.vehicles}</span> véhicules
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
