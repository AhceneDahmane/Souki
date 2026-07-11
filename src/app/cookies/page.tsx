import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique des cookies",
  description: "Découvrez comment Souki utilise les cookies pour améliorer votre expérience.",
};

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[var(--fg-base)] mb-2">Politique des cookies</h1>
      <p className="text-sm text-[var(--fg-muted)] mb-8">Dernière mise à jour : juillet 2026</p>

      <div className="space-y-6 text-sm text-[var(--fg-muted)] leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-[var(--fg-base)] mb-2">1. Qu'est-ce qu'un cookie ?</h2>
          <p>Un cookie est un petit fichier texte stocké sur votre navigateur lors de la visite d'un site web. Il permet de reconnaître votre appareil et de mémoriser vos préférences.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--fg-base)] mb-2">2. Cookies utilisés</h2>
          <div className="space-y-3">
            <div className="p-3 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
              <p className="text-sm font-medium text-[var(--fg-base)]">souki_token</p>
              <p className="text-xs mt-1">Cookie d'authentification (7 jours). Essentiel au fonctionnement.</p>
            </div>
            <div className="p-3 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
              <p className="text-sm font-medium text-[var(--fg-base)]">souki_theme</p>
              <p className="text-xs mt-1">Stocke votre préférence de thème (clair/sombre). Persistant.</p>
            </div>
            <div className="p-3 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
              <p className="text-sm font-medium text-[var(--fg-base)]">souki_lang</p>
              <p className="text-xs mt-1">Stocke votre préférence de langue (fr/ar). Persistant.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--fg-base)] mb-2">3. Gestion des cookies</h2>
          <p>Vous pouvez configurer votre navigateur pour refuser les cookies. Cependant, certaines fonctionnalités de Souki (notamment l'authentification) ne fonctionneront plus sans le cookie de session.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--fg-base)] mb-2">4. Cookies tiers</h2>
          <p>Souki n'utilise pas de cookies tiers à des fins publicitaires ou de tracking. La plateforme utilise Leaflet/OpenStreetMap pour l'affichage de la carte des souks, qui peut déposer des cookies de session.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--fg-base)] mb-2">5. Contact</h2>
          <p>Pour toute question concernant les cookies, contactez-nous à contact@souki.dz.</p>
        </section>
      </div>
    </div>
  );
}
