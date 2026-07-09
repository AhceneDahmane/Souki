"use client";

import { useState } from "react";

export default function BidButton({ vehicleId }: { vehicleId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  async function handleBid(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId, amount: parseFloat(amount) }),
      });
      if (res.ok) {
        setMessage("Enchère enregistrée !");
        setAmount("");
        setShowForm(false);
        setTimeout(() => setMessage(""), 3000);
      } else {
        const data = await res.json();
        setMessage(data.error || "Erreur");
      }
    } catch {
      setMessage("Erreur réseau");
    }
  }

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        className="text-xs px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-all duration-200"
      >
        Enchérir
      </button>
      {showForm && (
        <form onSubmit={handleBid} className="mt-2 flex gap-2">
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Montant (€)"
            className="w-24 px-2 py-1 text-xs bg-[#0a0a0b] border border-[#27272a] rounded-lg text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50"
            required
          />
          <button
            type="submit"
            className="text-xs px-3 py-1.5 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-all"
          >
            Envoyer
          </button>
          {message && <p className="text-xs text-green-400 self-center">{message}</p>}
        </form>
      )}
    </div>
  );
}
