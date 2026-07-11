import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description: "Consultez les conditions générales d'utilisation de la plateforme Souki.",
};

export default function CGUPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[var(--fg-base)] mb-2">Conditions Générales d'Utilisation</h1>
      <p className="text-sm text-[var(--fg-muted)] mb-8">Dernière mise à jour : juillet 2026</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-6 text-sm text-[var(--fg-muted)] leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-[var(--fg-base)] mb-2">1. Objet</h2>
          <p>Les présentes CGU régissent l'utilisation de la plateforme Souki, service SaaS de mise en relation entre organisateurs de souks automobiles, vendeurs et acheteurs en Algérie.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--fg-base)] mb-2">2. Définitions</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Organisateur</strong> : utilisateur créant et gérant un souk</li>
            <li><strong>Vendeur</strong> : utilisateur inscrivant des véhicules à un souk</li>
            <li><strong>Visiteur</strong> : utilisateur consultant les véhicules et participant aux enchères</li>
            <li><strong>Souk</strong> : événement automobile organisé via la plateforme</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--fg-base)] mb-2">3. Création de compte</h2>
          <p>L'utilisateur s'engage à fournir des informations exactes et à ne pas créer de comptes multiples. Chaque utilisateur ne peut posséder qu'un seul compte.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--fg-base)] mb-2">4. Tarifs et paiements</h2>
          <p>Les tarifs sont affichés en DZD (Dinar Algérien). Le premier souk et le premier véhicule sont gratuits. Les frais sont déduits du portefeuille virtuel de l'utilisateur. Aucun remboursement n'est effectué après activation d'un souk.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--fg-base)] mb-2">5. Responsabilités</h2>
          <p>Souki agit comme intermédiaire technique. La plateforme n'est pas responsable de la qualité des véhicules, de la tenue des souks, ou des transactions entre vendeurs et acheteurs.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--fg-base)] mb-2">6. Données personnelles</h2>
          <p>Les données collectées sont utilisées uniquement dans le cadre du fonctionnement de la plateforme. Conformément à la loi 18-07 relative à la protection des données personnelles, vous disposez d'un droit d'accès, de rectification et de suppression.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--fg-base)] mb-2">7. Contact</h2>
          <p>Pour toute question, contactez-nous via la page Contact ou à contact@souki.dz.</p>
        </section>
      </div>
    </div>
  );
}
