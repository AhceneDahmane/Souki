import Link from "next/link";

const plans = [
  {
    name: "Visiteur",
    price: "Gratuit",
    period: "",
    description: "Parfait pour explorer et enchérir",
    features: [
      "Voir tous les souks disponibles",
      "Consulter les véhicules inscrits",
      "Enchérir en temps réel",
      "Scanner les QR codes des véhicules",
    ],
    href: "/souks",
    cta: "Voir les souks",
    popular: false,
  },
  {
    name: "Vendeur",
    price: "99 DZD",
    period: "/souk",
    description: "Pour les vendeurs particuliers et professionnels",
    features: [
      "Inscrire jusqu'à 5 véhicules par souk",
      "QR code d'accès au souk",
      "QR code par véhicule pour les visiteurs",
      "Prix négociable ou fixe",
      "Tableau de bord dédié",
    ],
    href: "/seller/dashboard",
    cta: "Commencer à vendre",
    popular: false,
  },
  {
    name: "Organisateur",
    price: "499 DZD",
    period: "/souk",
    description: "Pour organiser vos propres souks automobiles",
    features: [
      "Créer des souks illimités",
      "Gérer les inscriptions en temps réel",
      "Scan de QR codes à l'entrée",
      "Attribution des emplacements",
      "Contrôle des enchères (start/stop)",
      "Statistiques et rapport",
    ],
    href: "/organizer/dashboard",
    cta: "Organiser un souk",
    popular: true,
  },
];

const steps = [
  {
    num: "01",
    title: "L'organisateur crée un souk",
    desc: "Définissez le lieu, la date, le nombre de places et les services proposés sur place.",
    color: "from-amber-500 to-amber-600",
  },
  {
    num: "02",
    title: "Les vendeurs s'inscrivent",
    desc: "Inscrivez vos véhicules avec photos et prix. Un QR code d'accès est généré automatiquement.",
    color: "from-amber-400 to-amber-500",
  },
  {
    num: "03",
    title: "Arrivée sur place",
    desc: "L'organisateur scanne votre QR code et vous attribue un emplacement dans le souk.",
    color: "from-amber-500 to-amber-600",
  },
  {
    num: "04",
    title: "QR code véhicule",
    desc: "Imprimez le QR code de votre véhicule pour que les visiteurs puissent scanner et voir les infos.",
    color: "from-amber-400 to-amber-500",
  },
  {
    num: "05",
    title: "Les visiteurs explorent",
    desc: "Parcourez les souks, scannez les QR codes et enchérissez en temps réel sur les véhicules.",
    color: "from-amber-500 to-amber-600",
  },
  {
    num: "06",
    title: "Enchères en direct",
    desc: "Suivez les enchères en temps réel et obtenez le véhicule au prix souhaité.",
    color: "from-amber-400 to-amber-500",
  },
];

const testimonials = [
  {
    name: "Karim B.",
    role: "Organisateur, Alger",
    avatar: "KB",
    text: "Souki a révolutionné l'organisation de mes souks automobiles. La gestion des inscriptions et des QR codes me fait gagner un temps précieux.",
    rating: 5,
  },
  {
    name: "Sarah M.",
    role: "Vendeuse, Oran",
    avatar: "SM",
    text: "J'ai vendu ma voiture en un week-end grâce à Souki. Les enchères en direct ont fait monter le prix bien au-dessus de mes attentes !",
    rating: 5,
  },
  {
    name: "Amine K.",
    role: "Visiteur, Constantine",
    avatar: "AK",
    text: "Enfin une plateforme qui centralise tous les souks automobiles. Très pratique pour comparer les offres et enchérir facilement.",
    rating: 4,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < rating ? "text-amber-400" : "text-[#27272a]"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.12)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(59,130,246,0.05)_0%,_transparent_50%)]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#27272a] bg-[#18181b] text-xs text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Plateforme SaaS lancée en 2026
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
            Le souk auto
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
              nouvelle génération
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-zinc-400 leading-relaxed">
            Organisez, vendez et enchérissez sur les plus beaux véhicules.
            Une plateforme moderne qui connecte organisateurs, vendeurs et acheteurs
            autour des souks automobiles.
          </p>

          <div className="flex items-center justify-center gap-4 pt-2">
            <Link
              href="/souks"
              className="px-6 py-3 bg-amber-500 text-black font-medium rounded-xl hover:bg-amber-400 transition-all duration-200 shadow-lg shadow-amber-500/25"
            >
              Explorer les souks
            </Link>
            <Link
              href="/organizer/dashboard"
              className="px-6 py-3 border border-[#27272a] text-zinc-300 font-medium rounded-xl hover:bg-[#18181b] transition-all duration-200"
            >
              Organiser un souk
            </Link>
          </div>

          <div className="flex justify-center gap-6 pt-4 text-xs text-zinc-600">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Inscription gratuite
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Enchères en temps réel
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              QR codes sécurisés
            </span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-3 gap-4 p-6 bg-[#18181b] rounded-2xl border border-[#27272a]">
          {[
            { value: "50+", label: "Souks organisés" },
            { value: "500+", label: "Véhicules vendus" },
            { value: "2000+", label: "Utilisateurs actifs" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-7xl mx-auto px-4 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Comment ça marche</h2>
          <p className="text-zinc-500 mt-2">Du début à la fin, tout est simplifié</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {steps.slice(0, 3).map((step) => (
            <div key={step.num} className="group relative p-6 bg-[#18181b] rounded-xl border border-[#27272a] hover:border-amber-500/30 transition-all duration-300">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 text-sm font-bold text-black`}>
                {step.num}
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-amber-400 transition-colors mb-2">{step.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto mt-4">
          {steps.slice(3).map((step) => (
            <div key={step.num} className="group relative p-6 bg-[#18181b] rounded-xl border border-[#27272a] hover:border-amber-500/30 transition-all duration-300">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 text-sm font-bold text-black`}>
                {step.num}
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-amber-400 transition-colors mb-2">{step.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-4 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Nos offres</h2>
          <p className="text-zinc-500 mt-2">Choisissez le profil qui vous correspond</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-6 rounded-xl border transition-all duration-300 ${
                plan.popular
                  ? "bg-gradient-to-b from-amber-500/5 to-transparent border-amber-500/40"
                  : "bg-[#18181b] border-[#27272a] hover:border-amber-500/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-500 text-black text-[11px] font-semibold rounded-full">
                  Populaire
                </div>
              )}
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <p className="text-sm text-zinc-500 mt-1">{plan.description}</p>
              </div>
              <div className="mb-5">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-sm text-zinc-500">{plan.period}</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-400">
                    <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block text-center py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  plan.popular
                    ? "bg-amber-500 text-black hover:bg-amber-400"
                    : "border border-[#27272a] text-zinc-300 hover:bg-[#27272a]"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-4 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Ce qu&apos;ils disent</h2>
          <p className="text-zinc-500 mt-2">Ils ont déjà adopté Souki</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t.name} className="p-5 bg-[#18181b] rounded-xl border border-[#27272a] hover:border-amber-500/20 transition-all duration-300">
              <StarRating rating={t.rating} />
              <p className="text-sm text-zinc-300 mt-3 mb-4 leading-relaxed">{t.text}</p>
              <div className="flex items-center gap-3 pt-3 border-t border-[#27272a]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-xs font-bold text-black">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-zinc-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-4xl mx-auto px-4 pb-20">
        <div className="relative p-8 md:p-12 bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-2xl border border-amber-500/20 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.08)_0%,_transparent_60%)]" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Prêt à rejoindre Souki ?
            </h2>
            <p className="text-zinc-400 mb-6 max-w-lg mx-auto">
              Rejoignez des centaines d&apos;organisateurs et vendeurs qui utilisent déjà Souki
              pour leurs souks automobiles.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/souks"
                className="px-6 py-3 bg-amber-500 text-black font-medium rounded-xl hover:bg-amber-400 transition-all duration-200"
              >
                Commencer gratuitement
              </Link>
              <Link
                href="/organizer/dashboard"
                className="px-6 py-3 border border-[#27272a] text-zinc-300 font-medium rounded-xl hover:bg-[#18181b] transition-all duration-200"
              >
                Organiser un souk
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#27272a] py-8">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <span className="text-[10px] font-bold text-black">S</span>
            </div>
            <span className="text-sm text-zinc-400">Souki</span>
          </div>
          <p className="text-xs text-zinc-600">© 2026 Souki. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
