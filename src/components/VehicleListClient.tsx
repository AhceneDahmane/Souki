"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Vehicle = {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number | null;
  mileage: number | null;
  fuelType: string | null;
  description: string | null;
  price: number | null;
  priceType: string;
  images: string | null;
  qrCode: string | null;
  status: string;
  soukId: string | null;
  souk: { title: string } | null;
};

export default function VehicleListClient({ initial }: { initial: Vehicle[] }) {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>(initial);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function deleteVehicle(id: string) {
    if (!confirm("Supprimer ce véhicule ?")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
      if (res.ok) {
        setVehicles((prev) => prev.filter((v) => v.id !== id));
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Erreur");
      }
    } catch {
      alert("Erreur réseau");
    } finally {
      setActionLoading(null);
    }
  }

  async function duplicateVehicle(v: Vehicle) {
    setActionLoading(v.id);
    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${v.title} (copie)`,
          brand: v.brand,
          model: v.model,
          year: v.year,
          mileage: v.mileage,
          fuelType: v.fuelType,
          description: v.description,
          price: v.price,
          priceType: v.priceType,
          images: v.images,
        }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Erreur");
      }
    } catch {
      alert("Erreur réseau");
    } finally {
      setActionLoading(null);
    }
  }

  const getVClass = (s: string) => {
    const m: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-400",
      assigned: "bg-green-500/10 text-green-400",
      sold: "bg-blue-500/10 text-blue-400",
    };
    return m[s] || "bg-zinc-500/10 text-zinc-400";
  };

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12 bg-[#18181b] rounded-xl border border-[#27272a]">
        <p className="text-sm text-zinc-600">Aucun véhicule ajouté</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {vehicles.map((v) => (
        <div key={v.id} className="bg-[#18181b] rounded-xl border border-[#27272a] p-4 flex items-center justify-between hover:border-zinc-700 transition-all">
          <div className="flex items-center gap-3">
            {v.images ? (
              <img src={JSON.parse(v.images)[0]} alt={v.title} className="w-12 h-12 rounded-lg object-cover border border-[#27272a]" />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-zinc-700/30 to-zinc-800/30 flex items-center justify-center">
                <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
            )}
            <div>
              <Link href={`/vehicles/${v.id}`} className="text-sm font-medium text-white hover:text-amber-400 transition-colors">{v.title}</Link>
              <p className="text-xs text-zinc-500">{v.souk?.title || "Non assigné"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-amber-400">
              {v.price ? `${v.price.toLocaleString("fr-FR")} DZD` : "Négociable"}
            </span>
            <span className={`px-2 py-0.5 text-[11px] font-medium rounded-md ${getVClass(v.status)}`}>
              {v.status === "pending" ? "En attente" : v.status === "assigned" ? "Attribué" : "Vendu"}
            </span>
            <button
              onClick={() => duplicateVehicle(v)}
              disabled={actionLoading === v.id}
              className="p-1.5 border border-[#27272a] text-zinc-500 rounded-lg hover:bg-[#27272a] hover:text-zinc-300 transition-all disabled:opacity-50"
              title="Dupliquer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </button>
            <Link
              href={`/seller/vehicles/${v.id}/edit`}
              className="p-1.5 border border-[#27272a] text-zinc-500 rounded-lg hover:bg-[#27272a] hover:text-zinc-300 transition-all"
              title="Modifier"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </Link>
            <button
              onClick={() => deleteVehicle(v.id)}
              disabled={actionLoading === v.id}
              className="p-1.5 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/10 transition-all disabled:opacity-50"
              title="Supprimer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
