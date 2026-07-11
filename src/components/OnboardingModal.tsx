"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

const steps: { title: string; desc: string; icon: string }[] = [
  {
    title: "Bienvenue sur Souki",
    desc: "La plateforme qui connecte organisateurs, vendeurs et acheteurs autour des souks automobiles en Algérie.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    title: "Choisissez votre profil",
    desc: "Visiteur : explorez et enchérissez. Vendeur : inscrivez vos véhicules. Organisateur : créez et gérez vos souks.",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    title: "Rechargez votre portefeuille",
    desc: "Créez votre premier souk et inscrivez votre premier véhicule gratuitement. Les suivants sont payants. Rechargez depuis la page Paiements.",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Participez aux enchères",
    desc: "Les visiteurs peuvent enchérir en temps réel pendant le souk. Les mises à jour sont automatiques toutes les 5 secondes.",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  },
  {
    title: "C'est parti !",
    desc: "Explorez les souks, inscrivez vos véhicules ou créez votre événement. Besoin d'aide ? Consultez la FAQ.",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

export default function OnboardingModal() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!user) return;
    const seen = localStorage.getItem("souki_onboarding_seen");
    if (!seen) {
      setOpen(true);
    }
  }, [user]);

  function dismiss() {
    localStorage.setItem("souki_onboarding_seen", "1");
    setOpen(false);
  }

  function next() {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      dismiss();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={steps[step].icon} />
          </svg>
        </div>

        <h2 className="text-lg font-semibold text-white text-center mb-2">{steps[step].title}</h2>
        <p className="text-sm text-zinc-400 text-center leading-relaxed mb-8">{steps[step].desc}</p>

        <div className="flex items-center justify-center gap-1.5 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === step ? "bg-amber-500 w-4" : "bg-zinc-600"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={dismiss}
            className="flex-1 py-2 text-sm text-zinc-400 border border-[#27272a] rounded-lg hover:bg-[#27272a] transition-all"
          >
            Passer
          </button>
          <button
            onClick={next}
            className="flex-1 py-2 text-sm font-medium text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition-all"
          >
            {step < steps.length - 1 ? "Suivant" : "Commencer"}
          </button>
        </div>
      </div>
    </div>
  );
}
