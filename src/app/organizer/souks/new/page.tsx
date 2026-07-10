"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSoukPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    spots: "",
    spotPrice: "",
    services: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/souks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          spots: parseInt(form.spots),
          spotPrice: parseFloat(form.spotPrice),
        }),
      });
      if (res.ok) {
        router.push("/organizer/dashboard");
      } else {
        const data = await res.json();
        alert(data.error || "Erreur lors de la création");
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Créer un souk</h1>
        <p className="text-sm text-zinc-500 mt-1">Configurez votre événement automobile</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-[#18181b] p-6 rounded-xl border border-[#27272a]">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Titre du souk *</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="w-full px-3 py-2.5 bg-[#0a0a0b] border border-[#27272a] rounded-lg text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
            placeholder="Ex: Souk Auto Alger Mai 2026"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="w-full px-3 py-2.5 bg-[#0a0a0b] border border-[#27272a] rounded-lg text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors text-sm resize-none"
            rows={3}
            placeholder="Description du souk..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Lieu *</label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              className="w-full px-3 py-2.5 bg-[#0a0a0b] border border-[#27272a] rounded-lg text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
              placeholder="Ex: Alger Centre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Date *</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              className="w-full px-3 py-2.5 bg-[#0a0a0b] border border-[#27272a] rounded-lg text-zinc-300 focus:outline-none focus:border-amber-500/50 transition-colors text-sm [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Heure début *</label>
            <input
              type="time"
              required
              value={form.startTime}
              onChange={(e) => update("startTime", e.target.value)}
              className="w-full px-3 py-2.5 bg-[#0a0a0b] border border-[#27272a] rounded-lg text-zinc-300 focus:outline-none focus:border-amber-500/50 transition-colors text-sm [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Heure fin</label>
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => update("endTime", e.target.value)}
              className="w-full px-3 py-2.5 bg-[#0a0a0b] border border-[#27272a] rounded-lg text-zinc-300 focus:outline-none focus:border-amber-500/50 transition-colors text-sm [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Nombre de places *</label>
            <input
              type="number"
              required
              min="1"
              value={form.spots}
              onChange={(e) => update("spots", e.target.value)}
              className="w-full px-3 py-2.5 bg-[#0a0a0b] border border-[#27272a] rounded-lg text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Prix par place (DZD) *</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={form.spotPrice}
              onChange={(e) => update("spotPrice", e.target.value)}
              className="w-full px-3 py-2.5 bg-[#0a0a0b] border border-[#27272a] rounded-lg text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Services proposés (optionnel)</label>
          <textarea
            value={form.services}
            onChange={(e) => update("services", e.target.value)}
            className="w-full px-3 py-2.5 bg-[#0a0a0b] border border-[#27272a] rounded-lg text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors text-sm resize-none"
            rows={2}
            placeholder="Ex: Café offert, station de lavage, photographie..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-amber-500 text-black text-sm font-medium rounded-lg hover:bg-amber-400 disabled:opacity-50 transition-all duration-200"
        >
          {loading ? "Création en cours..." : "Créer le souk"}
        </button>
      </form>
    </div>
  );
}
