"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SoukWithRelations = {
  id: string;
  title: string;
  description: string | null;
  location: string;
  date: Date;
  startTime: string;
  endTime: string | null;
  spots: number;
  spotPrice: number;
  services: string | null;
  status: string;
  registrations: Array<{
    id: string;
    spotNumber: number | null;
    qrCode: string;
    status: string;
    seller: { name: string; email: string; phone: string | null };
  }>;
  vehicles: Array<{
    id: string;
    title: string;
    price: number | null;
    priceType: string;
    seller: { name: string };
  }>;
};

export default function ManageSoukClient({ souk }: { souk: SoukWithRelations }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function updateStatus(newStatus: string) {
    setMessage("");
    try {
      const res = await fetch(`/api/organizer/souks/${souk.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        setMessage(data.error || "Erreur");
      }
    } catch {
      setMessage("Erreur réseau");
    }
  }

  async function handleRegistrationAction(registrationId: string, action: "accepted" | "rejected") {
    try {
      const res = await fetch(`/api/souks/${souk.id}/register`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId, action }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      setMessage("Erreur");
    }
  }

  async function assignSpot(registrationId: string) {
    const spot = prompt("Numéro d'emplacement :");
    if (!spot) return;
    try {
      const res = await fetch(`/api/souks/${souk.id}/register`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId, action: "present", spotNumber: parseInt(spot) }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      setMessage("Erreur");
    }
  }

  const getStatusClass = (status: string) => {
    const configs: Record<string, string> = {
      active: "bg-green-500/10 text-green-400 border-green-500/20",
      pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return configs[status] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  };

  const getRegStatusClass = (status: string) => {
    const configs: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-400",
      accepted: "bg-green-500/10 text-green-400",
      present: "bg-blue-500/10 text-blue-400",
      rejected: "bg-red-500/10 text-red-400",
    };
    return configs[status] || "bg-zinc-500/10 text-zinc-400";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">{souk.title}</h1>
            <span className={`px-2 py-0.5 text-[11px] font-medium rounded-md border ${getStatusClass(souk.status)}`}>
              {souk.status === "active" ? "Actif" :
               souk.status === "pending" ? "À venir" :
               souk.status === "completed" ? "Terminé" : "Annulé"}
            </span>
          </div>
          <p className="text-sm text-zinc-500">{souk.location} · {new Date(souk.date).toLocaleDateString("fr-FR")}</p>
        </div>
        <div className="flex gap-3">
          {souk.status === "pending" && (
            <button
              onClick={() => updateStatus("active")}
              className="px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-medium rounded-lg hover:bg-green-500/20 transition-all"
            >
              Commencer l&apos;enchère
            </button>
          )}
          {souk.status === "active" && (
            <button
              onClick={() => updateStatus("completed")}
              className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-medium rounded-lg hover:bg-red-500/20 transition-all"
            >
              Arrêter l&apos;enchère
            </button>
          )}
        </div>
      </div>
      {message && <p className="text-sm text-red-400 mb-4">{message}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inscriptions */}
        <div className="bg-[#18181b] rounded-xl border border-[#27272a] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Inscriptions</h2>
            <span className="text-xs text-zinc-500">{souk.registrations.length}/{souk.spots}</span>
          </div>
          {souk.registrations.length === 0 ? (
            <p className="text-sm text-zinc-600 text-center py-8">Aucune inscription</p>
          ) : (
            <div className="space-y-2">
              {souk.registrations.map((reg) => (
                <div key={reg.id} className="p-3 bg-[#0a0a0b] rounded-lg border border-[#27272a]">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-white">{reg.seller.name}</p>
                      <p className="text-xs text-zinc-500">{reg.seller.email}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-[11px] font-medium rounded-md ${getRegStatusClass(reg.status)}`}>
                      {reg.status === "pending" ? "En attente" :
                       reg.status === "accepted" ? "Accepté" :
                       reg.status === "present" ? "Présent" : "Refusé"}
                    </span>
                  </div>
                  {reg.spotNumber && (
                    <p className="text-xs text-zinc-500 mb-2">Emplacement n°{reg.spotNumber}</p>
                  )}
                  <div className="flex gap-2">
                    {reg.status === "pending" && (
                      <>
                        <button onClick={() => handleRegistrationAction(reg.id, "accepted")}
                          className="text-xs px-2.5 py-1 bg-green-500/10 text-green-400 rounded-md hover:bg-green-500/20 transition-all">
                          Accepter
                        </button>
                        <button onClick={() => handleRegistrationAction(reg.id, "rejected")}
                          className="text-xs px-2.5 py-1 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500/20 transition-all">
                          Refuser
                        </button>
                      </>
                    )}
                    {reg.status === "accepted" && (
                      <button onClick={() => assignSpot(reg.id)}
                        className="text-xs px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-md hover:bg-blue-500/20 transition-all">
                        Scanner QR & attribuer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Véhicules */}
        <div className="bg-[#18181b] rounded-xl border border-[#27272a] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Véhicules</h2>
            <span className="text-xs text-zinc-500">{souk.vehicles.length} inscrits</span>
          </div>
          {souk.vehicles.length === 0 ? (
            <p className="text-sm text-zinc-600 text-center py-8">Aucun véhicule</p>
          ) : (
            <div className="space-y-2">
              {souk.vehicles.map((v) => (
                <div key={v.id} className="p-3 bg-[#0a0a0b] rounded-lg border border-[#27272a]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{v.title}</p>
                      <p className="text-xs text-zinc-500">{v.seller.name}</p>
                    </div>
                    <span className="text-sm font-medium text-amber-400">
                      {v.price ? `${v.price.toLocaleString("fr-FR")} €` : "Négociable"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
