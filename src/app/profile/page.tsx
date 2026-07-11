"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  const router = useRouter();
  const { user, refresh } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [pwMessage, setPwMessage] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "");
    }
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      if (res.ok) {
        setMessage({ text: "Profil mis à jour !", ok: true });
        await refresh();
      } else {
        const data = await res.json();
        setMessage({ text: data.error || "Erreur", ok: false });
      }
    } catch {
      setMessage({ text: "Erreur réseau", ok: false });
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setChangingPassword(true);
    setPwMessage(null);
    try {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        setPwMessage({ text: "Mot de passe changé !", ok: true });
        setCurrentPassword("");
        setNewPassword("");
      } else {
        const data = await res.json();
        setPwMessage({ text: data.error || "Erreur", ok: false });
      }
    } catch {
      setPwMessage({ text: "Erreur réseau", ok: false });
    } finally {
      setChangingPassword(false);
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[var(--fg-base)] mb-2">Profil</h1>
      <p className="text-sm text-[var(--fg-muted)] mb-8">Gérez vos informations personnelles</p>

      <div className="space-y-6">
        {/* Infos générales */}
        <form onSubmit={handleSave} className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--fg-base)]">Informations générales</h2>

          <div>
            <label className="block text-xs text-[var(--fg-muted)] mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-3 py-2 text-sm bg-[var(--bg-card-alt)] border border-[var(--border-color)] rounded-lg text-[var(--fg-muted)] cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--fg-muted)] mb-1">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[var(--bg-card-alt)] border border-[var(--border-color)] rounded-lg text-[var(--fg-base)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-amber-500/50 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--fg-muted)] mb-1">Téléphone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[var(--bg-card-alt)] border border-[var(--border-color)] rounded-lg text-[var(--fg-base)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-amber-500/50 transition-colors"
              placeholder="+213 XXX XX XX XX"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition-all disabled:opacity-50"
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
            {message && (
              <p className={`text-xs ${message.ok ? "text-green-400" : "text-red-400"}`}>{message.text}</p>
            )}
          </div>
        </form>

        {/* Mot de passe */}
        <form onSubmit={handleChangePassword} className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--fg-base)]">Changer le mot de passe</h2>

          <div>
            <label className="block text-xs text-[var(--fg-muted)] mb-1">Mot de passe actuel</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[var(--bg-card-alt)] border border-[var(--border-color)] rounded-lg text-[var(--fg-base)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-amber-500/50 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--fg-muted)] mb-1">Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[var(--bg-card-alt)] border border-[var(--border-color)] rounded-lg text-[var(--fg-base)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-amber-500/50 transition-colors"
              placeholder="Minimum 6 caractères"
              required
              minLength={6}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={changingPassword}
              className="px-4 py-2 text-sm font-medium text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition-all disabled:opacity-50"
            >
              {changingPassword ? "Modification..." : "Changer le mot de passe"}
            </button>
            {pwMessage && (
              <p className={`text-xs ${pwMessage.ok ? "text-green-400" : "text-red-400"}`}>{pwMessage.text}</p>
            )}
          </div>
        </form>

        {/* Rôle */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6">
          <h2 className="text-sm font-semibold text-[var(--fg-base)] mb-1">Compte</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--fg-muted)]">Rôle :</span>
            <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full border ${
              user.role === "admin" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
              user.role === "organizer" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
              user.role === "seller" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
              "bg-green-500/10 text-green-400 border-green-500/20"
            }`}>
              {user.role === "admin" ? "Admin" : user.role === "organizer" ? "Organisateur" : user.role === "seller" ? "Vendeur" : "Visiteur"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
