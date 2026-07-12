"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function CguAcceptPage() {
  const router = useRouter();
  const { user, refresh: refreshAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAccept() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/profile/cgu", { method: "PATCH" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur");
        return;
      }
      await refreshAuth();
      const roleRedirect: Record<string, string> = {
        visitor: "/visitor/dashboard",
        seller: "/seller/dashboard",
        organizer: "/organizer/dashboard",
        admin: "/admin",
      };
      router.replace(roleRedirect[user?.role || "visitor"] || "/");
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[var(--fg-base)] mb-2">Conditions Générales d&apos;Utilisation</h1>
      <p className="text-sm text-zinc-500 mb-8">Veuillez accepter les CGU pour continuer à utiliser Souki.</p>

      <div className="bg-[#18181b] rounded-xl border border-[#27272a] p-6 mb-8 max-h-96 overflow-y-auto">
        <div className="space-y-6 text-sm text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-white mb-2">1. Objet</h2>
            <p>Les présentes CGU régissent l&apos;utilisation de la plateforme Souki, service SaaS de mise en relation entre organisateurs de souks automobiles, vendeurs et acheteurs en Algérie.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-2">2. Définitions</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Organisateur</strong> : utilisateur créant et gérant un souk</li>
              <li><strong>Vendeur</strong> : utilisateur inscrivant des véhicules à un souk</li>
              <li><strong>Visiteur</strong> : utilisateur consultant les véhicules et participant aux enchères</li>
              <li><strong>Souk</strong> : événement automobile organisé via la plateforme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-2">3. Création de compte</h2>
            <p>L&apos;utilisateur s&apos;engage à fournir des informations exactes et à ne pas créer de comptes multiples.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-2">4. Tarifs et paiements</h2>
            <p>Les tarifs sont affichés en DZD. Le premier souk et le premier véhicule sont gratuits. Les frais sont déduits du portefeuille virtuel.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-2">5. Responsabilités</h2>
            <p>Souki agit comme intermédiaire technique et n&apos;est pas responsable de la qualité des véhicules ou des transactions.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-2">6. Données personnelles</h2>
            <p>Conformément à la loi 18-07, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données.</p>
          </section>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</div>
      )}

      <button
        onClick={handleAccept}
        disabled={loading}
        className="w-full rounded-lg bg-amber-500 px-4 py-2 font-medium text-black hover:bg-amber-400 disabled:opacity-50 transition-all"
      >
        {loading ? "Traitement..." : "J&apos;accepte les conditions générales"}
      </button>
    </div>
  );
}
