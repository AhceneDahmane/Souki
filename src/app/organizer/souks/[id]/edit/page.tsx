"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditSoukPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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

  useEffect(() => {
    fetch(`/api/souks/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          router.push("/organizer/dashboard");
          return;
        }
        setForm({
          title: data.title || "",
          description: data.description || "",
          location: data.location || "",
          date: data.date ? data.date.slice(0, 10) : "",
          startTime: data.startTime || "",
          endTime: data.endTime || "",
          spots: String(data.spots || ""),
          spotPrice: String(data.spotPrice || ""),
          services: data.services || "",
        });
      })
      .catch(() => router.push("/organizer/dashboard"))
      .finally(() => setFetching(false));
  }, [params.id, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/souks/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push(`/organizer/souks/${params.id}`);
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

  const inputClass = "w-full px-3 py-2.5 bg-[#0a0a0b] border border-[#27272a] rounded-lg text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors text-sm";

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-sm text-zinc-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href={`/organizer/souks/${params.id}`}
        className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-4"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Retour au souk
      </Link>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Modifier le souk</h1>
        <p className="text-sm text-zinc-500 mt-1">{form.title || "Sans titre"}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-[#18181b] p-6 rounded-xl border border-[#27272a]">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Titre *</label>
          <input type="text" required value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Description</label>
          <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className={`${inputClass} resize-none`} rows={3} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Lieu *</label>
            <input type="text" required value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Date *</label>
            <input type="date" required value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className={`${inputClass} [color-scheme:dark]`} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Début *</label>
            <input type="time" required value={form.startTime} onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))} className={`${inputClass} [color-scheme:dark]`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Fin</label>
            <input type="time" value={form.endTime} onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))} className={`${inputClass} [color-scheme:dark]`} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Places *</label>
            <input type="number" required min="1" value={form.spots} onChange={(e) => setForm((p) => ({ ...p, spots: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Prix/place (DZD) *</label>
            <input type="number" required min="0" step="0.01" value={form.spotPrice} onChange={(e) => setForm((p) => ({ ...p, spotPrice: e.target.value }))} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Services</label>
          <textarea value={form.services} onChange={(e) => setForm((p) => ({ ...p, services: e.target.value }))} className={`${inputClass} resize-none`} rows={2} />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="flex-1 py-2.5 bg-amber-500 text-black text-sm font-medium rounded-lg hover:bg-amber-400 disabled:opacity-50 transition-all duration-200">
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
          <Link href={`/organizer/souks/${params.id}`}
            className="px-4 py-2.5 border border-[#27272a] text-zinc-400 text-sm font-medium rounded-lg hover:bg-[#27272a] transition-all duration-200">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
