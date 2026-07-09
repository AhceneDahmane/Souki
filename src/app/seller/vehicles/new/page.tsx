"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function NewVehicleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedSoukId = searchParams.get("soukId");

  const [loading, setLoading] = useState(false);
  const [souks, setSouks] = useState<Array<{ id: string; title: string; location: string; date: string }>>([]);
  const [form, setForm] = useState({
    title: "",
    brand: "",
    model: "",
    year: "",
    mileage: "",
    fuelType: "",
    description: "",
    price: "",
    priceType: "negotiable",
    soukId: preselectedSoukId || "",
  });

  useEffect(() => {
    fetch("/api/souks?status=pending,active")
      .then((res) => res.json())
      .then((data) => setSouks(data))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          year: form.year ? parseInt(form.year) : null,
          mileage: form.mileage ? parseInt(form.mileage) : null,
          price: form.price ? parseFloat(form.price) : null,
        }),
      });
      if (res.ok) {
        router.push("/seller/dashboard");
      } else {
        const data = await res.json();
        alert(data.error || "Erreur");
      }
    } catch {
      alert("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const inputClass = "w-full px-3 py-2.5 bg-[#0a0a0b] border border-[#27272a] rounded-lg text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors text-sm";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Ajouter un véhicule</h1>
        <p className="text-sm text-zinc-500 mt-1">Inscrivez votre véhicule à un souk</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-[#18181b] p-6 rounded-xl border border-[#27272a]">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Souk *</label>
          <select required value={form.soukId} onChange={(e) => update("soukId", e.target.value)} className={inputClass}>
            <option value="">Sélectionnez un souk</option>
            {souks.map((s) => (
              <option key={s.id} value={s.id}>{s.title} - {s.location}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Titre *</label>
          <input type="text" required value={form.title} onChange={(e) => update("title", e.target.value)}
            className={inputClass} placeholder="Ex: Renault Clio 4 1.5 dCi" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Marque *</label>
            <input type="text" required value={form.brand} onChange={(e) => update("brand", e.target.value)}
              className={inputClass} placeholder="Ex: Renault" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Modèle *</label>
            <input type="text" required value={form.model} onChange={(e) => update("model", e.target.value)}
              className={inputClass} placeholder="Ex: Clio 4" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Année</label>
            <input type="number" value={form.year} onChange={(e) => update("year", e.target.value)}
              className={inputClass} placeholder="2020" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Kilométrage</label>
            <input type="number" value={form.mileage} onChange={(e) => update("mileage", e.target.value)}
              className={inputClass} placeholder="50000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Carburant</label>
            <select value={form.fuelType} onChange={(e) => update("fuelType", e.target.value)} className={inputClass}>
              <option value="">Sélectionner</option>
              <option value="essence">Essence</option>
              <option value="diesel">Diesel</option>
              <option value="electrique">Électrique</option>
              <option value="hybride">Hybride</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Description</label>
          <textarea value={form.description} onChange={(e) => update("description", e.target.value)}
            className={`${inputClass} resize-none`} rows={3} placeholder="Description du véhicule..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Prix souhaité (€)</label>
            <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => update("price", e.target.value)}
              className={inputClass} placeholder="Optionnel" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Type de prix *</label>
            <select required value={form.priceType} onChange={(e) => update("priceType", e.target.value)} className={inputClass}>
              <option value="negotiable">Négociable</option>
              <option value="fixed">Prix fixe</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-2.5 bg-amber-500 text-black text-sm font-medium rounded-lg hover:bg-amber-400 disabled:opacity-50 transition-all duration-200">
          {loading ? "Ajout en cours..." : "Ajouter le véhicule"}
        </button>
      </form>
    </div>
  );
}

export default function NewVehiclePage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><p className="text-zinc-500">Chargement...</p></div>}>
      <NewVehicleForm />
    </Suspense>
  );
}
