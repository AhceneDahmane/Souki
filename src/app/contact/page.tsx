"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[var(--fg-base)] mb-2">Contact</h1>
      <p className="text-sm text-[var(--fg-muted)] mb-8">Une question, une suggestion ? Écrivez-nous.</p>

      {sent ? (
        <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
          <p className="text-green-400 font-medium">Message envoyé !</p>
          <p className="text-sm text-zinc-400 mt-1">Nous vous répondrons dans les plus brefs délais.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-color)]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--fg-base)] mb-1">Nom *</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[var(--bg-card-alt)] border border-[var(--border-color)] rounded-lg text-[var(--fg-base)] focus:outline-none focus:border-amber-500/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--fg-base)] mb-1">Email *</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[var(--bg-card-alt)] border border-[var(--border-color)] rounded-lg text-[var(--fg-base)] focus:outline-none focus:border-amber-500/50" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--fg-base)] mb-1">Sujet *</label>
            <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[var(--bg-card-alt)] border border-[var(--border-color)] rounded-lg text-[var(--fg-base)] focus:outline-none focus:border-amber-500/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--fg-base)] mb-1">Message *</label>
            <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[var(--bg-card-alt)] border border-[var(--border-color)] rounded-lg text-[var(--fg-base)] focus:outline-none focus:border-amber-500/50 resize-none" />
          </div>
          <button type="submit"
            className="w-full py-2.5 text-sm font-medium text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition-all">
            Envoyer
          </button>
        </form>
      )}

      <div className="mt-8 p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
        <p className="text-sm font-medium text-[var(--fg-base)]">Autres moyens</p>
        <p className="text-xs text-[var(--fg-muted)] mt-1">contact@souki.dz</p>
      </div>
    </div>
  );
}
