"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function VehicleDetailClient({
  vehicleId,
  highestBid,
  bidsCount,
}: {
  vehicleId: string;
  highestBid: number | null;
  bidsCount: number;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleBid(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const val = parseFloat(amount);
    if (highestBid && val <= highestBid) {
      setMessage({ text: `L'enchère doit dépasser ${highestBid.toLocaleString("fr-FR")} DZD`, ok: false });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId, amount: val }),
      });
      if (res.ok) {
        setMessage({ text: "Enchère enregistrée ! 🎉", ok: true });
        setAmount("");
        setTimeout(() => setMessage(null), 3000);
        router.refresh();
      } else {
        const data = await res.json();
        setMessage({ text: data.error || "Erreur", ok: false });
      }
    } catch {
      setMessage({ text: "Erreur réseau", ok: false });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {bidsCount === 0 && (
        <p className="text-xs text-zinc-500 mb-4">Soyez le premier à enchérir</p>
      )}

      <form onSubmit={handleBid} className="space-y-3">
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Votre offre (DZD)</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={highestBid ? `Min. ${highestBid + 1} DZD` : "Montant"}
            className="w-full px-3 py-2 text-sm bg-[#0a0a0b] border border-[#27272a] rounded-lg text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
            required
            min={highestBid ? highestBid + 1 : 1}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 text-sm font-medium text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Envoi..." : "Enchérir"}
        </button>
      </form>

      {message && (
        <p className={`text-xs mt-3 ${message.ok ? "text-green-400" : "text-red-400"}`}>
          {message.text}
        </p>
      )}

      {!user && (
        <p className="text-[11px] text-zinc-600 mt-4 text-center">
          <Link href="/login" className="text-amber-400 hover:underline">Connectez-vous</Link> pour enchérir
        </p>
      )}
    </div>
  );
}
