"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Souk = { id: string; title: string; location: string; date: string; startTime: string };
type Vehicle = { id: string; title: string; brand: string; model: string; images: string | null };

export default function RegisterSoukPage() {
  const router = useRouter();
  const [souks, setSouks] = useState<Souk[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedSouk, setSelectedSouk] = useState("");
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/souks?status=pending,active")
      .then((r) => r.json())
      .then(setSouks)
      .catch(() => {});
    fetch("/api/vehicles")
      .then((r) => r.json())
      .then((data) => setVehicles(data.filter((v: { soukId: string | null }) => !v.soukId)))
      .catch(() => {});
  }, []);

  function toggleVehicle(id: string) {
    setSelectedVehicles((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSouk || selectedVehicles.length === 0) {
      setError("Veuillez sélectionner un souk et au moins un véhicule");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/souks/${selectedSouk}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleIds: selectedVehicles }),
      });
      if (res.ok) {
        router.push("/seller/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Erreur");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "w-full px-3 py-2.5 bg-[#0a0a0b] border border-[#27272a] rounded-lg text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors text-sm";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Inscription à un souk</h1>
        <p className="text-sm text-zinc-500 mt-1">Choisissez un souk et sélectionnez les véhicules à inscrire</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <p className="text-sm text-red-400 p-3 bg-red-500/10 rounded-lg border border-red-500/20">{error}</p>
        )}

        <div className="bg-[#18181b] rounded-xl border border-[#27272a] p-5">
          <h2 className="text-sm font-semibold text-white mb-3">Souk</h2>
          {souks.length === 0 ? (
            <p className="text-sm text-zinc-600">Aucun souk disponible</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {souks.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setSelectedSouk(s.id)}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    selectedSouk === s.id
                      ? "border-amber-500/50 bg-amber-500/5"
                      : "border-[#27272a] hover:border-zinc-600"
                  }`}
                >
                  <p className="text-sm font-medium text-white">{s.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{s.location}</p>
                  <p className="text-xs text-zinc-500">{new Date(s.date).toLocaleDateString("fr-FR")} à {s.startTime}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#18181b] rounded-xl border border-[#27272a] p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">Véhicules disponibles</h2>
            <span className="text-xs text-zinc-500">{selectedVehicles.length} sélectionné(s)</span>
          </div>
          {vehicles.length === 0 ? (
            <p className="text-sm text-zinc-600">Aucun véhicule disponible. <a href="/seller/vehicles/new" className="text-amber-400 hover:underline">Ajoutez-en un d&apos;abord</a></p>
          ) : (
            <div className="space-y-2">
              {vehicles.map((v) => (
                <button
                  type="button"
                  key={v.id}
                  onClick={() => toggleVehicle(v.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    selectedVehicles.includes(v.id)
                      ? "border-amber-500/50 bg-amber-500/5"
                      : "border-[#27272a] hover:border-zinc-600"
                  }`}
                >
                  {v.images ? (
                    <img src={JSON.parse(v.images)[0]} alt={v.title} className="w-10 h-10 rounded-lg object-cover border border-[#27272a]" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-zinc-700/30 to-zinc-800/30 flex items-center justify-center">
                      <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">{v.title}</p>
                    <p className="text-xs text-zinc-500">{v.brand} · {v.model}</p>
                  </div>
                  <div className="ml-auto">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                      selectedVehicles.includes(v.id)
                        ? "border-amber-500 bg-amber-500"
                        : "border-zinc-600"
                    }`}>
                      {selectedVehicles.includes(v.id) && (
                        <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting || !selectedSouk || selectedVehicles.length === 0}
          className="w-full py-2.5 bg-amber-500 text-black text-sm font-medium rounded-lg hover:bg-amber-400 disabled:opacity-50 transition-all"
        >
          {submitting ? "Inscription..." : `S'inscrire (${selectedVehicles.length} véhicule${selectedVehicles.length > 1 ? "s" : ""})`}
        </button>
      </form>
    </div>
  );
}
