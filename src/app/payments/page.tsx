"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";

type Payment = {
  id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  souk: { title: string } | null;
  createdAt: string;
};

export default function PaymentsPage() {
  const { refresh } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [balance, setBalance] = useState(0);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const fetchPayments = useCallback(async () => {
    try {
      const res = await fetch("/api/payments");
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments);
        setBalance(data.balance);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  async function handleRecharge(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    const amount = parseFloat(rechargeAmount);
    if (!amount || amount <= 0) {
      setMessage({ text: "Montant invalide", ok: false });
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/payments/recharge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance);
        setMessage({ text: `+${amount.toLocaleString("fr-FR")} DZD crédités`, ok: true });
        setRechargeAmount("");
        fetchPayments();
        await refresh();
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

  const presets = [1000, 5000, 10000, 50000, 100000];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[var(--fg-base)] mb-2">Portefeuille</h1>
      <p className="text-sm text-[var(--fg-muted)] mb-8">Gérez votre solde et consultez vos transactions</p>

      {/* Balance */}
      <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-xl border border-amber-500/20 p-6 mb-6">
        <p className="text-xs text-amber-400/80 mb-1">Solde disponible</p>
        <p className="text-3xl font-bold text-amber-400">{balance.toLocaleString("fr-FR")} DZD</p>
      </div>

      {/* Recharge */}
      <form onSubmit={handleRecharge} className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6 mb-6">
        <h2 className="text-sm font-semibold text-[var(--fg-base)] mb-4">Recharger (simulation)</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setRechargeAmount(p.toString())}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                rechargeAmount === p.toString()
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  : "text-[var(--fg-muted)] border-[var(--border-color)] hover:border-[var(--bg-surface-hover)]"
              }`}
            >
              {p.toLocaleString("fr-FR")} DZD
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            type="number"
            value={rechargeAmount}
            onChange={(e) => setRechargeAmount(e.target.value)}
            placeholder="Montant personnalisé"
            className="flex-1 px-3 py-2 text-sm bg-[var(--bg-card-alt)] border border-[var(--border-color)] rounded-lg text-[var(--fg-base)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-amber-500/50"
          />
          <button
            type="submit"
            disabled={loading || !rechargeAmount}
            className="px-4 py-2 text-sm font-medium text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? "..." : "Recharger"}
          </button>
        </div>
        {message && (
          <p className={`text-xs mt-3 ${message.ok ? "text-green-400" : "text-red-400"}`}>{message.text}</p>
        )}
      </form>

      {/* Transaction history */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6">
        <h2 className="text-sm font-semibold text-[var(--fg-base)] mb-4">Historique des transactions</h2>

        {payments.length === 0 ? (
          <p className="text-sm text-[var(--fg-muted)] text-center py-8">Aucune transaction</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-[var(--bg-card-alt)] rounded-lg border border-[var(--border-color)]">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    p.amount > 0 ? "bg-green-500/10" : "bg-red-500/10"
                  }`}>
                    {p.amount > 0 ? (
                      <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    ) : (
                      <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--fg-base)]">{p.description}</p>
                    <p className="text-[11px] text-[var(--fg-muted)]">{new Date(p.createdAt).toLocaleString("fr-FR")}</p>
                  </div>
                </div>
                <p className={`text-sm font-semibold ${p.amount > 0 ? "text-green-400" : "text-red-400"}`}>
                  {p.amount > 0 ? "+" : ""}{p.amount.toLocaleString("fr-FR")} DZD
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
