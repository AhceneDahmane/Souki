import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Questions fréquentes sur Souki : inscriptions, tarifs, enchères, QR codes et plus.",
};

const faqs = [
  {
    q: "Qu'est-ce que Souki ?",
    a: "Souki est une plateforme SaaS qui connecte organisateurs, vendeurs et acheteurs autour des souks automobiles en Algérie. Les organisateurs créent des événements, les vendeurs inscrivent leurs véhicules, et les visiteurs peuvent enchérir en temps réel.",
  },
  {
    q: "Comment créer un compte ?",
    a: "Cliquez sur 'Connexion' puis 'Créer un compte'. Choisissez votre profil : visiteur, vendeur ou organisateur. Vous recevrez un email de confirmation.",
  },
  {
    q: "Combien coûte l'inscription ?",
    a: "La création d'un compte est gratuite. Le premier souk est offert (499 DZD les suivants). Le premier véhicule est offert (199 DZD les suivants). Les frais d'inscription à un souk sont définis par l'organisateur.",
  },
  {
    q: "Comment fonctionnent les enchères ?",
    a: "Les visiteurs peuvent enchérir sur les véhicules en temps réel pendant la durée du souk. L'enchérisseur le plus élevé à la fin du souk remporte le véhicule. Les enchères sont mises à jour toutes les 5 secondes.",
  },
  {
    q: "Comment payer ?",
    a: "Vous pouvez recharger votre portefeuille depuis la page 'Paiements'. Les montants sont crédités instantanément (simulation). Utilisez votre solde pour créer des souks, inscrire des véhicules ou vous inscrire à un événement.",
  },
  {
    q: "Puis-je modifier mes informations ?",
    a: "Oui, rendez-vous sur votre profil (icône utilisateur dans la barre de navigation) pour modifier votre nom, téléphone ou mot de passe.",
  },
  {
    q: "Comment fonctionne le QR code ?",
    a: "Chaque véhicule inscrit reçoit un QR code unique. Imprimez-le et déposez-le sur le véhicule le jour du souk. Les visiteurs le scannent pour voir les détails et enchérir.",
  },
  {
    q: "Puis-je annuler mon inscription ?",
    a: "Contactez l'organisateur du souk. Les annulations et remboursements sont traités au cas par cas.",
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[var(--fg-base)] mb-2">FAQ</h1>
      <p className="text-sm text-[var(--fg-muted)] mb-8">Questions fréquentes sur Souki</p>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details key={i} className="group bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden">
            <summary className="px-4 py-3.5 text-sm font-medium text-[var(--fg-base)] cursor-pointer hover:bg-[var(--bg-surface-hover)] transition-colors list-none flex items-center justify-between">
              {faq.q}
              <svg className="w-4 h-4 text-zinc-500 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-4 pb-4 pt-1">
              <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{faq.a}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
