"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

type BidInfo = {
  id: string;
  amount: number;
  visitorName: string;
  createdAt: string;
};

export default function VehicleDetailClient({
  vehicleId,
  highestBid: initialHighest,
  bidsCount: initialCount,
  initialBids,
}: {
  vehicleId: string;
  highestBid: number | null;
  bidsCount: number;
  initialBids: BidInfo[];
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [highestBid, setHighestBid] = useState(initialHighest);
  const [bidsCount, setBidsCount] = useState(initialCount);
  const [bids, setBids] = useState<BidInfo[]>(initialBids);
  const [live, setLive] = useState(false);

  const fetchBids = useCallback(async () => {
    try {
      const res = await fetch(`/api/bids?vehicleId=${vehicleId}`);
      if (!res.ok) return;
      const data: { id: string; amount: number; visitor: { name: string }; createdAt: string }[] = await res.json();
      setBids(data.map((b) => ({ id: b.id, amount: b.amount, visitorName: b.visitor.name, createdAt: b.createdAt })));
      setHighestBid(data[0]?.amount ?? null);
      setBidsCount(data.length);
      setLive(true);
    } catch {
      // silently fail
    }
  }, [vehicleId]);

  useEffect(() => {
    fetchBids();
    const interval = setInterval(fetchBids, 5000);
    return () => clearInterval(interval);
  }, [fetchBids]);

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
        fetchBids();
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
    <div className="bg-[#18181b] rounded-xl border border-[#27272a] p-6">
      <h3 className="text-sm font-semibold text-white mb-4">Enchérir</h3>

      {/* Live indicator */}
      {bids.length > 0 && live && (
        <div className="flex items-center gap-1.5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[11px] text-green-400">Temps réel</span>
        </div>
      )}

      {bidsCount === 0 && (
        <p className="text-xs text-zinc-500 mb-4">Soyez le premier à enchérir</p>
      )}

      {/* Current highest bid */}
      {highestBid !== null && (
        <div className="mb-4 p-3 bg-amber-500/5 rounded-lg border border-amber-500/20 text-center">
          <p className="text-[11px] text-zinc-500 mb-0.5">Meilleure offre</p>
          <p className="text-lg font-bold text-amber-400">{highestBid.toLocaleString("fr-FR")} DZD</p>
          <p className="text-[11px] text-zinc-500">{bidsCount} offre{bidsCount > 1 ? "s" : ""}</p>
        </div>
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

      {/* Bid History */}
      {bids.length > 0 && (
        <div className="mt-6 pt-6 border-t border-[#27272a]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Historique</h3>
            <span className="text-xs text-zinc-500">{bidsCount} offre{bidsCount > 1 ? "s" : ""}</span>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {bids.map((bid, i) => (
              <div key={bid.id} className={`flex items-center justify-between p-3 rounded-lg border ${i === 0 ? "bg-amber-500/5 border-amber-500/20" : "bg-[#0a0a0b] border-[#27272a]"}`}>
                <div className="flex items-center gap-2">
                  {i === 0 && (
                    <span className="text-xs text-amber-500 font-medium">🏆</span>
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{bid.visitorName}</p>
                    <p className="text-[11px] text-zinc-500">{new Date(bid.createdAt).toLocaleString("fr-FR")}</p>
                  </div>
                </div>
                <p className={`text-sm font-semibold ${i === 0 ? "text-amber-400" : "text-zinc-300"}`}>
                  {bid.amount.toLocaleString("fr-FR")} DZD
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
