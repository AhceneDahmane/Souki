"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function EditVehiclePage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);
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
  });
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/vehicles/${params.id}`);
        if (!res.ok) {
          if (res.status === 404) setNotFound(true);
          return;
        }
        const v = await res.json();
        if (v.sellerId !== user?.id) {
          setNotFound(true);
          return;
        }
        setForm({
          title: v.title,
          brand: v.brand,
          model: v.model,
          year: v.year?.toString() || "",
          mileage: v.mileage?.toString() || "",
          fuelType: v.fuelType || "",
          description: v.description || "",
          price: v.price?.toString() || "",
          priceType: v.priceType,
        });
        if (v.images) {
          const imgs = JSON.parse(v.images);
          if (imgs.length > 0) setImage(imgs[0]);
        }
      } catch {
        setNotFound(true);
      } finally {
        setFetching(false);
      }
    }
    load();
  }, [params.id, user?.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/vehicles/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          brand: form.brand,
          model: form.model,
          year: form.year ? parseInt(form.year) : null,
          mileage: form.mileage ? parseInt(form.mileage) : null,
          fuelType: form.fuelType || null,
          description: form.description || null,
          price: form.price ? parseFloat(form.price) : null,
          priceType: form.priceType,
          images: image ? JSON.stringify([image]) : null,
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

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-sm text-zinc-500">Chargement...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-zinc-500">Véhicule introuvable ou accès non autorisé</p>
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2.5 bg-[#0a0a0b] border border-[#27272a] rounded-lg text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors text-sm";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Modifier le véhicule</h1>
        <p className="text-sm text-zinc-500 mt-1">Mettez à jour les informations de votre véhicule</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-[#18181b] p-6 rounded-xl border border-[#27272a]">
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

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Photo du véhicule</label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0b] border border-[#27272a] rounded-lg text-sm text-zinc-400 hover:border-amber-500/50 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {uploading ? "Upload..." : "Choisir une image"}
              <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                try {
                  const fd = new FormData();
                  fd.append("file", file);
                  const res = await fetch("/api/upload", { method: "POST", body: fd });
                  const data = await res.json();
                  if (res.ok) setImage(data.url);
                  else alert(data.error || "Erreur upload");
                } catch {
                  alert("Erreur réseau");
                } finally {
                  setUploading(false);
                }
              }} />
            </label>
            {image && (
              <button type="button" onClick={() => setImage("")}
                className="text-xs text-red-400 hover:text-red-300 transition-colors">
                Supprimer
              </button>
            )}
          </div>
          {image && (
            <div className="mt-3 relative w-32 h-24 rounded-lg overflow-hidden border border-[#27272a]">
              <img src={image} alt="Aperçu" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Prix souhaité (DZD)</label>
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
          {loading ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
}
