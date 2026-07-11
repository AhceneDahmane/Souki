"use client";

import { useSettings } from "@/lib/settings-context";

export default function SettingsPage() {
  const { theme, lang, setTheme, setLang } = useSettings();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[var(--fg-base)] mb-2">Paramètres</h1>
      <p className="text-sm text-[var(--fg-muted)] mb-8">Personnalisez votre expérience</p>

      <div className="space-y-6">
        {/* Theme */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6">
          <h2 className="text-sm font-semibold text-[var(--fg-base)] mb-1">Thème</h2>
          <p className="text-xs text-[var(--fg-muted)] mb-4">Choisissez entre le mode sombre et le mode clair</p>
          <div className="flex gap-3">
            {[
              { value: "dark" as const, label: "Sombre", icon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" },
              { value: "light" as const, label: "Clair", icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
                  theme === opt.value
                    ? "border-amber-500 bg-amber-500/5 text-amber-400"
                    : "border-[var(--border-color)] text-[var(--fg-muted)] hover:border-[var(--bg-surface-hover)]"
                }`}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={opt.icon} /></svg>
                <span className="text-sm font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6">
          <h2 className="text-sm font-semibold text-[var(--fg-base)] mb-1">Langue</h2>
          <p className="text-xs text-[var(--fg-muted)] mb-4">Choisissez la langue de l&apos;interface</p>
          <div className="flex gap-3">
            {[
              { value: "fr" as const, label: "Français", flag: "🇫🇷" },
              { value: "ar" as const, label: "العربية", flag: "🇩🇿" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setLang(opt.value)}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
                  lang === opt.value
                    ? "border-amber-500 bg-amber-500/5 text-amber-400"
                    : "border-[var(--border-color)] text-[var(--fg-muted)] hover:border-[var(--bg-surface-hover)]"
                }`}
              >
                <span className="text-2xl">{opt.flag}</span>
                <span className="text-sm font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
          {lang === "ar" && (
            <p className="text-[11px] text-[var(--fg-muted)] mt-3">
              ⚠️ La traduction arabe n&apos;est pas encore complète. Seule l&apos;interface de base est traduite.
            </p>
          )}
        </div>

        {/* Info */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6">
          <h2 className="text-sm font-semibold text-[var(--fg-base)] mb-1">À propos</h2>
          <p className="text-xs text-[var(--fg-muted)]">
            Souki v1.0.0 · Plateforme de mise en relation pour souks automobiles en Algérie.
          </p>
        </div>
      </div>
    </div>
  );
}
