"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("visitor");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, phone: phone || undefined }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur d'inscription");
        return;
      }

      const roleRedirect: Record<string, string> = {
        VISITEUR: "/visitor/dashboard",
        VENDEUR: "/seller/dashboard",
        ORGANISATEUR: "/organizer/dashboard",
      };
      router.push(roleRedirect[data.user.role] || "/");
      router.refresh();
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white text-center mb-8">Inscription</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm text-zinc-400 mb-1">Nom</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-[#27272a] bg-[#18181b] px-3 py-2 text-white placeholder-zinc-500 outline-none focus:border-amber-500"
              placeholder="Votre nom"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-zinc-400 mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[#27272a] bg-[#18181b] px-3 py-2 text-white placeholder-zinc-500 outline-none focus:border-amber-500"
              placeholder="exemple@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-zinc-400 mb-1">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[#27272a] bg-[#18181b] px-3 py-2 text-white placeholder-zinc-500 outline-none focus:border-amber-500"
              placeholder="Au moins 6 caractères"
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm text-zinc-400 mb-1">Je suis</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-[#27272a] bg-[#18181b] px-3 py-2 text-white outline-none focus:border-amber-500"
            >
              <option value="visitor">Visiteur</option>
              <option value="seller">Vendeur</option>
              <option value="organizer">Organisateur</option>
            </select>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm text-zinc-400 mb-1">Téléphone (optionnel)</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-[#27272a] bg-[#18181b] px-3 py-2 text-white placeholder-zinc-500 outline-none focus:border-amber-500"
              placeholder="+213 555 XX XX XX"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-500 px-4 py-2 font-medium text-black hover:bg-amber-400 disabled:opacity-50 transition-all"
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-amber-500 hover:text-amber-400">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
